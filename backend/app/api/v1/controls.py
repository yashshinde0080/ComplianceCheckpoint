from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.control import Control
from app.db.models.framework import Framework
from app.db.models.evidence import Evidence
from app.db.models.task import Task
from app.schemas.control import ControlCreate, ControlRead, ControlUpdate, ControlWithStatus
from app.core.dependencies import get_current_active_user, require_roles
from app.services.control_seeder import seed_controls

router = APIRouter()


@router.get("", response_model=List[ControlWithStatus])
async def list_controls(
    framework: Optional[str] = Query(None, description="Filter by framework name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Control)

    if framework:
        query = query.join(Framework).where(Framework.name.ilike(f"%{framework}%"))

    if category:
        query = query.where(Control.category.ilike(f"%{category}%"))

    result = await db.execute(query.order_by(Control.control_code))
    controls = result.scalars().all()

    # Get evidence and task counts for each control
    controls_with_status = []
    for control in controls:
        evidence_result = await db.execute(
            select(Evidence).where(
                Evidence.control_id == control.id,
                Evidence.organization_id == current_user.organization_id
            )
        )
        evidence_count = len(evidence_result.scalars().all())

        task_result = await db.execute(
            select(Task).where(
                Task.control_id == control.id,
                Task.organization_id == current_user.organization_id
            )
        )
        tasks = task_result.scalars().all()
        task_count = len(tasks)

        # Determine completion status
        if evidence_count > 0 and all(t.status == "Completed" for t in tasks):
            completion_status = "Completed"
        elif evidence_count > 0 or any(t.status == "In Progress" for t in tasks):
            completion_status = "In Progress"
        else:
            completion_status = "Not Started"

        control_dict = {
            "id": control.id,
            "framework_id": control.framework_id,
            "control_code": control.control_code,
            "title": control.title,
            "description": control.description,
            "category": control.category,
            "severity": control.severity,
            "guidance_text": control.guidance_text,
            "evidence_guidance": control.evidence_guidance,
            "created_at": control.created_at,
            "evidence_count": evidence_count,
            "task_count": task_count,
            "completion_status": completion_status
        }
        controls_with_status.append(ControlWithStatus(**control_dict))

    return controls_with_status


@router.get("/{control_id}", response_model=ControlWithStatus)
async def get_control(
    control_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Control).where(Control.id == control_id))
    control = result.scalar_one_or_none()

    if not control:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Control not found"
        )

    # Get evidence count
    evidence_result = await db.execute(
        select(Evidence).where(
            Evidence.control_id == control.id,
            Evidence.organization_id == current_user.organization_id
        )
    )
    evidence_count = len(evidence_result.scalars().all())

    # Get task count
    task_result = await db.execute(
        select(Task).where(
            Task.control_id == control.id,
            Task.organization_id == current_user.organization_id
        )
    )
    tasks = task_result.scalars().all()
    task_count = len(tasks)

    if evidence_count > 0 and all(t.status == "Completed" for t in tasks):
        completion_status = "Completed"
    elif evidence_count > 0 or any(t.status == "In Progress" for t in tasks):
        completion_status = "In Progress"
    else:
        completion_status = "Not Started"

    return ControlWithStatus(
        id=control.id,
        framework_id=control.framework_id,
        control_code=control.control_code,
        title=control.title,
        description=control.description,
        category=control.category,
        severity=control.severity,
        guidance_text=control.guidance_text,
        evidence_guidance=control.evidence_guidance,
        created_at=control.created_at,
        evidence_count=evidence_count,
        task_count=task_count,
        completion_status=completion_status
    )


@router.post("/seed")
async def seed_control_library(
    current_user: User = Depends(require_roles(["Founder", "Admin"])),
    db: AsyncSession = Depends(get_db)
):
    """Seed the database with SOC 2 and ISO 27001 controls"""
    await seed_controls(db)
    return {"message": "Controls seeded successfully"}
