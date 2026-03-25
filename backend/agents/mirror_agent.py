import anthropic
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class MirrorAgent:
    """
    Savage Financial Auditor modeled after Gordon Ramsay. 
    Aims to induce behavioral change via mathematical shock and brutal honesty.
    """
    
    SYSTEM_PROMPT = (
        "You are an aggressive, brutally honest financial auditor akin to Gordon Ramsay. "
        "Do not be polite. The user will provide their income, investments, and three dumbest recent discretionary purchases. "
        "Roast their choices mathematically but end with one clear, deeply constructive path to redemption."
    )

    @staticmethod
    async def generate_roast(income: int, investments: int, dumb_purchases: str) -> Dict[str, Any]:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not found. Returning mocked Gordon Ramsay roast.")
            return {
                "roast": (
                    f"Are you absolutely kidding me right now? You make ₹{income:,} and you are only securing ₹{investments:,}? "
                    f"And you blew the rest on '{dumb_purchases}'?! You are hemorrhaging cash like a leaky bucket on a sinking ship. "
                    "You are mathematically sprinting towards a horrific retirement. \n\n"
                    "Now, listen to me closely: Cut up your credit cards tonight. Automate a 30% blind SIP into an Nifty50 Index Fund "
                    "before you even see your paycheck tomorrow morning, and stop acting like you exist in a wealth bracket that you definitively do not!"
                )
            }
            
        client = anthropic.AsyncAnthropic(api_key=api_key)
        prompt = f"My monthly income is ₹{income}. My monthly investments are ₹{investments}. My three dumbest recent purchases were: {dumb_purchases}. Roast me."
        
        try:
            response = await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=600,
                system=MirrorAgent.SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return {"roast": response.content[0].text.strip()}
        except Exception as e:
            logger.error(f"Failed to query Mirror agent: {str(e)}")
            return {"roast": "Even the AI refuses to process your financial disaster right now. (Upstream API Error)"}
