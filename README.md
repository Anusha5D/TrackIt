# TrackR

A full-stack job application tracker — track applications, statuses, and follow-ups, with a dashboard for response rate and weekly volume.

## Stack

**Frontend:** React 19 + Vite, Tailwind, React Router, Recharts, Axios, Google OAuth
**Backend:** Node.js + Express, PostgreSQL + Sequelize, JWT + bcrypt, `google-auth-library`
**Infra:** Vercel (frontend) · Render (backend) · managed Postgres (Render/Supabase/Neon)

## Architecture

```
Browser (React SPA)
   |  HTTPS/JSON
   v
Express (server.js)
   |-- CORS + JSON body parsing
   |-- /api/auth/*          -> authController (signup, login, Google OAuth + account linking)
   |-- /api/applications/*  -> protect (JWT) -> applicationController (CRUD + stats)
   v
Sequelize models (User, Application)
   v
PostgreSQL
```

- JWT auth via `Authorization: Bearer <token>`, verified in `protect` middleware before any application route runs.
- Google sign-in links to an existing account by matching `googleId` OR `email` — no duplicate accounts.
- Dashboard stats (`GET /api/applications/stats`) are aggregated in SQL (`GROUP BY`/`COUNT`), not computed client-side.

## Setup

```bash
# Backend
cd server && npm install && npm run dev   # localhost:5000

# Frontend
cd client && npm install && npm run dev   # localhost:5173
```

**`server/.env`**
```
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/trackr
JWT_SECRET=<random string>
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<same client ID as backend>
```

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` / `/login` / `/google` | Auth |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/applications` | List (filter/sort/paginate) / create |
| GET/PUT/DELETE | `/api/applications/:id` | Read / update / delete one |
| GET | `/api/applications/stats` | Dashboard aggregates |

