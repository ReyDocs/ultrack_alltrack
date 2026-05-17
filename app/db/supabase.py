from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# ── Anon client — used for auth operations (sign in, sign up, OAuth) ─────────
try:
    supabase: Client = create_client(
        settings.supabase_url,
        settings.supabase_anon_key,
    )
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {e}")
    supabase = None

# ── Admin client — bypasses RLS, used for all table CRUD in services ─────────
try:
    supabase_admin: Client = create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )
except Exception as e:
    logger.error(f"Failed to initialize Supabase admin client: {e}")
    supabase_admin = None
