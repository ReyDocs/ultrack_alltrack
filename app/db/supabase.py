from supabase import create_client, Client
from app.core.config import settings

# ── Anon client — used for auth operations (sign in, sign up, OAuth) ─────────
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_anon_key,
)

# ── Admin client — bypasses RLS, used for all table CRUD in services ─────────
supabase_admin: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)
