import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

def get_database_url() -> str:
    # If fallback is enabled and we cannot connect to postgres or postgres is not local, use SQLite for zero-friction local tests
    if settings.USE_SQLITE_FALLBACK and (settings.ENVIRONMENT == "development" or settings.ENVIRONMENT == "testing"):
        sqlite_file = os.path.abspath(settings.SQLITE_DB_PATH)
        return f"sqlite:///{sqlite_file}"
    return settings.DATABASE_URL

db_url = get_database_url()
is_sqlite = db_url.startswith("sqlite")

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if is_sqlite else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
