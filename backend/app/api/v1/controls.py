from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
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
    # Subquery for evidence counts
    evidence_counts = (
        select(
            Evidence.control_id,
            func.count(Evidence.id).label("count")
        )
        .where(Evidence.organization_id == current_user.organization_id)
        .group_by(Evidence.control_id)
        .subquery()
    )

    # Subquery for task information
    task_info = (
        select(
            Task.control_id,
            func.count(Task.id).label("count"),
            # Count tasks that are NOT completed
            func.count(case((Task.status != "Completed", 1))).label("uncompleted_count"),
            # Count tasks that are In Progress
            func.count(case((Task.status == "In Progress", 1))).label("in_progress_count")
        )
        .where(Task.organization_id == current_user.organization_id)
        .group_by(Task.control_id)
        .subquery()
    )

    query = (
        select(
            Control,
            func.coalesce(evidence_counts.c.count, 0).label("evidence_count"),
            func.coalesce(task_info.c.count, 0).label("task_count"),
            func.coalesce(task_info.c.uncompleted_count, 0).label("uncompleted_count"),
            func.coalesce(task_info.c.in_progress_count, 0).label("in_progress_count")
        )
        .outerjoin(evidence_counts, Control.id == evidence_counts.c.control_id)
        .outerjoin(task_info, Control.id == task_info.c.control_id)
    )

    if framework:
        query = query.join(Framework).where(Framework.name.ilike(f"%{framework}%"))

    if category:
        query = query.where(Control.category.ilike(f"%{category}%"))

    result = await db.execute(query.order_by(Control.control_code))
    rows = result.all()

    controls_with_status = []
    for row in rows:
        control, evidence_count, task_count, uncompleted_count, in_progress_count = row
        
        # Determine completion status based on business logic
        if evidence_count > 0 and uncompleted_count == 0:
            completion_status = "Completed"
        elif evidence_count > 0 or in_progress_count > 0:
            completion_status = "In Progress"
        else:
            completion_status = "Not Started"

        controls_with_status.append(ControlWithStatus(
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
        ))

    return controls_with_status


@router.get("/{control_id}", response_model=ControlWithStatus)
async def get_control(
    control_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # We can use the same optimized query logic for a single control
    evidence_counts = (
        select(
            Evidence.control_id,
            func.count(Evidence.id).label("count")
        )
        .where(
            Evidence.control_id == control_id,
            Evidence.organization_id == current_user.organization_id
        )
        .group_by(Evidence.control_id)
        .subquery()
    )

    task_info = (
        select(
            Task.control_id,
            func.count(Task.id).label("count"),
            func.count(case((Task.status != "Completed", 1))).label("uncompleted_count"),
            func.count(case((Task.status == "In Progress", 1))).label("in_progress_count")
        )
        .where(
            Task.control_id == control_id,
            Task.organization_id == current_user.organization_id
        )
        .group_by(Task.control_id)
        .subquery()
    )

    query = (
        select(
            Control,
            func.coalesce(evidence_counts.c.count, 0).label("evidence_count"),
            func.coalesce(task_info.c.count, 0).label("task_count"),
            func.coalesce(task_info.c.uncompleted_count, 0).label("uncompleted_count"),
            func.coalesce(task_info.c.in_progress_count, 0).label("in_progress_count")
        )
        .where(Control.id == control_id)
        .outerjoin(evidence_counts, Control.id == evidence_counts.c.control_id)
        .outerjoin(task_info, Control.id == task_info.c.control_id)
    )

    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Control not found"
        )

    control, evidence_count, task_count, uncompleted_count, in_progress_count = row

    if evidence_count > 0 and uncompleted_count == 0:
        completion_status = "Completed"
    elif evidence_count > 0 or in_progress_count > 0:
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
