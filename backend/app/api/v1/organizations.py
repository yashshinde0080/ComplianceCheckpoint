from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationRead, OrganizationUpdate
from app.core.dependencies import get_current_active_user, require_roles

router = APIRouter()


@router.get("/me", response_model=OrganizationRead)
async def get_my_organization(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No organization found"
        )
    
    result = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    return org


@router.put("/me", response_model=OrganizationRead)
async def update_my_organization(
    update_data: OrganizationUpdate,
    current_user: User = Depends(require_roles(["Founder", "Admin"])),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No organization found"
        )
    
    result = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(org, field, value)
    
    await db.commit()
    await db.refresh(org)
    
    return org


@router.get("/me/stats")
async def get_organization_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    from app.db.models.control import Control
    from app.db.models.policy import Policy
    from app.db.models.evidence import Evidence
    from app.db.models.task import Task
    
    org_id = current_user.organization_id
    
    # Count policies
    policies_result = await db.execute(
        select(Policy).where(Policy.organization_id == org_id)
    )
    policies = policies_result.scalars().all()
    
    # Count evidence
    evidence_result = await db.execute(
        select(Evidence).where(Evidence.organization_id == org_id)
    )
    evidence = evidence_result.scalars().all()
    
    # Count tasks
    tasks_result = await db.execute(
        select(Task).where(Task.organization_id == org_id)
    )
    tasks = tasks_result.scalars().all()
    
    # Count controls
    controls_result = await db.execute(select(Control))
    controls = controls_result.scalars().all()
    
    pending_tasks = len([t for t in tasks if t.status == "Pending"])
    completed_tasks = len([t for t in tasks if t.status == "Completed"])
    
    return {
        "total_controls": len(controls),
        "total_policies": len(policies),
        "approved_policies": len([p for p in policies if p.status == "Approved"]),
        "total_evidence": len(evidence),
        "accepted_evidence": len([e for e in evidence if e.status == "Accepted"]),
        "total_tasks": len(tasks),
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "completion_percentage": round((completed_tasks / len(tasks) * 100) if tasks else 0, 1)
    }