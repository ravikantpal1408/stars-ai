import logging
import pathlib
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Dynamically find the directory where your .env lives
# Points to backend/src/ directory (1 level up from this file)
ENV_DIR: pathlib.Path = pathlib.Path(__file__).parent.parent.resolve()

class BackendBaseSettings(BaseSettings):
    # This replaces all 'decouple' logic. 
    # It reads your .env file and maps keys to these variables.
    model_config = SettingsConfigDict(
        env_file=f"{ENV_DIR}/.env",
        case_sensitive=True,
        extra="ignore" 
    )

    # General Settings
    TITLE: str = "STARS AI Backend"
    VERSION: str = "0.1.0"
    TIMEZONE: str = "UTC"
    DESCRIPTION: str | None = None
    DEBUG: bool = False

    # Server Settings (Automatically looks for these keys in .env)
    SERVER_HOST: str = Field(alias="BACKEND_SERVER_HOST", default="127.0.0.1")
    SERVER_PORT: int = Field(alias="BACKEND_SERVER_PORT", default=8000)
    SERVER_WORKERS: int = Field(alias="BACKEND_SERVER_WORKERS", default=1)
    
    # Database Settings
    DATABASE_URL: str = Field(alias="DATABASE_URL_POSTGRES", default="sqlite+aiosqlite:///./test.db")
    
    API_PREFIX: str = "/api"
    DOCS_URL: str = "/docs"
    OPENAPI_URL: str = "/openapi.json"
    REDOC_URL: str = "/redoc"
    OPENAPI_PREFIX: str = ""

    # Database Settings (Aliases match your .env keys)
    # DB_POSTGRES_HOST: str = Field(alias="POSTGRES_HOST")
    # DB_MAX_POOL_CON: int = Field(alias="DB_MAX_POOL_CON", default=20)
    # DB_POSTGRES_NAME: str = Field(alias="POSTGRES_DB")
    # DB_POSTGRES_PASSWORD: str = Field(alias="POSTGRES_PASSWORD")
    # DB_POOL_SIZE: int = Field(alias="DB_POOL_SIZE", default=5)
    # DB_POOL_OVERFLOW: int = Field(alias="DB_POOL_OVERFLOW", default=10)
    # DB_POSTGRES_PORT: int = Field(alias="POSTGRES_PORT", default=5432)
    # DB_POSTGRES_SCHEMA: str = Field(alias="POSTGRES_SCHEMA", default="public")
    # DB_TIMEOUT: int = Field(alias="DB_TIMEOUT", default=30)
    # DB_POSTGRES_USERNAME: str = Field(alias="POSTGRES_USERNAME")

    # IS_DB_ECHO_LOG: bool = Field(alias="IS_DB_ECHO_LOG", default=False)
    # IS_DB_FORCE_ROLLBACK: bool = Field(alias="IS_DB_FORCE_ROLLBACK", default=False)
    # IS_DB_EXPIRE_ON_COMMIT: bool = Field(alias="IS_DB_EXPIRE_ON_COMMIT", default=True)

    # Auth & Security
    # API_TOKEN: str = Field(alias="API_TOKEN")
    # AUTH_TOKEN: str = Field(alias="AUTH_TOKEN")
    # JWT_TOKEN_PREFIX: str = Field(alias="JWT_TOKEN_PREFIX", default="Token")
    # JWT_SECRET_KEY: str = Field(alias="JWT_SECRET_KEY")
    # JWT_SUBJECT: str = Field(alias="JWT_SUBJECT", default="access")
    JWT_MIN: int = Field(alias="JWT_MIN", default=60)
    JWT_HOUR: int = Field(alias="JWT_HOUR", default=24)
    JWT_DAY: int = Field(alias="JWT_DAY", default=7)
    
    @property
    def JWT_ACCESS_TOKEN_EXPIRATION_TIME(self) -> int:
        return self.JWT_MIN * self.JWT_HOUR * self.JWT_DAY

    IS_ALLOWED_CREDENTIALS: bool = Field(alias="IS_ALLOWED_CREDENTIALS", default=True)
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000", "http://0.0.0.0:3000", "http://127.0.0.1:3000",
        "http://127.0.0.1:3001", "http://localhost:5173", "http://0.0.0.0:5173",
        "http://127.0.0.1:5173", "http://127.0.0.1:5174",
    ]
    ALLOWED_METHODS: list[str] = ["*"]
    ALLOWED_HEADERS: list[str] = ["*"]

    LOGGING_LEVEL: int = logging.INFO
    LOGGERS: tuple[str, str] = ("uvicorn.asgi", "uvicorn.access")

    # HASHING_ALGORITHM_LAYER_1: str = Field(alias="HASHING_ALGORITHM_LAYER_1")
    # HASHING_ALGORITHM_LAYER_2: str = Field(alias="HASHING_ALGORITHM_LAYER_2")
    # HASHING_SALT: str = Field(alias="HASHING_SALT")
    # JWT_ALGORITHM: str = Field(alias="JWT_ALGORITHM", default="HS256")

    @property
    def set_backend_app_attributes(self) -> dict:
        return {
            "title": self.TITLE,
            "version": self.VERSION,
            "debug": self.DEBUG,
            "description": self.DESCRIPTION,
            "docs_url": self.DOCS_URL,
            "openapi_url": self.OPENAPI_URL,
            "redoc_url": self.REDOC_URL,
        }