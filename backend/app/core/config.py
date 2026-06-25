from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Cursor Meetup API"
    debug: bool = True
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
