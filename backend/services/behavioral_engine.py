from models.feature_models import BiasResultData, BiasScoreItem, BiasAdaptationItem
from typing import List

class BehavioralEngine:
    @staticmethod
    def calculate_fingerprint(answers: List[int]) -> BiasResultData:
        # Default baseline scores out of 100
        scores = {
            "Loss Aversion": 40,
            "Recency Bias": 40,
            "Overconfidence": 40,
            "Herd Mentality": 40,
            "Anchoring": 40,
        }

        # Algorithm to shift weights based on questions
        # Q0: A fund bought at 100 is 85.
        if len(answers) > 0:
            if answers[0] == 0: scores["Loss Aversion"] += 40 # Hold until 100
            elif answers[0] == 1: scores["Overconfidence"] += 20 # Sell and reinvest
            elif answers[0] == 3: scores["Loss Aversion"] += 50 # Avoid checking
        
        # Q1: Return metric catching eye
        if len(answers) > 1:
            if answers[1] == 0: scores["Recency Bias"] += 50
            elif answers[1] == 1: scores["Recency Bias"] += 30
            elif answers[1] == 3: scores["Anchoring"] += 30
        
        # Q2: Colleague 40% tip reaction
        if len(answers) > 2:
            if answers[2] == 0: scores["Herd Mentality"] += 40
            elif answers[2] == 3: scores["Herd Mentality"] += 50 # FOMO
            elif answers[2] == 1: scores["Overconfidence"] += 30
        
        # Q3: NFO launch
        if len(answers) > 3:
            if answers[3] == 0: scores["Recency Bias"] += 30; scores["Herd Mentality"] += 20
            elif answers[3] == 3: scores["Herd Mentality"] += 50
            elif answers[3] == 2: scores["Anchoring"] += 20
        
        # Q4: Market drops 15%
        if len(answers) > 4:
            if answers[4] == 0: scores["Loss Aversion"] += 50 # Sell everything
            elif answers[4] == 3: scores["Loss Aversion"] += 30 # Switch to FDs
            elif answers[4] == 2: scores["Overconfidence"] += 20

        # Cap scores at 99 for realism
        for key in scores:
            scores[key] = min(scores[key], 99)

        # Find dominant bias
        dominant = max(scores, key=scores.get)

        adaptations = []
        if dominant == "Loss Aversion":
            adaptations.append(BiasAdaptationItem(bias="Loss Aversion (Dominant)", adaptation="ArthSaathi will frame target portfolios entirely around 'losses avoided' rather than 'gains missed'."))
        elif dominant == "Recency Bias":
            adaptations.append(BiasAdaptationItem(bias="Recency Bias (Dominant)", adaptation="ArthSaathi will default to showing 5-year rolling charts first instead of 1-month returns to ground your perspective."))
        elif dominant == "Herd Mentality":
            adaptations.append(BiasAdaptationItem(bias="Herd Mentality (Dominant)", adaptation="ArthSaathi will explicitly block peer-comparison metrics and focus entirely on your unique absolute FIRE goal."))
        elif dominant == "Overconfidence":
            adaptations.append(BiasAdaptationItem(bias="Overconfidence (Dominant)", adaptation="Algorithms will heavily simulate downside stress-test scenarios before allowing you to commit trades."))
        else:
            adaptations.append(BiasAdaptationItem(bias="Anchoring (Dominant)", adaptation="We will hide 'Average Buy Price' by default to prevent you from anchoring to sunk-cost decisions."))

        # Minor adaptations for secondary high traits
        for bias, sc in scores.items():
            if bias != dominant and sc >= 70:
                adaptations.append(BiasAdaptationItem(bias=f"{bias} (High)", adaptation="We have activated secondary counter-measure guardrails for this elevated trait in your UI."))

        final_scores = [BiasScoreItem(bias=k, score=v) for k, v in scores.items()]
        
        return BiasResultData(
            scores=final_scores,
            dominant=dominant,
            adaptations=adaptations
        )
