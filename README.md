# LMS - Learning Management System

A professional video-based learning platform built with Next.js, Express, and MySQL.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Zustand
- **Backend:** Node.js + Express + TypeScript
- **Database:** MySQL (Prisma ORM)

## Features

- User authentication (JWT + refresh tokens in HTTP-only cookies)
- Subject/course browsing with search
- YouTube video embedding with progress tracking
- Strict sequential video unlocking (complete previous to unlock next)
- Resume playback from last position
- Auto-advance to next video on completion
- Profile page with course progress

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL database (local or Aiven)

### Setup

1. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment:**
   - Edit `backend/.env` with your MySQL URL and JWT secrets
   - Edit `frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

3. **Create database and run migrations:**
   ```bash
   cd backend
   npx prisma db push
   npm run db:seed
   ```

4. **Start development:**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

**Demo login:** demo@lms.com / password123 (after running seed)

## Project Structure

```
LMS_project/
├── backend/
│   ├── prisma/       # Schema & seed
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/   # auth, subjects, videos, progress, health
│       └── utils/
├── frontend/
│   ├── app/          # Next.js App Router pages
│   ├── components/
│   ├── lib/          # API client, progress helpers
│   └── store/        # Zustand stores
└── README.md
```
