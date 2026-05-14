# Development Status Report

## 1. Current State of the Working Directory
- The working directory (`Project 14_ULTRACKER`) is configured as a full-stack monolithic repository.
- **IMPORTANT**: The working directory contains both the **frontend** and the **backend**:
  - **Frontend**: A React/Vite application located in the `/frontend` directory (running on `localhost:5173`).
  - **Backend**: A Python/FastAPI server located in the root `/app` directory (running on `localhost:8000`).
- Both development servers are currently active and running.
- The project integrates tightly with **Supabase** for Authentication (GoTrue) and PostgreSQL Database storage.

## 2. Errors Currently Present
- Users successfully authenticate with Google via Supabase, but the local FastAPI backend occasionally throws a `500 Internal Server Error` during the profile hydration phase (`/api/v1/users/me`).
- Because the backend fails to return the full user profile, the frontend's `AuthCallbackPage` hits a 5-second fallback timeout ("User profile failed to hydrate") and traps the user on a debug screen instead of navigating to the Dashboard.

## 3. Specific Error We're Trying to Solve
- **The Google OAuth Post-Authentication Redirect Flow.**
- We need to ensure that immediately after a user successfully logs in or signs up via Google, their session is hydrated gracefully. For brand new users, the FastAPI backend must successfully intercept the `/me` request, auto-create their corresponding profile in the `public.users` database table without crashing, and securely redirect them into the `/dashboard`.

## 4. What Attempts Have Been Done
1. **Frontend PKCE Migration**: Reverted the Google login trigger from the backend to the frontend (`supabase.auth.signInWithOAuth()`) so the browser could successfully persist the PKCE `code_verifier` (which the stateless FastAPI backend was dropping).
2. **Database Trigger Removal**: Diagnosed and instructed the removal of a fatal Postgres database trigger (`on_auth_user_created`) in the Supabase Dashboard that was crashing the `auth.users` insertion due to strict `NOT NULL` constraints on the public table.
3. **Database Schema Alignment**: Updated the backend `user_service.py` to strictly filter out extra dictionary fields (like `username`) before inserting into the database to prevent 500 errors.
4. **Library Version Patches**: Discovered that the installed version of `supabase-python` returns `None` instead of an empty API response when `.maybe_single()` finds no rows. Fixed the resulting `AttributeError` crash when the backend checked for an existing user.
5. **Zombie Process Termination**: Identified that multiple hidden background `uvicorn` processes were hijacking port 8000 and executing old cached bytecode. Terminated the zombie processes to allow the fresh code to execute.
6. **Visual Debugging Integration**: Modified the `AuthCallbackPage.jsx` to render a red visual debug screen rather than silently bouncing the user back to `/login` when a crash occurs.

## 5. What Files Have Been Changed
- `frontend/src/context/AuthContext.jsx`: Refactored to handle native frontend OAuth and capture `INITIAL_SESSION` states.
- `frontend/src/pages/AuthCallbackPage/AuthCallbackPage.jsx`: Added asynchronous fallback timers and visual debug UI for failed hydration.
- `frontend/src/pages/LoginPage/LoginPage.jsx` & `SignUpPage.jsx`: Streamlined the authentication calls.
- `app/api/v1/endpoints/users.py`: Refactored `get_me()` to safely catch and auto-create new Google users in the database.
- `app/services/user_service.py`: Fixed the `.maybe_single()` exception handling and aligned `create_user_with_id` payloads with the exact Supabase SQL schema.
- `app/api/v1/endpoints/auth.py`: Added debug traces and stabilized the fallback login routes.
- `app/main.py`: Injected a global exception handler to output readable 500 error traces.
