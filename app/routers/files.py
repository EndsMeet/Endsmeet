from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..utils.file_storage import save_upload
from ..models import SourceFile
from ..schemas import FileUploadOut
from uuid import uuid4

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload", response_model=FileUploadOut)
async def upload_csv(f: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await f.read()
    file_id, path = save_upload(content, f.filename)
    rec = SourceFile(id=uuid4(), user_id=None, bank="UNKNOWN", original_name=f.filename, stored_path=path)
    db.add(rec); db.commit(); db.refresh(rec)
    return FileUploadOut(source_file_id=rec.id, bank=rec.bank, original_name=rec.original_name)