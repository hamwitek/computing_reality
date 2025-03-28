from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    LargeBinary,
    UniqueConstraint,
    func,
    JSON,
)
# from sqlalchemy.dialects.postgresql import (JSON,)

# NEW SCHEMAS
# We use this for our auth


class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class PasswordResetRequestSchema(BaseModel):
    email: EmailStr = Field(...,
                            description="Email address for password reset")

    model_config = ConfigDict(
        json_schema_extra={"example": {"email": "user@example.com"}}
    )


class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str


# Schemas for Enrollment


class EnrollmentStatus(str, Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DROPPED = "dropped"

# Schemas for course


class CourseBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True


class CourseCreateSchema(BaseModel):
    """Base schema for course data"""

    name: str = Field(
        ..., min_length=1, max_length=200, description="The name of the course"
    )
    description: str = Field(None, max_length=1000,
                             description="Course description")
    is_active: bool = Field(
        True, description="Whether the course is active and available for enrollment"
    )


class CourseUpdate(CourseBase):
    name: str | None = None
    is_active: bool | None = None


class UserCourseEnrollmentBase(BaseModel):
    course_id: int
    user_id: int
    status: EnrollmentStatus = EnrollmentStatus.ENROLLED
    grade: float | None = None
    model_config = ConfigDict(from_attributes=True)


class UserCourseEnrollmentSchema(UserCourseEnrollmentBase):
    enrolled_at: datetime
    completion_date: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class CourseSchema(CourseBase):
    id: int
    created_at: datetime
    student_enrollments: list[UserCourseEnrollmentSchema] | None = []

    model_config = ConfigDict(from_attributes=True)


class UserCourseEnrollmentCreate(BaseModel):
    course_id: int
    user_id: int

    model_config = ConfigDict(
        json_schema_extra={"example": {"course_id": 1, "user_id": 1}}
    )


class UserCourseEnrollmentUpdate(BaseModel):
    status: EnrollmentStatus | None = None
    grade: float | None = Field(None, ge=0, le=100)

    model_config = ConfigDict(
        json_schema_extra={"example": {"status": "completed", "grade": 95.5}}
    )

# Company related schemas (kept from original)


class CompanySchema(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="The name of the company, unique and required.",
    )
    postal_code: str = Field(
        min_length=1,
        max_length=20,
        description="The postal code for the company's address. Optional.",
    )
    email: EmailStr = Field(
        description="The contact email for the company. Optional and must be a valid email format."
    )
    description: str = Field(
        description="A description of the company. Optional.")
    analytics_module: bool = Field(
        default=None,
        description="Indicates whether the company uses the analytics module. Required.",
    )
    company_type_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Tech University",
                "postal_code": "12345",
                "email": "info@techuniversity.com",
                "description": "A leading institution in technology education and research.",
                "analytics_module": True,
            }
        },
    )


class CompanySlimSchema(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="The name of the company, unique and required.",
    )
    email: EmailStr = Field(
        description="The contact email for the company. Optional and must be a valid email format."
    )
    company_type_id: int


class CompanyOutSchema(CompanySchema):
    id: int


class CompanyTypeSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    model_config = ConfigDict(from_attributes=True)


class CompanyTypeFullSchema(CompanyTypeSchema):
    companies: list[CompanySchema]


class CompanyAndTypeSchema(CompanySchema):
    company_type_id: int


# Schemas for users

class UserRegisterSchema(BaseModel):
    email: str
    last_name: str
    first_name: str
    password: str
    model_config = ConfigDict(from_attributes=True)

    # TODO ADD VALIDATION


class UserOutSchema(BaseModel):
    # We use this to return user data
    id: int
    email: str
    last_name: str
    first_name: str
    is_superuser: bool
    model_config = ConfigDict(from_attributes=True)


class UserSchema(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    disabled: bool = False
    created_at: datetime
    company_id: int | None = None
    course_enrollments: list[UserCourseEnrollmentSchema] | None = []
    is_superuser: bool

    model_config = ConfigDict(from_attributes=True)


class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    model_config = ConfigDict(from_attributes=True)


# Schemas for projects


class ProjectSchema(BaseModel):
    id: int
    name: str
    area_image: bytes | None = None
    coordinates: dict | None = None
    result_image: bytes | None = None
    model_3d: bytes | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectCreateSchema(BaseModel):
    """Base schema for course data"""

    name: str = Field(
        ..., min_length=1, max_length=200, description="The name of the course"
    )


class ProjectNameUpdateSchema(BaseModel):
    name: str | None = None
    model_config = ConfigDict(from_attributes=True)


class ProjectCoordinateUpdateSchema(BaseModel):
    coordinates: dict | None = None
    model_config = ConfigDict(from_attributes=True)


class ProjectAreaUpdateSchema(BaseModel):

    area_image: bytes | None = None
    model_config = ConfigDict(from_attributes=True)
