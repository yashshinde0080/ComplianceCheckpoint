from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import hashlib
import aiofiles
import os
from datetime import datetime

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate, EvidenceRead, EvidenceUpdate
from app.core.dependencies import get_current_active_user, require_roles

router = APIRouter()

UPLOAD_DIR = "uploads/evidence"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[EvidenceRead])
async def list_evidence(
    control_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Evidence).where(Evidence.organization_id == current_user.organization_id)
    
    if control_id:
        query = query.where(Evidence.control_id == control_id)
    
    result = await db.execute(query.order_by(Evidence.created_at.desc()))
    return result.scalars().all()


@router.get("/control/{control_id}", response_model=List[EvidenceRead])
async def get_evidence_for_control(
    control_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Evidence).where(
            Evidence.control_id == control_id,
            Evidence.organization_id == current_user.organization_id
        ).order_by(Evidence.created_at.desc())
    )
    return result.scalars().all()


@router.post("/upload", response_model=EvidenceRead)
async def upload_evidence(
    control_id: int = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Read file content
    content = await file.read()
    
    # Calculate file hash
    file_hash = hashlib.sha256(content).hexdigest()
    
    # Generate unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, str(current_user.organization_id), safe_filename)
    
    # Create directory if needed
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)
    
    # Check for existing version
    result = await db.execute(
        select(Evidence).where(
            Evidence.control_id == control_id,
            Evidence.organization_id == current_user.organization_id,
            Evidence.file_name == file.filename
        ).order_by(Evidence.version.desc())
    )
    existing = result.scalar_one_or_none()
    new_version = (existing.version + 1) if existing else 1
    
    # Create evidence record
    new_evidence = Evidence(
        control_id=control_id,
        organization_id=current_user.organization_id,
        uploaded_by=current_user.id,
        file_name=file.filename,
        file_url=file_path,
        file_hash=file_hash,
        file_size=len(content),
        mime_type=file.content_type,
        description=description,
        version=new_version,
        status="Pending"
    )
    db.add(new_evidence)
    await db.commit()
    await db.refresh(new_evidence)
    
    return new_evidence


@router.put("/{evidence_id}", response_model=EvidenceRead)
async def update_evidence(
    evidence_id: int,
    update_data: EvidenceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Evidence).where(
            Evidence.id == evidence_id,
            Evidence.organization_id == current_user.organization_id
        )
    )
    evidence = result.scalar_one_or_none()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(evidence, field, value)
    
    await db.commit()
    await db.refresh(evidence)
    
    return evidence


@router.put("/{evidence_id}/status", response_model=EvidenceRead)
async def update_evidence_status(
    evidence_id: int,
    status: str,
    current_user: User = Depends(require_roles(["Founder", "Admin", "Auditor"])),
    db: AsyncSession = Depends(get_db)
):
    if status not in ["Pending", "Accepted", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    result = await db.execute(
        select(Evidence).where(
            Evidence.id == evidence_id,
            Evidence.organization_id == current_user.organization_id
        )
    )
    evidence = result.scalar_one_or_none()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    evidence.status = status
    await db.commit()
    await db.refresh(evidence)
    
    return evidence


@router.delete("/{evidence_id}")
async def delete_evidence(
    evidence_id: int,
    current_user: User = Depends(require_roles(["Founder", "Admin"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Evidence).where(
            Evidence.id == evidence_id,
            Evidence.organization_id == current_user.organization_id
        )
    )
    evidence = result.scalar_one_or_none()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    # Delete file
    if os.path.exists(evidence.file_url):
        os.remove(evidence.file_url)
    
    await db.delete(evidence)
    await db.commit()
    
    return {"message": "Evidence deleted successfully"}
