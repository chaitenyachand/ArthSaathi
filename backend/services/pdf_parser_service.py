import io
import re
import logging
from typing import Optional, List
from datetime import datetime
from fastapi import UploadFile
import pdfplumber

from models.pdf_models import CamsData, CamsTransaction, Form16Data

logger = logging.getLogger(__name__)

class PDFParserService:
    """
    A service to handle robust, strictly in-memory parsing of financial PDFs for ArthSaathi.
    Absolutely NO disk writes are performed to maintain highest privacy standards.
    """

    @staticmethod
    async def parse_cams_statement(file: UploadFile) -> CamsData:
        """
        Parses a CAMS mutual fund statement and extracts transactions.
        Takes advantage of async memory read, preserving privacy.
        """
        # Read everything into memory at once
        file_bytes = await file.read()
        return PDFParserService._parse_cams_from_bytes(file_bytes)

    @staticmethod
    def _parse_cams_from_bytes(file_bytes: bytes) -> CamsData:
        data = CamsData()
        current_scheme = None
        
        try:
            # Load PDF entirely from bytes memory buffer
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text() or ""
                    
                    # 1. Structural Regex for PAN
                    if not data.pan:
                        pan_match = re.search(r'PAN\s*[:\-]?\s*([A-Z]{5}[0-9]{4}[A-Z]{1})', text, re.IGNORECASE)
                        if pan_match:
                            data.pan = pan_match.group(1).upper()
                    
                    # 2. Extract transaction tables robustly with headers heuristic
                    tables = page.extract_tables()
                    for table in tables:
                        if not table: continue
                        
                        header_idx = -1
                        # We dynamically find the row that has our date, amount, units markers
                        for idx, row in enumerate(table):
                            row_text = ' '.join(str(cell).upper() for cell in row if cell)
                            # Checking for usual CAMS CAS columns
                            if 'DATE' in row_text and 'AMOUNT' in row_text and ('UNIT' in row_text or 'NAV' in row_text):
                                header_idx = idx
                                break
                        
                        if header_idx != -1:
                            headers = [str(c).upper().strip() for c in table[header_idx] if c]
                            
                            date_idx = next((i for i, h in enumerate(headers) if 'DATE' in h), None)
                            amt_idx = next((i for i, h in enumerate(headers) if 'AMOUNT' in h), None)
                            unit_idx = next((i for i, h in enumerate(headers) if 'UNIT' in h), None)
                            nav_idx = next((i for i, h in enumerate(headers) if 'NAV' in h or 'PRICE' in h), None)
                            
                            if date_idx is None or amt_idx is None:
                                continue # Cannot parse this table instance, fallback
                                
                            # Parse rows below header
                            for row in table[header_idx+1:]:
                                # Discard empty rows or short rows
                                if not row or len(row) <= max(filter(lambda x: x is not None, [date_idx, amt_idx, unit_idx, nav_idx])):
                                    continue
                                    
                                date_str = str(row[date_idx]).strip()
                                amt_str = str(row[amt_idx]).strip()
                                
                                if not date_str or not amt_str: continue
                                
                                # Try date parsing (CAMS usually uses dd-b-yyyy e.g. 15-Jan-2023)
                                try:
                                    parsed_date = datetime.strptime(date_str, "%d-%b-%Y").date()
                                except ValueError:
                                    continue # Skip if not a transaction row
                                    
                                # Safety Parse Math Floats
                                try:
                                    # Handle amounts like '(10,000.00)' as negatives
                                    clean_amt = amt_str.replace(',', '').replace('(', '-').replace(')', '').strip()
                                    amt = float(clean_amt)
                                    
                                    units = 0.0
                                    if unit_idx is not None and row[unit_idx]:
                                        clean_unit = str(row[unit_idx]).replace(',', '').strip()
                                        if clean_unit and clean_unit != '-':
                                            units = float(clean_unit)
                                            
                                    nav = 0.0
                                    if nav_idx is not None and row[nav_idx]:
                                        clean_nav = str(row[nav_idx]).replace(',', '').strip()
                                        if clean_nav and clean_nav != '-' and clean_nav.count('.') <= 1:
                                            nav = float(clean_nav)
                                            
                                    # Fallback transaction append
                                    data.transactions.append(CamsTransaction(
                                        date=parsed_date,
                                        amount=amt,
                                        units=units,
                                        nav=nav,
                                        scheme_name=current_scheme,
                                        transaction_type="unknown"
                                    ))
                                except ValueError:
                                    # Numbers did not parse on this row, ignore gracefully 
                                    continue
                                    
        except Exception as e:
            logger.error(f"Error parsing CAMS PDF: {e}")
            raise ValueError(f"Failed to parse CAMS statement directly from memory: {str(e)}")
            
        return data

    @staticmethod
    async def parse_form16(file: UploadFile) -> Form16Data:
        """
        Parses Form 16 directly from memory to extract Salary, Deductions, and Tax.
        """
        file_bytes = await file.read()
        return PDFParserService._parse_form16_from_bytes(file_bytes)

    @staticmethod
    def _parse_form16_from_bytes(file_bytes: bytes) -> Form16Data:
        data = Form16Data()
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                full_text = ""
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted: full_text += extracted + "\n"
                
                # Try PAN Extraction
                pan_match = re.search(r'PAN\s*of\s*the\s*Employee[\s\n:]*([A-Z]{5}[0-9]{4}[A-Z]{1})', full_text, re.IGNORECASE)
                if pan_match:
                    data.pan = pan_match.group(1).upper()
                    
                lines = full_text.split('\n')
                
                def extract_number_from_line(s: str) -> float:
                    """Regex fallback to isolate and parse the largest financial number strictly"""
                    nums = re.findall(r'\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b', s)
                    if nums:
                        try:
                            # We take the last number assuming format `Label ..... Amount`
                            return float(nums[-1].replace(',', ''))
                        except ValueError:
                            pass
                    return 0.0

                for line in lines:
                    line_lower = line.lower()
                    
                    if "gross salary" in line_lower:
                        data.gross_salary = max(data.gross_salary, extract_number_from_line(line))
                    elif "section 80c" in line_lower:
                        data.deduction_80c = max(data.deduction_80c, extract_number_from_line(line))
                    elif ("80ccd" in line_lower or "80 ccd" in line_lower) and "1b" in line_lower:
                        data.deduction_80ccd1b = max(data.deduction_80ccd1b, extract_number_from_line(line))
                    elif "80d" in line_lower and "health" in line_lower:
                        data.deduction_80d = max(data.deduction_80d, extract_number_from_line(line))
                    elif "tax payable" in line_lower or "total tax paid" in line_lower or "tax deducted" in line_lower:
                        data.total_tax_paid = max(data.total_tax_paid, extract_number_from_line(line))
                        
        except Exception as e:
            logger.error(f"Error parsing Form16 PDF: {e}")
            raise ValueError(f"Failed to parse Form 16 from memory: {str(e)}")
            
        return data
