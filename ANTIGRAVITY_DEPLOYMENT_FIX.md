# ULTRACK Deployment Fix Instructions for Antigravity

This document contains specific instructions for fixing the deployment issues between the Vercel frontend and Railway backend. Read this carefully before making any changes.

---

## Project Structure

```
root/
├── app/                  # FastAPI backend
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── main.py
│   ├── models/
│   ├── schemas/
│   └── services/
├── frontend/             # React/Vite frontend
│   ├── src/
│   │   ├── api/
│   │   ├── config/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── pages/
│   ├── vercel.json
│   └── vite.config.js
├── Procfile
└── requirements.txt
```

---

## Deployment Setup

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://www.ultrack.site |
| Backend | Railway | https://ultrackalltrack-production.up.railway.app |
| Database + Auth | Supabase | https://zeefkbuigonvvjimquzk.supabase.co |

---

## Issues to Fix

### Issue 1 — Syntax Error in `AuthContext.jsx`

**File:** `frontend/src/context/AuthContext.jsx`

**Problem:** The `googleLogin` function has a broken template literal — the backticks are missing around the `redirectTo` value, making it a syntax error that breaks Google OAuth.

**Find this:**
```js
redirectTo: ${window.location.origin}/auth/callback,
```

**Replace with:**
```js
redirectTo: `${window.location.origin}/auth/callback`,
```

**Why:** Without the backticks, JavaScript cannot evaluate `${window.location.origin}` as a template literal. It gets treated as a plain string or throws a reference error, breaking the entire Google login flow.

---

### Issue 2 — CORS Configuration in `app/main.py`

**File:** `app/main.py`

**Problem:** The `FRONTEND_URL` environment variable in Railway is set to `https://www.ultrack.site/` with a trailing slash. If CORS is doing an exact match, the trailing slash mismatch will block all frontend requests.

**Find the CORS middleware configuration and replace it with:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "https://www.ultrack.site",
        "https://www.ultrack.site/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Why:** By explicitly listing both with and without the trailing slash, CORS will work regardless of how the URL is formatted in the environment variable.

---

## Manual Steps (Not Code Changes)

These need to be done manually in the respective dashboards — they cannot be handled by code changes.

### Step 1 — Add missing environment variable in Vercel

Go to **Vercel Dashboard → your project → Settings → Environment Variables** and add:
```
VITE_BACKEND_URL=https://ultrackalltrack-production.up.railway.app
```

Keep the existing `VITE_API_URL` as well — add `VITE_BACKEND_URL` as an additional variable.

After saving, **trigger a manual redeploy** in Vercel for the variable to take effect.

---

### Step 2 — Add explicit callback URL in Supabase

Go to **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs** and add:
```
https://www.ultrack.site/auth/callback
```

The existing `https://www.ultrack.site/**` wildcard should already cover this, but adding the explicit URL prevents any edge case issues.

---

## Order of Operations

Apply all fixes in this exact order to avoid partial states:

1. Fix the syntax error in `frontend/src/context/AuthContext.jsx`
2. Fix the CORS middleware in `app/main.py`
3. Push both changes to GitHub — Railway and Vercel will auto-redeploy
4. Add `VITE_BACKEND_URL` in Vercel and trigger a manual redeploy
5. Add the explicit callback URL in Supabase

---

## Validation Checklist

After all fixes are applied and both services have redeployed:

- [ ] Open `https://www.ultrack.site`
- [ ] Click Google login — should redirect to Google account selection
- [ ] After selecting account, should redirect back to `https://www.ultrack.site/auth/callback`
- [ ] Should navigate to dashboard after successful login
- [ ] Open browser DevTools → Network tab
- [ ] Navigate to any feature page (tasks, finances, etc.)
- [ ] Confirm API calls are going to `https://ultrackalltrack-production.up.railway.app`
- [ ] Confirm API calls return `200` responses, not CORS errors or `401`

---

## Key Principles

- **Authentication** is handled entirely by Supabase — Railway backend does not own any OAuth flow
- **Railway backend** is API/data only — all endpoints under `/api/v1/`
- **Frontend** reads the Supabase session and sends the Bearer token to Railway for all data requests
- **CORS** must explicitly allow the Vercel frontend URL on the Railway backend
