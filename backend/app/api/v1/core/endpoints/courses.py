from app.api.v1.core.models import (
    Company,
    CompanyType,
    Course,
    EnrollmentStatus,
    User,
    UserCourseEnrollment,
)
from app.api.v1.core.schemas import (
    CompanySchema,
    CompanyTypeSchema,
    CourseCreateSchema,
    CourseSchema,
    UserOutSchema,
    UserSchema,
)
from app.db_setup import get_db
from app.security import get_current_superuser, get_current_token, get_current_user
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload

router = APIRouter(tags=["dashboard"], prefix="/courses")


@router.post("/course", status_code=status.HTTP_201_CREATED)
def create_course(
    course: CourseCreateSchema,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """
    Create a course
    """
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    return db_course


@router.get("/course", status_code=status.HTTP_200_OK, tags=["course"])
def list_courses(
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """
    List all courses
    """
    courses = db.scalars(select(Course)).all()
    return courses


# CREATE - Enroll user in course
@router.post("/{user_id}/courses/{course_id}")
def add_user_course(
    user_id: int,
    course_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """Create a new enrollment for a user in a course"""
    user = db.scalars(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    course = db.scalars(select(Course).where(Course.id == course_id)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Create enrollment with default status
    enrollment = UserCourseEnrollment(
        user=user, course=course, status=EnrollmentStatus.ENROLLED
    )

    try:
        db.add(enrollment)
        db.commit()
        return enrollment
    except IntegrityError:
        raise HTTPException(
            status_code=400, detail="User is already enrolled in this course"
        )


@router.delete("/course/{course_id}", status_code=200, tags=["course"])
def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
):
    """Delete a course (superuser only)"""
    # First delete all enrollments associated with this course
    db.execute(
        delete(UserCourseEnrollment).where(UserCourseEnrollment.course_id == course_id)
    )

    # Then delete the course itself
    query = delete(Course).where(Course.id == course_id)
    result = db.execute(query)
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"message": "Course deleted"}
