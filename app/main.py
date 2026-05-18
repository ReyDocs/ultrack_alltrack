from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import router
from app.core.config import settings
from fastapi.responses import JSONResponse
import traceback
app = FastAPI(
    title="ULTRACK API",
    description="Backend for ULTRACK — the student productivity platform.",
    version="1.0.0",
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Global Exception", "error": str(exc), "trace": traceback.format_exc()}
    )

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allow the frontend origin to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "https://ultrackalltrack.vercel.app",
        "https://ultrack-alltrack.vercel.app", 
        "https://www.ultrack.site",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "ULTRACK API is running."}


