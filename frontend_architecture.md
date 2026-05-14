# ULTRACKER Frontend Architecture & Technology Stack

This document outlines the architectural patterns, design philosophy, and technology stack used in the ULTRACKER frontend application.

## 1. Core Technology Stack

ULTRACKER is built as a high-performance Single Page Application (SPA) using a modern, lightweight, and scalable stack:

- **Library**: [React 19](https://react.dev/) — Leveraging the latest features for efficient rendering and state management.
- **Build Tool**: [Vite 8](https://vitejs.dev/) — Providing ultra-fast Hot Module Replacement (HMR) and optimized production builds.
- **Routing**: [React Router Dom 7](https://reactrouter.com/) — Handling navigation with support for Protected Routes and Page Transitions.
- **Icons**: [Lucide React](https://lucide.dev/) — A clean and consistent icon library.
- **Backend Communication**: [Supabase JS](https://supabase.com/docs/reference/javascript/introduction) — Direct client-side interaction with Supabase services.

## 2. Architectural Overview

### 2.1 Directory Structure
The project follows a feature-modular structure:

```text
frontend/src/
├── api/             # Modular API clients (Auth, Finances, Grades, Resources)
├── assets/          # Static images, logos, and global assets
├── components/      # Reusable UI components (Buttons, Inputs, PageShell)
├── context/         # React Context for global state (AuthContext)
├── layouts/         # High-level layouts (DashboardLayout)
├── pages/           # Feature-specific page components
├── routes/          # Navigation logic and route definitions
└── styles/          # Global design system (variables, reset, animations)
```

### 2.2 Global State & Authentication
- **AuthContext**: Manages user sessions, profile hydration, and secure tokens (Access/Refresh) stored in `localStorage`.
- **Protected Routes**: Wraps sensitive pages to ensure only authenticated users can access dashboard features.

### 2.3 Styling & Design System
ULTRACKER utilizes a **Unified Motion & Design System** built on **Vanilla CSS**:
- **CSS Variables**: Centralized tokens for colors, typography, spacing, and timing.
- **Premium Aesthetic**: A dark-mode first design using radial gradients, glassmorphism, and high-fidelity typography (Inter).
- **Cinematic Animations**: A custom animation system (`animations.css`) providing orchestrated entrance effects (`page-enter`, `card-enter`) for a premium feel.

### 2.4 Data Flow & Persistence
- **Optimistic UI**: Key interactions (like adding expenses or courses) update the UI instantly while syncing with the backend in the background.
- **REST API Integration**: Communicates with a custom FastAPI backend for complex logic (like GWA calculations and financial management).
- **Direct Database Access**: Utilizes Supabase for real-time events and high-performance data retrieval where appropriate.

## 3. Key Performance Features
- **Zero-Latency Interactions**: Heavy use of optimistic updates and local state caching.
- **Numerical Stability**: Use of `Decimal` types (bridged to backend) for academic and financial calculations.
- **Mobile First**: A fully responsive design system that adaptively scales from desktop ultra-wide monitors down to small mobile viewports.
