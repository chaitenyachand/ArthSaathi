import anthropic
import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TipAgent:
    """
    AI Agent for the WhatsApp Tip Analyzer.
    Acts as a forensic analyst identifying fraudulent/misleading stock tips and generating strict JSON output.
    """
    
    SYSTEM_PROMPT = (
        "You are a SEBI-registered forensic analyst. Your job is to analyze raw stock tips (often forwarded on WhatsApp) "
        "and check them against basic market logic for fraud, pump-and-dump characteristics, or unrealistic promises. "
        "You MUST output your response strictly as a JSON object matching this schema exactly:\n"
        "{\n"
        "  \"grade\": \"A, B, C, D, or F\",\n"
        "  \"analysis\": \"A short explanation of your reasoning\",\n"
        "  \"red_flags\": [\"list of specific red flags like 'unsolicited advice', 'guaranteed returns', etc.\"]\n"
        "}\n"
        "Do not include any other markdown or conversational text outside the JSON block."
    )

    @staticmethod
    async def analyze_whatsapp_tip(raw_tip: str) -> Dict[str, Any]:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not found. Returning mocked JSON grade.")
            return {
                "grade": "F",
                "analysis": "Mocked analysis due to missing API key.",
                "red_flags": ["Unsolicited advice", "Guaranteed returns flag missing API key"]
            }
            
        client = anthropic.AsyncAnthropic(api_key=api_key)
        prompt = f"Analyze this raw stock tip:\n\"{raw_tip}\""
        
        try:
            response = await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=400,
                system=TipAgent.SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            raw_json = response.content[0].text.strip()
            
            # Clean potential markdown formatting
            if raw_json.startswith("```json"):
                raw_json = raw_json[7:-3].strip()
            elif raw_json.startswith("```"):
                raw_json = raw_json[3:-3].strip()
                
            return json.loads(raw_json)
            
        except json.JSONDecodeError as e:
            logger.error(f"Claude returned invalid JSON: {str(e)}")
            return {
                "grade": "F",
                "analysis": "Failed to safely parse the tip parameters. Proceed with extreme caution.",
                "red_flags": ["Complex/Obfuscated Output", "System Parsing Error"]
            }
        except Exception as e:
            logger.error(f"Failed to analyze tip: {str(e)}")
            return {
                "grade": "F",
                "analysis": "We encountered an issue connecting to the forensic analysis brain.",
                "red_flags": ["System Analysis Failure"]
            }
