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
    from sqlalchemy import func

    org_id = current_user.organization_id

    # Use database-level counts for better performance
    total_controls = (await db.execute(select(func.count(Control.id)))).scalar() or 0
    
    # Policies stats
    total_policies = (await db.execute(
        select(func.count(Policy.id)).where(Policy.organization_id == org_id)
    )).scalar() or 0
    approved_policies = (await db.execute(
        select(func.count(Policy.id)).where(Policy.organization_id == org_id, Policy.status == "Approved")
    )).scalar() or 0
    
    # Evidence stats
    total_evidence = (await db.execute(
        select(func.count(Evidence.id)).where(Evidence.organization_id == org_id)
    )).scalar() or 0
    accepted_evidence = (await db.execute(
        select(func.count(Evidence.id)).where(Evidence.organization_id == org_id, Evidence.status == "Accepted")
    )).scalar() or 0
    
    # Tasks stats
    total_tasks = (await db.execute(
        select(func.count(Task.id)).where(Task.organization_id == org_id)
    )).scalar() or 0
    pending_tasks = (await db.execute(
        select(func.count(Task.id)).where(Task.organization_id == org_id, Task.status == "Pending")
    )).scalar() or 0
    completed_tasks = (await db.execute(
        select(func.count(Task.id)).where(Task.organization_id == org_id, Task.status == "Completed")
    )).scalar() or 0

    return {
        "total_controls": total_controls,
        "total_policies": total_policies,
        "approved_policies": approved_policies,
        "total_evidence": total_evidence,
        "accepted_evidence": accepted_evidence,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "completion_percentage": round((completed_tasks / total_tasks * 100) if total_tasks else 0, 1)
    }