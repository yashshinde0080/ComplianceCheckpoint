from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyRead, PolicyUpdate, PolicyGenerate
from app.core.dependencies import get_current_active_user, require_roles
from app.services.policy_generator import generate_policy_content

router = APIRouter()


@router.get("/", response_model=List[PolicyRead])
async def list_policies(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Policy)
        .where(Policy.organization_id == current_user.organization_id)
        .order_by(Policy.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{policy_id}", response_model=PolicyRead)
async def get_policy(
    policy_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Policy).where(
            Policy.id == policy_id,
            Policy.organization_id == current_user.organization_id
        )
    )
    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )

    return policy


@router.post("/", response_model=PolicyRead)
async def create_policy(
    policy_data: PolicyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    new_policy = Policy(
        organization_id=current_user.organization_id,
        framework_id=policy_data.framework_id,
        title=policy_data.title,
        content=policy_data.content,
        status=policy_data.status
    )
    db.add(new_policy)
    await db.commit()
    await db.refresh(new_policy)

    return new_policy


@router.post("/generate", response_model=PolicyRead)
async def generate_policy(
    generate_data: PolicyGenerate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    from app.db.models.organization import Organization

    # Get organization name
    org_result = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = org_result.scalar_one_or_none()
    company_name = str(generate_data.company_name or (org.name if org else "Your Company"))

    # Generate policy content
    title, content = generate_policy_content(
        policy_type=generate_data.policy_type,
        company_name=company_name
    )

    new_policy = Policy(
        organization_id=current_user.organization_id,
        framework_id=generate_data.framework_id,
        title=title,
        content=content,
        status="Draft"
    )
    db.add(new_policy)
    await db.commit()
    await db.refresh(new_policy)

    return new_policy


@router.put("/{policy_id}", response_model=PolicyRead)
async def update_policy(
    policy_id: int,
    update_data: PolicyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Policy).where(
            Policy.id == policy_id,
            Policy.organization_id == current_user.organization_id
        )
    )
    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )

    update_dict = update_data.model_dump(exclude_unset=True)

    # Increment version if content changes
    if "content" in update_dict:
        policy.version += 1  # type: ignore

    for field, value in update_dict.items():
        setattr(policy, field, value)

    await db.commit()
    await db.refresh(policy)

    return policy


@router.delete("/{policy_id}")
async def delete_policy(
    policy_id: int,
    current_user: User = Depends(require_roles(["Founder", "Admin"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Policy).where(
            Policy.id == policy_id,
            Policy.organization_id == current_user.organization_id
        )
    )
    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )

    await db.delete(policy)
    await db.commit()

    return {"message": "Policy deleted successfully"}