from fastapi import APIRouter
from app.send_test_email import send_test_email

router = APIRouter()

@router.post("/test-email")
def trigger_test_email(email: str):
    try:
        result = send_test_email(email)
        return {"status": "ok", "result": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}