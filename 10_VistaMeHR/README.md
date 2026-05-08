# HireFlow — AI-Powered HR Assistant

A full-stack HR Assistant web application built with React + Vite, Supabase, and AI-powered candidate scoring.

## ✨ Features

- 🔐 **Auth** — Supabase email/password authentication
- 📊 **Dashboard** — Stats, active jobs, recent submissions
- 🧾 **Form Builder** — Drag-and-drop custom application form builder
- 🔗 **Shareable Links** — Public application URLs (no login for applicants)
- 🤖 **AI Resume Scoring** — Claude AI ranks and categorizes candidates
- 📑 **Candidate Management** — Table view, filters, status tracking, notes
- 📅 **Interview Scheduler** — Calendar UI with time slot assignment
- 📧 **Email Automation** — Confirmation emails via Resend API
- 📤 **CSV Export** — Export candidates with all scoring data
- 📋 **Job Templates** — Duplicate job forms instantly

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-anthropic-api-key
VITE_EMAIL_API_KEY=your-resend-api-key
VITE_EMAIL_FROM=noreply@yourdomain.com
```

> **Note:** The app works in demo mode without any environment variables — all data is stored in localStorage.

### 3. Set up Supabase (optional)
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in your SQL editor
3. Create a `resumes` storage bucket (public)

### 4. Start development server
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── supabase.js      # Supabase client + auth helpers
│   ├── db.js            # Data access layer (Supabase or mock)
│   ├── mockStore.js     # localStorage-based demo store
│   ├── ai.js            # AI scoring engine (Claude API)
│   └── email.js         # Email service (Resend API)
├── contexts/
│   └── AuthContext.jsx  # Auth state management
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── FormsPage.jsx
│   ├── FormBuilderPage.jsx
│   ├── CandidatesPage.jsx
│   ├── SchedulerPage.jsx
│   └── PublicFormPage.jsx
└── components/
    └── Layout.jsx       # Sidebar navigation
```

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | For production |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | For production |
| `VITE_OPENAI_API_KEY` | Anthropic API key for AI scoring | For AI features |
| `VITE_EMAIL_API_KEY` | Resend API key for emails | For email sending |
| `VITE_EMAIL_FROM` | Sender email address | For email sending |

## 🤖 AI Scoring

The AI scoring engine uses Claude to analyze candidates against job descriptions:

- **Score**: 0-100 integer
- **Category**: Highly Relevant / Medium / Not Relevant
- **Recommendation**: Shortlist / Review / Reject
- **Strengths & Gaps**: Bullet-pointed assessment
- **Summary**: 2-3 sentence professional evaluation

Falls back to keyword matching if the AI API is unavailable.

## 📧 Email Service

Uses [Resend](https://resend.com) for sending emails. In development mode (no API key), emails are logged to the console.

Customize the email template per-interview in the scheduler modal.

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + CSS variables |
| Backend | Supabase (DB + Auth + Storage) |
| AI | Claude claude-sonnet-4-20250514 |
| Email | Resend API |
| CSV | PapaParse |
| Calendar | date-fns |
| Routing | React Router v6 |

## 🏭 Production Build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.
