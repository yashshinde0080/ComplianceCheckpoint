from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.task import Task
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.core.dependencies import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[TaskRead])
async def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    control_id: Optional[int] = None,
    owner_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).where(Task.organization_id == current_user.organization_id)

    if status_filter:
        query = query.where(Task.status == status_filter)

    if control_id:
        query = query.where(Task.control_id == control_id)

    if owner_id:
        query = query.where(Task.owner_id == owner_id)

    result = await db.execute(query.order_by(Task.due_date.asc().nullslast(), Task.created_at.desc()))
    return result.scalars().all()


@router.get("/my", response_model=List[TaskRead])
async def get_my_tasks(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.owner_id == current_user.id
        ).order_by(Task.due_date.asc().nullslast())
    )
    return result.scalars().all()


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.organization_id == current_user.organization_id
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.post("/", response_model=TaskRead)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    new_task = Task(
        control_id=task_data.control_id,
        organization_id=current_user.organization_id,
        owner_id=task_data.owner_id or current_user.id,
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date,
        priority=task_data.priority,
        status="Pending"
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    update_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.organization_id == current_user.organization_id
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(task, field, value)

    await db.commit()
    await db.refresh(task)

    return task


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.organization_id == current_user.organization_id
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await db.delete(task)
    await db.commit()

    return {"message": "Task deleted successfully"}