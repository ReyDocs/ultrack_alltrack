# Supabase Auth Migration — Session Notes

## 🧠 Context
This document tracks the authentication migration from a hybrid system (Supabase + Railway Auth) to a **Supabase-only authentication architecture** for a Vercel + Railway deployed application.

The system previously suffered from:
- OAuth state mismatch errors (`bad_oauth_state`)
- Mixed authentication ownership (Supabase + custom backend OAuth)
- Broken callback handling between Railway and Supabase
- Missing or incorrect environment variables in production

---

## 🚨 Original Problem Summary

### Primary Issue
OAuth login failures caused by conflicting auth systems:
- Supabase OAuth flow initiated login
- Railway backend attempted to handle OAuth callback
- Redirect URLs were incorrectly pointing to Railway instead of frontend
- Session state could not be validated → `bad_oauth_state`

### Secondary Issues
- Missing `VITE_BACKEND_URL` in Vercel
- Frontend calling backend with empty or undefined URL
- OAuth implemented via fetch instead of browser redirect
- Backend and frontend authentication responsibilities overlapped

---

## 🏗️ Previous Architecture (BROKEN)

Frontend (Vercel)
   ↓
Supabase OAuth
   ↓
Google OAuth
   ↓
Railway Auth Callback (/api/v1/auth/google/callback)
   ↓
Session mismatch / state loss

Problems:
- Two competing auth systems
- Invalid redirect_to URLs
- State validation failure

---

## ✅ Target Architecture (FIXED)

Frontend (Vercel)
   ↓
Supabase Google OAuth ONLY
   ↓
Supabase Session stored in browser
   ↓
Frontend reads session via Supabase client
   ↓
Railway backend used ONLY for API/data

---

## 🔧 Migration Actions Performed

### 1. Removed Railway OAuth Dependency
- Deleted frontend function calling:
  - `/api/v1/auth/google`
- Replaced with Supabase `signInWithOAuth`

---

### 2. Standardized OAuth Flow
- OAuth handled fully by Supabase
- Redirect URL fixed to:
  ```
  https://ultrackalltrack.vercel.app
  ```

---

### 3. Fixed Supabase Dashboard Configuration

**Site URL:**
```
https://ultrackalltrack.vercel.app
```

**Redirect URLs:**
```
https://ultrackalltrack.vercel.app/**
```

Removed:
- localhost URLs
- Railway URLs

---

### 4. Environment Variables (Vercel)

Required variables:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_BACKEND_URL
```

Backend URL points ONLY to Railway API.

---

### 5. Backend Role Re-defined
Railway backend now ONLY handles:
- /api/v1/users
- /api/v1/data
- /api/v1/projects

Removed responsibilities:
- OAuth login
- OAuth callback
- Session handling

---

### 6. Authentication Flow Fix
Replaced fetch-based OAuth with redirect-based flow:

```js
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://ultrackalltrack.vercel.app'
  }
});
```

---

### 7. Session Handling Update
Frontend now uses Supabase session:

```js
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 🔍 Root Cause of Original Failure

Primary causes:
- Mixed authentication systems (Supabase + Railway OAuth)
- Invalid redirect_to URL missing protocol or pointing to backend
- Backend interfering with OAuth state validation
- Missing environment variables causing undefined API base URLs

Result:
- OAuth state mismatch (`bad_oauth_state`)
- Broken login flow

---

## 📊 Final Status

| Component | Status |
|----------|--------|
| Supabase OAuth | ✅ Active |
| Railway Backend | ✅ API only |
| Frontend Auth | ✅ Supabase-only |
| OAuth Flow | ✅ Fixed |
| Session Handling | ✅ Supabase-managed |

---

## 🧪 Validation Checklist

After deployment:
- [ ] Google login redirects to Supabase
- [ ] Redirect returns to Vercel frontend
- [ ] Session persists after refresh
- [ ] `/api/v1/users/me` works with Bearer token
- [ ] No Railway auth endpoints used

---

## 🧠 Key Principle Learned

> Authentication must have a single source of truth.

In this system:
- Supabase = Auth provider
- Railway = Data API only
- Frontend = Session consumer

No overlaps allowed