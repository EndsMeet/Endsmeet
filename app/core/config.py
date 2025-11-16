from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Ends Meet API"
    API_PREFIX: str = "/api"

    # Auth / security
    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3010",
        "http://127.0.0.1:3010",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database (belangrijk voor je fout!)
    DATABASE_URL: str = "sqlite+pysqlite:///./dev.db"

    # AI & e-mail (lezen uit .env als aanwezig)
    RESEND_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    APP_ENV: str = "dev"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()