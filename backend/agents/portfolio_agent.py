import anthropic
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PortfolioAgent:
    """
    AI Agent that acts as a financial advisor utilizing Anthropic's Claude.
    Generates plain-English, actionable rebalancing plans based on mathematical portfolio data.
    """
    
    SYSTEM_PROMPT = (
        "You are an expert, SEBI-registered financial advisor. Your job is to analyze quantitative "
        "portfolio metrics (XIRR, Overlap, Expense Ratios) and provide a concise, plain-English "
        "rebalancing plan for a retail investor. Be objective, avoid overly technical jargon, "
        "and give clear actionable insights."
    )

    @staticmethod
    async def generate_rebalancing_plan(xirr: float, overlap_data: Dict[str, Any], expense_drag: float) -> str:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not found. Returning mocked AI response.")
            return "Mock Plan: Consider reducing your 73% overlap across large-cap funds and switching to direct options to lower that expense ratio drag."
            
        client = anthropic.AsyncAnthropic(api_key=api_key)
        
        # Format the complex math output into a string for the LLM
        overlap_summary = overlap_data.get('summary', 'No significant overlaps detected.')
        
        prompt = (
            f"Here is the user's portfolio data:\n"
            f"- Current Annualized Return (XIRR): {xirr}%\n"
            f"- Portfolio Overlap Summary: {overlap_summary}\n"
            f"- Estimated Expense Ratio Drag: {expense_drag}%\n\n"
            "Based on this data, write a 3-paragraph plain-English rebalancing plan."
        )
        
        try:
            response = await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=500,
                system=PortfolioAgent.SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Failed to generate rebalancing plan: {str(e)}")
            return "We encountered an issue generating your AI advisory plan. Please try again later."
