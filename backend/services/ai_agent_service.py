import json
import logging
from typing import Dict, Any
from anthropic import AsyncAnthropic
from config.config import settings

logger = logging.getLogger(__name__)

class AIAgentService:
    """
    Core AI engine utilizing Anthropic's Claude 3.5 Sonnet.
    Provides targeted financial analytics and localized planning through highly-structured prompts.
    """

    @staticmethod
    def _get_client() -> AsyncAnthropic:
        if not settings.ANTHROPIC_API_KEY:
            # We raise a clear error to remind the user to configure the .env
            raise ValueError("ANTHROPIC_API_KEY is not configured in the environment.")
        return AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    @staticmethod
    async def analyze_whatsapp_tip(tip_text: str, nse_volume_data: str) -> Dict[str, Any]:
        """
        Instructs Claude to act as a SEBI-registered forensic analyst.
        Analyzes stock tips against volume data and grades them for risk.
        Requires strict JSON output.
        """
        client = AIAgentService._get_client()
        
        system_prompt = (
            "You are an elite SEBI-registered forensic financial analyst. "
            "Your solemn duty is to analyze stock tips, identify 'pump-and-dump' schemes, and protect retail investors. "
            "You MUST output strictly in valid JSON format ONLY. Do not include any conversational text, wrappers, or markdown formatting outside of the JSON block."
        )
        
        user_prompt = f"""
Please analyze the following stock tip and recent NSE volume data:

Stock Tip:
'''
{tip_text}
'''

NSE Volume Data context:
'''
{nse_volume_data}
'''

Return ONLY a JSON object with this exact structure:
{{
    "grade": "Letter grade from A (safe, fundamentally sound) to F (extreme danger/scam/pump-and-dump)",
    "red_flags": [
        "Flag 1 (e.g., Unrealistic urgency, unsolicited advice)",
        "Flag 2 (e.g., Guaranteed returns)"
    ],
    "analysis_summary": "Short explanation of the grade based on SEBI safety guidelines."
}}
"""
        try:
            response = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                temperature=0.1 # Low temp to maintain forensic consistency
            )
            
            raw_text = response.content[0].text
            
            # Clean possible markdown block wrappers if Claude still adds them
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "", 1)
            raw_text = raw_text.replace("```", "").strip()
            
            return json.loads(raw_text)
            
        except json.JSONDecodeError as je:
            logger.error(f"Failed to decode JSON from Claude. Raw output: {raw_text}")
            raise ValueError("AI failed to return valid structured JSON formatting.")
        except Exception as e:
            logger.error(f"Error in Claude tip analysis: {e}")
            raise ValueError(f"Failed to analyze the stock tip using AI: {str(e)}")

    @staticmethod
    async def generate_life_event_plan(event_description: str, risk_profile: str) -> Dict[str, Any]:
        """
        Instructs Claude to generate a localized Indian financial action plan (costs + SIP adjustments).
        Requires strict JSON output.
        """
        client = AIAgentService._get_client()
        
        system_prompt = (
            "You are a top-tier Indian financial planner specializing in local life events (marriage, having a baby, home buying in tier 1/2 cities). "
            "You must output hyper-localized cost estimates in INR (₹) and mathematically precise SIP adjustments needed to meet the goal. "
            "You MUST output strictly in valid JSON format ONLY. Do not include any conversational text."
        )
        
        user_prompt = f"""
Event Description: {event_description}
Client Risk Profile: {risk_profile}

Generate a comprehensive financial plan matching this exact JSON structure:
{{
    "estimated_cost_range_inr": "e.g., ₹5,00,000 - ₹8,00,000",
    "required_monthly_sip_adjustment_inr": "e.g., ₹15,000",
    "timeline_months": "Estimated realistic timeline in months, e.g., 24",
    "action_steps": [
        "Specific Indian localized action step 1 (e.g., buy a pure term insurance from LIC or private player)",
        "Specific actionable step 2"
    ],
    "risk_advisory": "A warning or note based strictly on their provided risk profile."
}}
"""
        try:
            response = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                temperature=0.2 # Slight creativity allowed for actionable steps
            )
            
            raw_text = response.content[0].text
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "", 1)
            raw_text = raw_text.replace("```", "").strip()
            
            return json.loads(raw_text)
            
        except json.JSONDecodeError as je:
            logger.error(f"Failed to decode JSON from Claude. Raw output: {raw_text}")
            raise ValueError("AI failed to return valid structured JSON guidelines.")
        except Exception as e:
            logger.error(f"Error in Claude life event planner: {e}")
            raise ValueError(f"Failed to generate life event plan using AI: {str(e)}")
