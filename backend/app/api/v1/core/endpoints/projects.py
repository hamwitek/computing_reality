from app.api.v1.core.models import (
    Company,
    CompanyType,
    Course,
    EnrollmentStatus,
    User,
    UserCourseEnrollment,
    Project,
)
from app.api.v1.core.schemas import (
    CompanySchema,
    CompanyTypeSchema,
    CourseCreateSchema,
    CourseSchema,
    UserOutSchema,
    UserSchema,
    ProjectCreateSchema,
    ProjectNameUpdateSchema,
    ProjectAreaUpdateSchema,
    ProjectCoordinateUpdateSchema,
    ProjectSchema,

)
from app.db_setup import get_db
from app.security import get_current_superuser, get_current_token, get_current_user
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List
from datetime import datetime, UTC
import base64


# router = APIRouter(tags=["project"], prefix="/projects")
# router = APIRouter(tags=["projects"], prefix="/project")
router = APIRouter()


@router.post("/project", status_code=status.HTTP_201_CREATED, response_model=ProjectSchema, tags=["projects"])
def create_project(
    project: ProjectCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a project
    """
    try:
        db_project = Project(
            name=project.name,
            created_at=datetime.now(UTC),
            user_id=current_user.id
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


@router.put("/project/{project_name}", response_model=ProjectSchema, tags=["projects"])
def update_project_name(
    project_name: str,
    project: ProjectNameUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update project name
    """
    try:
        # Get the project from the database
        db_project = db.scalars(select(Project).where(
            Project.name == project_name,
            Project.user_id == current_user.id  # Ensure user owns the project
        )).first()

        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Update project fields from provided data
        for key, value in project.model_dump(exclude_unset=True).items():
            setattr(db_project, key, value)

        db.commit()
        db.refresh(db_project)
        return db_project
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


@router.get("/project", status_code=status.HTTP_200_OK, tags=["projects"])
def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all projects
    """
    projects = db.scalars(select(Project)).all()
    return projects


@router.delete("/project/{project_id}", status_code=200, tags=["projects"])
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a project (superuser only)"""
    # First delete all enrollments associated with this course
    db.execute(
        delete(Project).where(
            Project.id == project_id)
    )

    # Then delete the course itself
    query = delete(Project).where(Project.id == project_id)
    result = db.execute(query)
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": "Project deleted"}


@router.put("/project/{project_name}/area", response_model=ProjectSchema, tags=["projects"])
def update_project_area_image(
    project_name: str,
    project: ProjectAreaUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update project area image and coordinates
    """
    try:
        # Get the project from the database
        db_project = db.scalars(select(Project).where(
            Project.name == project_name,
            Project.user_id == current_user.id  # Ensure user owns the project
        )).first()

        if not db_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Update image if provided
        if project.area_image:
            db_project.area_image = project.area_image

        db.commit()
        db.refresh(db_project)
        return db_project

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


@router.put("/project/{project_name}/coordinates", response_model=ProjectSchema, tags=["projects"])
def update_project_coordinates(
    project_name: str,
    project: ProjectCoordinateUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update project area image and coordinates
    """
    try:
        # Get the project from the database
        db_project = db.scalars(select(Project).where(
            Project.name == project_name,
            Project.user_id == current_user.id  # Ensure user owns the project
        )).first()

        if not db_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Update coordinates if provided
        if project.coordinates:
            db_project.coordinates = project.coordinates

        db.commit()
        db.refresh(db_project)
        return db_project

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
