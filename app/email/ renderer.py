from __future__ import annotations

from pathlib import Path
from typing import Optional, Dict

BASE_DIR = Path(__file__).resolve().parent
_TEMPLATE_PATH = BASE_DIR / "base_template.html"


def _load_template() -> str:
    return _TEMPLATE_PATH.read_text(encoding="utf-8")


# Cache in memory
_BASE_TEMPLATE = _load_template()


def render_email(
    *,
    headline: str,
    intro: str,
    preheader: Optional[str] = None,
    cta_label: Optional[str] = None,
    cta_url: Optional[str] = None,
    extra_html: Optional[str] = None,
    footer_text: Optional[str] = None,
    extra_placeholders: Optional[Dict[str, str]] = None,
) -> str:
    """
    Eenvoudige string-based template renderer.
    Vervangt {{placeholder}} in base_template.html.
    """

    html = _BASE_TEMPLATE

    # CTA-block opbouwen (of leeg laten)
    if cta_label and cta_url:
        cta_block = f"""
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 4px 0;">
  <tr>
    <td align="left">
      <a href="{cta_url}" 
         style="
           display:inline-block;
           padding:10px 18px;
           border-radius:999px;
           background-color:#22c55e;
           color:#020617;
           text-decoration:none;
           font-size:13px;
           font-weight:600;
         ">
        {cta_label}
      </a>
    </td>
  </tr>
</table>
"""
    else:
        cta_block = ""

    # Standaardwaarden
    values: Dict[str, str] = {
        "headline": headline,
        "intro": intro,
        "preheader": preheader or intro,
        "cta_block": cta_block,
        "extra_html": extra_html or "",
        "footer_text": footer_text
        or "EndsMeet – slimmer met je geld. Dit is een automatische e-mail.",
    }

    if extra_placeholders:
        values.update(extra_placeholders)

    # Dumb string replace, maar veilig genoeg voor deze usecase
    for key, val in values.items():
        placeholder = f"{{{{{key}}}}}"  # {{headline}}
        html = html.replace(placeholder, val)

    return html