from typing import Optional, Dict, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.ai_client import ask_coach

router = APIRouter(prefix="/coach", tags=["coach"])


class CoachRequest(BaseModel):
    question: str
    onboarding: Optional[Dict[str, Any]] = None


class CoachResponse(BaseModel):
    answer: str


@router.post("/ask", response_model=CoachResponse)
def coach_endpoint(payload: CoachRequest):
    """
    Eenvoudige AI-coach endpoint.
    Frontend stuurt:
    {
      "question": "Mijn vraag...",
      "onboarding": { ... alle antwoorden uit onboarding ... }
    }
    """
    try:
        answer = ask_coach(
            question=payload.question,
            context=payload.onboarding,
        )
        return CoachResponse(answer=answer)
    except Exception as e:
        # In de logs zie je de echte error, naar buiten sturen we iets netters
        print("AI error:", repr(e))
        raise HTTPException(status_code=500, detail="AI-coach is nu even niet beschikbaar.")
