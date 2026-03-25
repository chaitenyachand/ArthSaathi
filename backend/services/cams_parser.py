import pdfplumber
import pandas as pd
import re
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

class CAMSParser:
    """
    Parser for CAMS Consolidated Account Statement PDFs.
    """
    
    # Regex to match a standard date like DD-MMM-YYYY or DD/MM/YYYY
    DATE_PATTERN = re.compile(r"^\s*(\d{2}[-/][A-Za-z]{3}[-/]\d{4}|\d{2}[-/]\d{2}[-/]\d{4})\s+")
    
    @classmethod
    def parse(cls, file_stream: BytesIO) -> pd.DataFrame:
        """
        Extracts mutual fund transactions from a CAMS PDF file.
        Returns a Pandas DataFrame with columns:
        ['date', 'fund_name', 'transaction_type', 'units', 'nav', 'amount']
        """
        transactions = []
        current_fund = "Unknown Fund"
        
        try:
            with pdfplumber.open(file_stream) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if not text:
                        continue
                        
                    lines = text.split('\n')
                    for line in lines:
                        # Heuristic: Find fund name (usually appears after Folio or Scheme)
                        lower_line = line.lower()
                        if "scheme :" in lower_line or "fund name" in lower_line or "scheme" in lower_line:
                            # Extract everything after the colon or keyword as the fund name
                            parts = re.split(r"(?i)scheme\s*:|fund name\s*:|scheme name\s*:", line)
                            if len(parts) > 1:
                                current_fund = parts[-1].strip().strip("-:")
                                
                        # Look for transaction lines starting with a date
                        date_match = cls.DATE_PATTERN.search(line)
                        if date_match:
                            try:
                                parsed_tx = cls._parse_transaction_line(line, date_match.group(1), current_fund)
                                if parsed_tx:
                                    transactions.append(parsed_tx)
                            except Exception as e:
                                logger.warning(f"Error parsing line: {line}. Error: {str(e)}")
                                
        except Exception as e:
            logger.error(f"Failed to parse PDF with pdfplumber: {str(e)}")
            raise ValueError(f"Could not parse the PDF file. It might be password protected or corrupted. Detail: {str(e)}")
            
        df = pd.DataFrame(transactions, columns=["date", "fund_name", "transaction_type", "units", "nav", "amount"])
        
        # Format the date explicitly if possible
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'], infer_datetime_format=True, errors='coerce')
            
        return df

    @classmethod
    def _parse_transaction_line(cls, line: str, date_str: str, fund_name: str) -> dict:
        """
        Parses a single transaction line extracting numbers.
        """
        # Remove commas from thousands separators
        line_clean = re.sub(r'(?<=\d),(?=\d)', '', line)
        
        # Extract all numeric values (positive or negative, with or without decimals)
        numbers = []
        for word in line_clean.split():
            clean_word = word.replace("(", "-").replace(")", "").strip()
            try:
                numbers.append(float(clean_word))
            except ValueError:
                pass
                
        # Standard format typically ends with Balance Units. Before that: Units, NAV, Amount
        # CAMS typical order: Date, Desc, Amount, NAV, Units, Balance
        if len(numbers) >= 3:
            # We will conservatively take the first three amounts as Amount, NAV, Units
            amount = numbers[0]
            nav = numbers[1]
            units = numbers[2]
            
            # Determine Transaction Type
            desc = line_clean.lower()
            if "pur" in desc or "sip" in desc or "buy" in desc:
                ttype = "purchase"
            elif "red" in desc or "sell" in desc or "pay" in desc:
                ttype = "redemption"
            elif "swi" in desc:
                ttype = "switch"
            else:
                ttype = "other"
                
            return {
                "date": date_str,
                "fund_name": fund_name,
                "transaction_type": ttype,
                "units": abs(units), # keeping units positive, transaction type specifies the direction
                "nav": nav,
                "amount": amount
            }
            
        return None
