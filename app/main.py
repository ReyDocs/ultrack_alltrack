from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import router
from app.core.config import settings

app = FastAPI(
    title="ULTRACK API",
    description="Backend for ULTRACK — the student productivity platform.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allow the frontend origin to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "ULTRACK API is running."}
