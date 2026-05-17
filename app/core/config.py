from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # Google OAuth
    google_client_id: str
    google_client_secret: str

    # App
    app_secret_key: str
    frontend_url: str
    backend_url: str
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


# Single shared instance — import this everywhere
settings = Settings()
