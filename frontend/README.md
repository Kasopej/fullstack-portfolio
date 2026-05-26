# Portfolio Frontend

A modern full-stack portfolio frontend built with **Next.js**, designed to showcase projects, skills, and blog content, powered by a dedicated backend API.

### 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Supabase Authentication (via backend API integration)
- Tailwind CSS
- Posthog integration for client-side session/visits tracking
- Chart.js components for displaying usage stats
- Custom HTTP client based on native fetch, with interceptors, headers configuration, body formatting (no axios dependency)
- Deployed on Vercel

### 📦 Features

- Modern responsive UI
- Project and blog showcase
- Authentication-aware UI (admin/guest roles)
- File/media rendering via Supabase Storage URLs

### 🔗 Backend Integration

This frontend consumes a separate backend API deployed separately.

### 🧠 Architecture

The frontend is fully decoupled from the database layer:

Frontend (Next.js)
        ↓
NestJS API (Render)
        ↓
Supabase (Auth + DB + Storage)

### 🛠️ Setup
```bash
npm install
npm run dev
```

### 📦 Build
```bash
npm run build
npm run start
```

### 🌍 Deployment

Deployed on Vercel with automatic CI/CD from the main branch.

### 📌 Notes
    - No direct database access from frontend
    - All business logic handled in backend API
    - Authentication handled via Supabase-backed session layer