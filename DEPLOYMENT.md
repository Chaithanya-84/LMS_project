# LMS Project – Deployment Guide

Deploy the **frontend** (Next.js) to **Vercel** and the **backend** (Express) to **Railway** with PostgreSQL.

---

## 1. Backend (Railway)

### Prerequisites

- [Railway](https://railway.app) account
- GitHub repo connected

### Steps

1. **Create a new project** on [Railway](https://railway.app/new).

2. **Add PostgreSQL**  
   - Click **+ New** → **Database** → **PostgreSQL**  
   - Railway will create a Postgres instance and set `DATABASE_URL` automatically.

3. **Deploy the backend**
   - Click **+ New** → **GitHub Repo**
   - Select your LMS repo
   - **Important:** Set **Root Directory** to `backend` (in Settings → Source). If you skip this, Railway will use the repo root and the build will fail with "No start command was found".
   - Railway will detect `railway.json` and `nixpacks.toml` for build/deploy.

4. **Environment variables** (in the backend service → Variables):

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Auto-set by PostgreSQL plugin |
   | `JWT_ACCESS_SECRET` | Random string (min 32 chars) |
   | `JWT_REFRESH_SECRET` | Random string (min 32 chars) |
   | `CORS_ORIGIN` | Your Vercel frontend URL exactly, e.g. `https://your-app.vercel.app` (no trailing slash) |
   | `COOKIE_DOMAIN` | Leave empty for Railway (omit) |
   | `NODE_ENV` | `production` (Railway usually sets this) |
   | `OPENAI_API_KEY` | (Optional) For AI chat – get from platform.openai.com |

5. **Deploy**  
   - Push to GitHub; Railway will build and deploy.  
   - Copy the public URL (e.g. `https://your-backend.up.railway.app`).

---

## 2. Frontend (Vercel)

### Prerequisites

- [Vercel](https://vercel.com) account
- GitHub repo connected

### Steps

1. **Import project**  
   - Go to [Vercel](https://vercel.com/new)  
   - Import your LMS GitHub repo  
   - Set **Root Directory** to `frontend`

2. **Environment variables** (Project → Settings → Environment Variables):

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | Your Railway backend URL, e.g. `https://your-backend.up.railway.app` |

3. **Deploy**  
   - Push to GitHub or trigger a deploy from the Vercel dashboard.

---

## 3. Post-deploy checklist

- [ ] Backend URL is reachable (e.g. `https://your-backend.up.railway.app/api/health`).
- [ ] Frontend loads and shows courses.
- [ ] Login works (demo: `demo@lms.com` / `password123`).
- [ ] CORS: `CORS_ORIGIN` on Railway = your exact Vercel URL.
- [ ] Vercel: `NEXT_PUBLIC_API_BASE_URL` = your exact Railway backend URL (no trailing slash).

---

## 4. Troubleshooting (deployed but not working)

| Symptom | Fix |
|---------|-----|
| **Login fails / "Invalid credentials"** | 1. Check `CORS_ORIGIN` on Railway = your Vercel URL exactly (e.g. `https://lms-xyz.vercel.app`). 2. Redeploy backend after changing env vars. |
| **API calls go to localhost** | Set `NEXT_PUBLIC_API_BASE_URL` on Vercel to your Railway URL. Redeploy frontend. |
| **CORS error in browser** | `CORS_ORIGIN` on Railway must match your frontend URL exactly (including `https://`). |
| **Cookies not sent / session lost** | Backend uses `SameSite=None` in production for cross-origin. Ensure both use HTTPS. |
| **404 on /api/...** | Verify backend is running and the URL in `NEXT_PUBLIC_API_BASE_URL` is correct. |

---

## 5. Backend on Render (Alternative to Railway)

Use [Render](https://render.com) to host the backend for free.

### Step 1: Create PostgreSQL database

1. Go to [render.com](https://render.com) and sign up (free).
2. Click **New +** → **PostgreSQL**.
3. Name it `lms-db` (or any name).
4. Choose **Free** plan.
5. Click **Create Database**.
6. Wait for it to spin up. Copy the **Internal Database URL** (starts with `postgresql://`).

### Step 2: Create Web Service (backend)

1. Click **New +** → **Web Service**.
2. Connect your GitHub account and select the **LMS_project** repo.
3. Configure:
   - **Name:** `lms-backend`
   - **Region:** Choose closest to you
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install --include=dev && npm run build`  
     *(Required: `--include=dev` installs TypeScript types needed for the build)*
   - **Start Command:** `cp prisma/schema.postgres.prisma prisma/schema.prisma && npx prisma db push && npm run db:seed && npm run start`  
     *(Required: uses PostgreSQL schema on Render)*
4. Click **Advanced** and add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste the PostgreSQL Internal Database URL from Step 1 |
   | `JWT_ACCESS_SECRET` | Any random string, min 32 chars (e.g. `my-super-secret-jwt-access-key-12345`) |
   | `JWT_REFRESH_SECRET` | Another random string, min 32 chars |
   | `CORS_ORIGIN` | `https://lms-project-q44b.vercel.app` |
   | `NODE_ENV` | `production` |

5. Click **Create Web Service**.
6. Wait for the first deploy to finish (may take 2–5 minutes).
7. Copy your service URL (e.g. `https://lms-backend-xxxx.onrender.com`).

### Step 3: Configure Vercel

1. Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Key:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** Your Render backend URL (e.g. `https://lms-backend-xxxx.onrender.com`)
3. **Redeploy** the frontend (Deployments → ⋮ → Redeploy).

### Step 4: Test

- Visit `https://lms-project-q44b.vercel.app/subjects` — courses should load.
- Login with `demo@lms.com` / `password123`.

**Note:** Render free tier spins down after 15 min of inactivity. The first request after that may take 30–60 seconds to wake up.

---

## 6. Local development

- **Backend:** `cd backend && npm run dev` (uses SQLite via `DATABASE_URL="file:./dev.db"`).
- **Frontend:** `cd frontend && npm run dev` (uses `NEXT_PUBLIC_API_BASE_URL` or `http://localhost:4000`).
