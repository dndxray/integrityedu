from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schema import UserRegister, UserLogin
from app.core.security import hash_password, verify_password, create_access_token


def register_user(db: Session, user: UserRegister):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return None

    if user.role not in ["teacher", "student"]:
        raise ValueError("Invalid role")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user: UserLogin):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        return None

    if not verify_password(user.password, existing_user.password):
        return None

    token = create_access_token(
        {
            "sub": str(existing_user.id),
            "email": existing_user.email,
            "role": existing_user.role
        }
    )

    return token