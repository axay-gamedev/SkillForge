# SkillForge

## AI Skill-Gap & Personalized Learning Agent

**Problem Statement 05 — Education & Employability**

SkillForge is an AI-powered career guidance platform that converts a student's current profile into a measurable, personalized, and trackable learning roadmap.

Students often know the role they want, but do not know which skills they lack, what projects can demonstrate those skills, or how to prioritize their learning. SkillForge addresses this gap by analyzing a student's profile against their target role and generating an actionable learning plan.

---

## What SkillForge Does

The platform takes information such as:

- Education
- Target career role
- Current technical skills
- Projects and experience
- Career goals

and uses AI to generate:

- **Career Readiness Score** — a high-level measure of current preparation.
- **Skill Analysis** — estimated proficiency levels and development status for relevant skills.
- **Skill Gaps** — areas that need improvement for the selected target role.
- **Personalized Roadmap** — an ordered learning plan broken into milestones/weeks.
- **Progress Tracking** — users can mark roadmap milestones as completed.
- **Persistent Dashboard** — profile, analysis, and roadmap progress are stored per user.

---

## Core User Flow

```text
Sign Up / Sign In
        ↓
Create Profile
        ↓
Select Target Role
        ↓
AI Skill-Gap Analysis
        ↓
Career Readiness + Skill Analysis
        ↓
Personalized Learning Roadmap
        ↓
Dashboard
        ↓
Track Completed Roadmap Items
```

Existing users are taken directly to their dashboard after signing in, while new users complete their profile first.

---

## Features

### 1. Personalized Profile

Users can maintain information about their education, skills, projects, goals, and target role.

### 2. AI Career Analysis

The backend sends the student's profile to the Gemini API and requests structured analysis containing career readiness, strengths, skill gaps, skill levels, estimated learning time, and a roadmap.

### 3. Career Readiness

The dashboard displays a career-readiness percentage based on the generated analysis.

### 4. Skill Analysis

Relevant skills are displayed with proficiency percentages and development status.

### 5. Personalized Learning Roadmap

The roadmap provides learning milestones with a week, title, description, and status.

### 6. Roadmap Completion Tracking

Users can tick roadmap items as they complete them. Completion percentage is calculated from the roadmap and persisted in Firestore.

### 7. Firebase Authentication

Authentication is handled through Firebase Authentication, with user-specific data stored using the authenticated user's UID.

### 8. Firestore Persistence

Profile, AI analysis, and dashboard progress are stored in Firestore so users can return to their saved data.

### 9. Responsive UI

The frontend is built with React and custom CSS and includes responsive layouts for the profile and dashboard experience.

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Lucide React
- React Icons
- Custom CSS
- OGL / React Bits Gradient Waves

### Backend

- Node.js
- Express
- CORS
- dotenv
- Google GenAI SDK

### AI

- Google Gemini API
- Structured JSON responses for predictable dashboard data
- Temporary-error retry and model fallback handling

### Database & Authentication

- Firebase Authentication
- Firebase Firestore

### Deployment

- Vercel for frontend/backend deployment

---

## Project Structure

```text
SkillForge/
│
├── backend/
│   ├── routes/
│   │   ├── analysis.js
│   │   └── skills.js
│   ├── services/
│   │   └── gemini.js
│   ├── package.json
│   └── server.js
│
├── public/
│
├── src/
│   ├── Components/
│   ├── Firebase/
│   ├── Pages/
│   ├── Styles/
│   └── ...
│
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- A Firebase project
- A Gemini API key

### Clone the repository

```bash
git clone https://github.com/axay-gamedev/SkillForge.git
cd SkillForge
```

### Install frontend dependencies

```bash
npm install
```

### Install backend dependencies

```bash
cd backend
npm install
cd ..
```

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

**Never commit `backend/.env` or expose `GEMINI_API_KEY` in the frontend.**

### Frontend

For local development, the frontend API URL can be configured with:

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to the deployed backend URL.

---

## Run Locally

### Start the backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

### Start the frontend

In another terminal:

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

## API Overview

### Health Check

```http
GET /api/health
```

Returns:

```json
{
  "status": "ok"
}
```

### Profile Analysis

```http
POST /api/analyze
```

The endpoint accepts the student's profile and returns structured AI-generated analysis used by the dashboard.

### Skills

The backend also exposes the skills route:

```text
/api/skills
```

---

## Firestore Data Model

User data is associated with the Firebase Authentication UID.

Conceptually:

```text
users/{uid}
    ├── profile
    ├── analysis
    └── dashboard
          └── completedRoadmap
```

The roadmap completion array allows dashboard progress to persist across refreshes and future sessions.

---

## Gemini Response

SkillForge requests structured analysis containing fields such as:

```json
{
  "careerReadiness": 0,
  "summary": "...",
  "strengths": [],
  "skillGaps": [],
  "skillAnalysis": [],
  "estimatedWeeks": 0,
  "roadmap": []
}
```

The backend validates and normalizes the returned structure before sending it to the frontend.

Temporary Gemini availability and rate-limit errors are handled with short retries and model fallback attempts.

---

## Security Notes

- Keep `GEMINI_API_KEY` on the backend only.
- Do not commit `.env` files.
- Firebase Firestore rules should restrict user documents to the authenticated user's UID.
- Production CORS configuration should contain the deployed frontend domain.
- Production frontend API requests should use the deployed backend URL rather than `localhost`.

---

## Deployment

A production deployment can use:

```text
Frontend  → Vercel
Backend   → Vercel
Auth      → Firebase Authentication
Database  → Firebase Firestore
AI        → Google Gemini API
```

For the frontend, configure:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

For the backend, configure the Gemini API key and production client URL through Vercel environment variables rather than committing secrets to the repository.

---

## Roadmap

Potential future improvements include:

- Resume parsing and skill extraction
- GitHub/project analysis
- Role-specific competency benchmarks
- Course and resource recommendations
- AI-generated project suggestions mapped to skill gaps
- Automatic roadmap regeneration based on progress
- Internship and job-readiness signals
- More detailed progress analytics

---

## Problem Statement

> **Education & Employability: AI Skill-Gap & Personalized Learning Agent**
>
> Students often know the role they want but do not know which skills they lack, what projects demonstrate those skills, or how to prioritize learning. Build an AI career agent that converts a student's current profile into a measurable and adaptive roadmap.

---

## Team Project

**SkillForge** was built as a hackathon project around the Education & Employability problem space, with the goal of making career preparation more structured, personalized, and measurable.
