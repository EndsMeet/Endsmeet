# app/utils/file_storage.py
from pathlib import Path
import uuid
from typing import Tuple

DATA_DIR = Path("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

def save_upload(file_bytes: bytes, original_name: str) -> Tuple[str, str]:
    """
    Slaat het bestand lokaal op in ./data en geeft (file_id, pad) terug.
    """
    fid = str(uuid.uuid4())
    dest = DATA_DIR / f"{fid}_{original_name}"
    dest.write_bytes(file_bytes)
    return fid, str(dest)