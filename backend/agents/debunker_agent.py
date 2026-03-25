import anthropic
import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class DebunkerAgent:
    """
    AI Agent that destroys 'Finfluencer' myths mathematically via Anthropic models,
    demanding highly structured JSON validation.
    """
    
    SYSTEM_PROMPT = (
        "You are a relentless, highly mathematical financial myth-buster. "
        "The user will provide a highly opinionated financial statement from social media (e.g. 'Mutual funds are dead, trade F&O'). "
        "You MUST intelligently dismantle this terrible advice. "
        "Your response MUST be strictly a JSON object matching this schema exactly:\n"
        "{\n"
        "  \"fallacy_detected\": \"Name the cognitive/statistical fallacy (e.g. Survivorship Bias, Recency Bias)\",\n"
        "  \"mathematical_truth\": \"The actual market math or hard statistics powerfully refuting their claim\",\n"
        "  \"danger_level\": <an integer from 1 to 10 where 10 means immediate risk of bankruptcy>\n"
        "}\n"
        "Do not include any formatting like markdown backticks or commentary outside the JSON block."
    )

    @staticmethod
    async def debunk_statement(raw_statement: str) -> Dict[str, Any]:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY not found. Returning mocked debunk JSON.")
            return {
                "fallacy_detected": "Hindsight Bias / Survivorship Bias (Mocked)",
                "mathematical_truth": f"While '{raw_statement}' sounds appealing, SEBI data proves 9 out of 10 F&O traders lose money globally. Systematic wealth occurs incredibly slowly. The math always wins.",
                "danger_level": 9
            }
            
        client = anthropic.AsyncAnthropic(api_key=api_key)
        prompt = f"Dismantle this influencer statement logically: \"{raw_statement}\""
        
        try:
            response = await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=400,
                system=DebunkerAgent.SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            raw_json = response.content[0].text.strip()
            
            # Sanitization wrapper to bypass markdown code blocks
            if raw_json.startswith("```json"):
                raw_json = raw_json[7:-3].strip()
            elif raw_json.startswith("```"):
                raw_json = raw_json[3:-3].strip()
                
            return json.loads(raw_json)
            
        except json.JSONDecodeError as e:
            logger.error(f"Claude returned invalid JSON schema: {str(e)}")
            return {
                "fallacy_detected": "Format Error Bias",
                "mathematical_truth": "The syntax was so wildly fraudulent it crashed the AI parameters.",
                "danger_level": 8
            }
        except Exception as e:
            logger.error(f"Failed to query Debunker agent: {str(e)}")
            return {
                "fallacy_detected": "System Error",
                "mathematical_truth": "The financial influencer's logic was utterly fatal to the connection framework.",
                "danger_level": 10
            }
