import numpy as np
from typing import Dict, List, Any

class OverlapCalc:
    """
    Calculates portfolio overlap mathematically weighted by allocation percentages.
    """
    
    @staticmethod
    def calculate_pairwise_overlap(fund1_holdings: List[Dict[str, Any]], 
                                   fund2_holdings: List[Dict[str, Any]]) -> float:
        """
        Computes the weighted Jaccard similarity between two funds using NumPy.
        Formula: sum(min(weightA, weightB)) / sum(max(weightA, weightB))
        """
        all_stocks = set()
        f1_dict = {}
        f2_dict = {}
        
        for h in fund1_holdings:
            stock = h['stock_name'].strip().lower()
            all_stocks.add(stock)
            f1_dict[stock] = float(h['weight'])
            
        for h in fund2_holdings:
            stock = h['stock_name'].strip().lower()
            all_stocks.add(stock)
            f2_dict[stock] = float(h['weight'])
            
        stocks_list = list(all_stocks)
        
        # NumPy Arrays for fast weighted Jaccard similarity calculation
        arr1 = np.array([f1_dict.get(s, 0.0) for s in stocks_list])
        arr2 = np.array([f2_dict.get(s, 0.0) for s in stocks_list])
        
        max_vector = np.maximum(arr1, arr2)
        if np.sum(max_vector) == 0:
            return 0.0
            
        # Weighted Jaccard Similarity Computation
        numerator = np.sum(np.minimum(arr1, arr2))
        denominator = np.sum(max_vector)
        
        overlap_score = (numerator / denominator) * 100.0
        return overlap_score

    @staticmethod
    def generate_overlap_report(funds_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Generates a full report highlighting massive overlays across multiple funds.
        Format expectation: "73% overlap across 3 large-cap funds"
        """
        fund_names = list(funds_data.keys())
        n = len(fund_names)
        
        if n < 2:
            return {
                "summary": "Need at least 2 funds to calculate overlap.",
                "global_overlap_percentage": 0.0,
                "pairwise_overlaps": []
            }
            
        pairwise_overlaps = []
        high_overlap_count = 0
        
        for i in range(n):
            for j in range(i + 1, n):
                fund1 = fund_names[i]
                fund2 = fund_names[j]
                
                overlap = OverlapCalc.calculate_pairwise_overlap(
                    funds_data[fund1], funds_data[fund2]
                )
                
                pairwise_overlaps.append({
                    "fund1": fund1,
                    "fund2": fund2,
                    "overlap_percentage": round(overlap, 2)
                })
                
                if overlap > 50.0:
                    high_overlap_count += 1
                    
        # Calculate N-way overlap (global intersection logic)
        all_stocks = set()
        for f in fund_names:
            for h in funds_data[f]:
                all_stocks.add(h['stock_name'].strip().lower())
                
        stocks_list = list(all_stocks)
        weight_matrix = np.zeros((n, len(stocks_list)))
        
        for idx, fund in enumerate(fund_names):
            f_dict = {h['stock_name'].strip().lower(): float(h['weight']) for h in funds_data[fund]}
            weight_matrix[idx] = np.array([f_dict.get(s, 0.0) for s in stocks_list])
        
        min_weights = np.min(weight_matrix, axis=0)
        max_weights = np.max(weight_matrix, axis=0)
        
        global_overlap = 0.0
        if np.sum(max_weights) > 0:
            global_overlap = (np.sum(min_weights) / np.sum(max_weights)) * 100.0
            
        # Formatting output to highlight massive overlays per the requirement
        summary_message = ""
        # High global subset meaning all of them share common holdings heavily
        if global_overlap > 30.0 and n >= 3:
            summary_message = f"{round(global_overlap)}% overlap across {n} funds (e.g. large-cap funds)"
        elif high_overlap_count > 0:
            highest = max(pairwise_overlaps, key=lambda x: x["overlap_percentage"])
            summary_message = f"Massive overlay detected: {highest['overlap_percentage']}% overlap between {highest['fund1']} and {highest['fund2']}"
        else:
            summary_message = "Portfolio is well diversified with minimal overlaps."
            
        return {
            "summary": summary_message,
            "global_overlap_percentage": round(global_overlap, 2),
            "pairwise_overlaps": sorted(pairwise_overlaps, key=lambda x: x["overlap_percentage"], reverse=True)
        }
