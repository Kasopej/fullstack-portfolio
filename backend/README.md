<p align="center">
  <a data-analytics="" data-cta=""  href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

The backend acts as the **single source of truth** for all application logic.

---

## 🔐 Authentication

Authentication is handled via Supabase:

- Users are created in `auth.users`
- Application profiles are mirrored into `public.users`
- Schema separation is used to isolate application data from Supabase's authentication tables
- JWT-based session validation
- Custom NestJS Supabase strategy
- Auth guard injects full user entity into request context

---

## 🧩 Role-Based Access Control (RBAC)

The system includes a simple but extensible RBAC design:

- Roles: `admin`, `guest`
- Users → Many-to-One Role
- Roles → Many-to-Many Permissions (future-ready)

Supports:

- Route protection
- Role-based authorization logic
- Extendable permission system

---

## 📂 File Uploads

Files are uploaded to Supabase Storage via backend service:

- File validation (size/type)
- UUID-based naming
- Secure upload pipeline
- Public/private bucket handling

---

## 🗄️ Database

PostgreSQL via Supabase:

- `users`
- `roles`
- `permissions`
- `projects`
- `skills`
- `posts`

Managed using TypeORM entities and migrations.

---

## 🛠️ Local Development

#### Setup
```bash
npm install
npm run start:dev
```
---

## 🌍 Deployment

  - Hosted on Render
  - Automatic deployment from main branch
  - Environment variables managed via Render dashboard

## 🧱 Key Design Decisions

Supabase used for Auth + DB + Storage (single ecosystem), but structured for easy separation of application data if needed in the future.
TypeORM for structured relational modeling.
Separation of frontend/backend for scalability.
Stateless API design.
Migration-based production database strategy.

---

## 🔮 Future Improvements

- Add fine-grained permissions for more granular control
- Admin dashboard enhancements
- API caching layer