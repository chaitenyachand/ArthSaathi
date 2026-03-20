import httpx
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class MarketDataService:
    """
    Service to fetch and cache AMFI Mutual Fund NAV data.
    """
    _amfi_cache: Dict[str, Any] = {}

    @classmethod
    async def fetch_amfi_data(cls) -> Dict[str, Any]:
        """
        Fetches the latest NAV data from AMFI and caches it entirely in memory.
        URL: https://www.amfiindia.com/spages/NAVAll.txt
        """
        if cls._amfi_cache:
            return cls._amfi_cache

        url = "https://www.amfiindia.com/spages/NAVAll.txt"
        logger.info("Fetching AMFI NAV Data into memory cache...")
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=15.0)
                response.raise_for_status()
                
            lines = response.text.split('\n')
            for line in lines:
                parts = line.split(';')
                # AMFI TXT format checking for valid data rows
                if len(parts) >= 6 and parts[0].isdigit():
                    scheme_code = parts[0]
                    scheme_name = parts[3].strip()
                    nav_str = parts[4].strip()
                    
                    try:
                        nav_float = float(nav_str)
                        # We use lowered scheme names as keys to facilitate easier cross-referencing
                        cls._amfi_cache[scheme_name.lower()] = {
                            "scheme_code": scheme_code,
                            "scheme_name": scheme_name,
                            "nav": nav_float,
                            "date": parts[5].strip()
                        }
                    except ValueError:
                        continue
                        
            logger.info(f"Successfully cached {len(cls._amfi_cache)} AMFI schemes.")
            return cls._amfi_cache
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch HTTP AMFI data: {e}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error parsing AMFI data: {e}")
            return {}
