from __future__ import annotations

from typing import Optional, Sequence

import resend

from app.core.config import settings
from .renderer import render_email

# Probeer een from-adres uit settings te halen, anders fallback
FROM_EMAIL = getattr(
    settings,
    "EMAIL_FROM",
    "EndsMeet <no-reply@endsmeet.nl>",
)

# Zorg dat Resend de juiste API key gebruikt
resend.api_key = settings.RESEND_API_KEY


def _send_email(
    *,
    to: str | Sequence[str],
    subject: str,
    html: str,
) -> None:
    if isinstance(to, str):
        recipients = [to]
    else:
        recipients = list(to)

    payload = {
        "from": FROM_EMAIL,
        "to": recipients,
        "subject": subject,
        "html": html,
    }

    # Sync call is prima voor nu. Later kun je dit in een background task stoppen.
    resend.Emails.send(payload)


# 1) Welkom / account bevestiging
def send_welcome_email(
    to: str,
    *,
    onboarding_url: str,
    login_url: Optional[str] = None,
) -> None:
    html = render_email(
        headline="Welkom bij EndsMeet 👋",
        intro=(
            "Goed dat je er bent. EndsMeet helpt je stap voor stap slimmer met "
            "je geld omgaan – zonder oordeel, mét concrete acties."
        ),
        cta_label="Start mijn onboarding",
        cta_url=onboarding_url,
        footer_text="Log later altijd in via je persoonlijke link of inlogcode.",
    )
    _send_email(to=to, subject="Welkom bij EndsMeet", html=html)


# 2) Wachtwoord reset
def send_password_reset_email(
    to: str,
    *,
    reset_url: str,
) -> None:
    html = render_email(
        headline="Wachtwoord herstellen",
        intro=(
            "Je hebt aangegeven je wachtwoord te willen resetten. Klik op de knop "
            "hieronder om een nieuw wachtwoord in te stellen."
        ),
        cta_label="Stel een nieuw wachtwoord in",
        cta_url=reset_url,
        footer_text=(
            "Deze link is beperkt geldig. Heb jij dit niet aangevraagd? "
            "Dan kun je deze mail gerust negeren."
        ),
    )
    _send_email(to=to, subject="Herstel je wachtwoord voor EndsMeet", html=html)


# 3) Login code / magic link
def send_magic_link_email(
    to: str,
    *,
    magic_link_url: str,
    code: Optional[str] = None,
) -> None:
    extra_html = ""
    if code:
        extra_html = f"""
<p style="margin:0 0 12px 0; font-size:14px; line-height:1.6; color:#e5e7eb;">
  Je eenmalige inlogcode is:
</p>
<p style="
  margin:0 0 16px 0;
  font-size:24px;
  font-weight:700;
  letter-spacing:0.16em;
  color:#f9fafb;
">
  {code}
</p>
"""

    html = render_email(
        headline="Log direct in bij EndsMeet",
        intro=(
            "Je kunt via de knop hieronder direct inloggen. Gebruik deze link "
            "alleen zelf en deel hem niet met anderen."
        ),
        cta_label="Log nu in",
        cta_url=magic_link_url,
        extra_html=extra_html,
        footer_text="Als jij dit niet hebt aangevraagd, kun je deze mail negeren.",
    )
    _send_email(to=to, subject="Je inloglink voor EndsMeet", html=html)


# 4) Onboarding reminder
def send_onboarding_reminder_email(
    to: str,
    *,
    onboarding_url: str,
) -> None:
    html = render_email(
        headline="Maak je onboarding af",
        intro=(
            "Je bent bijna klaar. Met een paar extra vragen kan de coach je veel "
            "persoonlijker helpen om ruimte in je maandbudget te vinden."
        ),
        cta_label="Ga verder met mijn onboarding",
        cta_url=onboarding_url,
        footer_text="Dankjewel dat je EndsMeet helpt verbeteren in deze beta-fase.",
    )
    _send_email(to=to, subject="Rond je onboarding bij EndsMeet af", html=html)


# 5) Testpanel uitnodiging
def send_testpanel_invite_email(
    to: str,
    *,
    signup_url: str,
) -> None:
    html = render_email(
        headline="Word één van de eerste 100 testers",
        intro=(
            "We bouwen EndsMeet samen met een kleine groep mensen die meer rust "
            "en grip op hun geld willen. In ruil voor jouw eerlijke feedback "
            "krijg je een jaar gratis toegang."
        ),
        cta_label="Meld je aan als tester",
        cta_url=signup_url,
        footer_text="Je ontvangt na aanmelding extra info over hoe het testprogramma werkt.",
    )
    _send_email(to=to, subject="Uitnodiging: EndsMeet testpanel", html=html)


# 6) Transactie-upload bevestiging
def send_upload_confirmation_email(
    to: str,
    *,
    dashboard_url: str,
    row_count: Optional[int] = None,
) -> None:
    if row_count is not None:
        intro = (
            f"We hebben je bestand ontvangen en succesvol verwerkt. "
            f"In totaal zijn er ongeveer {row_count} transacties ingelezen. "
            "Op je dashboard zie je straks inzichten per categorie en per maand."
        )
    else:
        intro = (
            "We hebben je bestand ontvangen en succesvol verwerkt. "
            "Op je dashboard zie je straks inzichten per categorie en per maand."
        )

    html = render_email(
        headline="Je transacties zijn verwerkt",
        intro=intro,
        cta_label="Ga naar mijn dashboard",
        cta_url=dashboard_url,
        footer_text="Let op: deze functie is nog in beta. Resultaten kunnen afwijken.",
    )
    _send_email(to=to, subject="Transactie-upload ontvangen", html=html)


# 7) Overzicht / nieuwsbrief (periodieke samenvatting)
def send_overview_email(
    to: str,
    *,
    period_label: str,
    summary_html: str,
    dashboard_url: str,
) -> None:
    """
    summary_html kan bijvoorbeeld een lijst zijn met:
    - belangrijkste categorieën
    - inschatting hoeveel je kunt vrijmaken
    """
    html = render_email(
        headline=f"Jouw geld-overzicht voor {period_label}",
        intro=(
            f"Hier is een korte samenvatting van hoe je geld zich in {period_label} "
            "heeft bewogen. Zie dit als startpunt voor het gesprek met je coach."
        ),
        extra_html=summary_html,
        cta_label="Bekijk details in mijn dashboard",
        cta_url=dashboard_url,
        footer_text="De bedragen in dit overzicht zijn indicatief en kunnen afrondingsverschillen bevatten.",
    )
    _send_email(to=to, subject=f"Je EndsMeet overzicht – {period_label}", html=html)


# 8) Feedback verzoek
def send_feedback_request_email(
    to: str,
    *,
    feedback_form_url: str,
) -> None:
    html = render_email(
        headline="Mag ik je 2 minuten feedback?",
        intro=(
            "Je hoort bij de eerste groep mensen die EndsMeet gebruikt. "
            "Met jouw feedback kunnen we het product écht beter maken voor jou "
            "en andere gebruikers."
        ),
        cta_label="Geef feedback (±2 minuten)",
        cta_url=feedback_form_url,
        footer_text="Alvast dank. Dankzij jouw input kunnen we EndsMeet blijven verbeteren.",
    )
    _send_email(to=to, subject="Jouw mening over EndsMeet", html=html)