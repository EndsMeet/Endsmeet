from typing import Optional, Dict, Any

from openai import OpenAI
from app.core.config import settings

# Gebruik de key uit Settings (die uit .env komt)
client = OpenAI(api_key=settings.OPENAI_API_KEY)


def ask_coach(question: str, context: Optional[Dict[str, Any]] = None) -> str:
    """
    Simpele AI-coach functie.
    - question: vraag van de gebruiker
    - context: bv. onboarding-info (doel, timeframe, prioriteit, etc.)
    """

    system_prompt = """
Je bent een nuchtere, praktische Nederlandse geldcoach.
Je helpt iemand om stap voor stap overzicht te krijgen en concrete acties te zetten.
Schrijf helder, kort en concreet. Geen verkooppraatjes, geen Engels als het niet hoeft.
Geef maximaal 5 concrete stappen of adviezen.
"""

    # Context (onboarding) mooi in tekst zetten
    context_text = ""
    if context:
        parts = []
        for key, value in context.items():
            parts.append(f"{key}: {value}")
        context_text = "Context uit onboarding:\n" + "\n".join(parts)

    user_message = f"{context_text}\n\nVraag van de gebruiker:\n{question}"

    # Gebruik de Chat Completions API (werkt gewoon met openai==2.8.0)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_message.strip()},
        ],
    )

    answer = response.choices[0].message.content
    return answer