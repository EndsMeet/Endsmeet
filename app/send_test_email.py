# app/send_test_email.py
import os
import resend

# Haal API key uit je .env / environment
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is niet gezet. Voeg hem toe aan je .env.")

# Configureer Resend client
resend.api_key = RESEND_API_KEY


async def send_test_email(to_email: str) -> None:
    """
    Stuurt een testmail vanaf info@endsmeet.nl naar het opgegeven adres.
    """
    await resend.Emails.send(
        {
            "from": "EndsMeet <info@endsmeet.nl>",   # 👈 hier gebruiken we jouw info@ adres
            "to": [to_email],
            "subject": "Test e-mail van EndsMeet",
            "html": """
                <h1>Het werkt 🎉</h1>
                <p>Dit is een testmail vanaf <strong>info@endsmeet.nl</strong>.</p>
                <p>Als je dit in je inbox ziet, zijn DNS + Resend goed ingesteld.</p>
            """,
        }
    )