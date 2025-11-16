# app/services/categorizer.py
from typing import Optional, Tuple

# Eenvoudige keyword-regels per categorie (MVP-heuristiek)
RULES = [
    ("Income", ["salaris", "loon", "payroll", "salary", "uitkering", "toeslag"]),
    ("Housing", ["huur", "rent", "woon", "vve", "energie", "stroom", "gas", "water", "nuon", "vattenfall", "essent"]),
    ("Groceries", ["ah ", "albert heijn", "jumbo", "lidl", "aldi", "dirk", "plus "]),
    ("EatingOut", ["ubereats", "thuisbezorgd", "deliveroo", "mcdonald", "kfc", "restaurant", "café", "coffee", "starbucks"]),
    ("Transport", ["ns ", "ov-chip", "gvb", "ret ", "eindhoven airport", "schiphol", "shell", "bp ", "total", "tango", "parkeren", "parking"]),
    ("Bills & Subscriptions", ["tele2", "t-mobile", "vodafone", "ziggo", "kpn", "netflix", "spotify", "icloud", "microsoft", "adobe", "abonnement"]),
    ("Health & Fitness", ["apotheek", "cz ", "vgz", "zilveren kruis", "ando", "basic-fit", "fitness", "gym"]),
    ("Shopping", ["bol.com", "amazon", "ikea", "h&m", "zara", "decathlon", "coolblue", "mediamarkt"]),
    ("Entertainment", ["pathe", "pathé", "cinema", "festival", "ticketmaster", "podcast", "games", "steam"]),
    ("Fees & Interest", ["kosten", "fee", "rente", "interest", "boete", "incasso"]),
    ("Transfers & Savings", ["tikkie", "bunq me", "revolut", "transfer", "spaardoel", "saving", "overboeking", "internal"]),
]

def _text(name: Optional[str], desc: Optional[str]) -> str:
    return f"{(name or '')} {(desc or '')}".lower()

def rule_category(name: Optional[str], description: Optional[str]) -> Tuple[Optional[str], float]:
    """
    Heel simpele rules-first categorisatie.
    Return (categorie, confidence). Niets gevonden => (None, 0.0)
    """
    blob = _text(name, description)
    if not blob.strip():
        return None, 0.0

    for label, keywords in RULES:
        for kw in keywords:
            if kw in blob:
                # simpele confidence op basis van keyword lengte
                conf = min(0.9, max(0.6, len(kw) / 12))
                return label, conf

    # fallback: inkomend geld als bedrag/tekst vaak 'salary'/'payroll', anders 'Other'
    return None, 0.0