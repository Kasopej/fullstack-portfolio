# 🚀 Fullstack Portfolio Monorepo

A production-grade fullstack portfolio & CMS application built as a monorepo but designed with a modern, scalable architecture separating frontend, backend, and database concerns.

---

## 🧱 Project Structure
root/
├── frontend/ → Next.js frontend (Vercel)
└── backend/ → NestJS API (Render)

---

## 🌐 System Architecture
🧑 User
↓
🌐 Frontend (Next.js - Vercel)
↓
🟩 Backend API (NestJS - Render)
↓
🗄️ Supabase (Auth + PostgreSQL + Storage)

---

## ⚙️ Tech Stack

### Frontend
- ⚡ Next.js (App Router)
- ⚛️ React
- 🟦 TypeScript
- 🎨 Tailwind CSS
- ☁️ Vercel Hosting

### Backend
- 🟩 NestJS
- 🟦 TypeScript
- 🧩 TypeORM
- 🔐 Supabase Auth Integration
- ☁️ Render Hosting

### Database & Storage
- 🗄️ Supabase PostgreSQL
- 🔐 Supabase Auth
- 📦 Supabase Storage

---

## 🔐 Key Features

- 🔑 Authentication (Supabase-based)
- 🧑 Role-Based Access Control (Admin / Guest)
- 📁 File Upload System (Storage-backed)
- 🧠 Modular NestJS architecture
- 🌐 Fully decoupled frontend/backend
- 🔄 Migration-based database management

---

## 🚀 Deployment

- Frontend → Vercel
- Backend → Render
- Database/Auth/Storage → Supabase

---

## 📦 Local Development

See subfolder readme files for how to run each app locally, as well as architecture details.

---

## 🧠 Design Philosophy

This project is designed to mirror real-world SaaS architecture:

- Separation of concerns (UI / API / DB)
- Stateless backend API design
- Managed authentication layer (Supabase)
- Scalable deployment strategy
- Production-ready database structure

---

## 📌 Summary

A fully modular fullstack system showcasing modern engineering practices across frontend, backend, and database layers.

---

# 🧭 System Architecture
                ┌──────────────────────────────┐
                │          User                │
                └────────────┬─────────────────┘
                             │
                             ▼
            ┌─────────────────────────────────────┐
            │     Frontend (Next.js - Vercel)     │
            │  • UI / Pages / State / Fetch API   │
            └────────────┬────────────────────────┘
                            REST API
                                ▼
            ┌─────────────────────────────────────┐
            │     Backend (NestJS - Render)       │
            │  • Auth Guard / RBAC                │
            │  • Business Logic                   │
            │  • API Modules                      │
            │    (projects, posts, skills, tags,  │
            │     users etc.)                     │
            │  • Dependency Injection             │
            └────────────┬────────────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
    ┌──────────────┐ ┌────────────────┐ ┌──────────────────┐
    │ Supabase Auth│ │ PostgreSQL DB  │ │  Supabase Storage│
    │ (Identity)   │ │   (App Data)   │ │     (Files)      │
    └──────────────┘ └────────────────┘ └──────────────────┘