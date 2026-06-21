# Fortress Fund

> AI-powered investment and wealth management platform — secure, transparent, and built for modern investors.

---

## 🧭 Project Overview

Fortress Fund is a premium fintech web platform that allows users to create accounts, manage investment portfolios, track performance in real time, and receive AI-driven financial insights — all within an enterprise-grade secure environment.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Next.js API Routes |
| Database | PostgreSQL via Neon Database |
| Auth | JWT, secure session management |
| AI | Claude API (financial assistant) |
| Hosting | VPS + SSL/TLS, DNS-connected domain |
| Source Control | GitHub |

---

## 📁 Repository Structure

```
fortress-fund/
├── app/                    # Next.js app directory
│   ├── (auth)/             # Login, register pages
│   ├── dashboard/          # User dashboard
│   ├── portfolio/          # Portfolio management
│   ├── ai-assistant/       # AI chat interface
│   └── admin/              # Admin panel
├── components/             # Reusable UI components
│   ├── ui/                 # Base components (buttons, cards, inputs)
│   ├── charts/             # Portfolio charts and analytics
│   └── layout/             # Header, sidebar, footer
├── lib/                    # Shared utilities and helpers
│   ├── db.ts               # Neon PostgreSQL client
│   ├── auth.ts             # Auth helpers
│   └── ai.ts               # AI integration helpers
├── api/                    # API route handlers
│   ├── auth/               # Auth endpoints
│   ├── portfolio/          # Portfolio endpoints
│   ├── transactions/       # Transaction endpoints
│   └── admin/              # Admin endpoints
├── prisma/                 # Database schema and migrations
│   └── schema.prisma
├── public/                 # Static assets
├── styles/                 # Global styles
├── .env.example            # Required environment variables
└── docs/                   # Architecture and API documentation
```

---

## ✨ Core Features

### 🔐 User Authentication
- User registration and secure login
- JWT-based session management
- Password hashing with bcrypt
- Protected routes and middleware

### 📊 Dashboard
- Investment portfolio overview
- Real-time performance tracking and charts
- Account statistics (total value, gains/losses, ROI)
- Full transaction history

### 🤖 AI Assistant
- Natural language chat interface
- AI-powered financial guidance and portfolio insights
- Investment recommendations based on user data
- Powered by Claude API

### 🛡 Admin Panel
- User management (view, suspend, delete)
- Investment and transaction management
- Platform analytics dashboard
- System health monitoring

---

## 🗄 Database Schema

Key tables:
- `users` — accounts, profiles, auth credentials
- `portfolios` — user investment portfolios
- `assets` — individual investments within portfolios
- `transactions` — buy/sell/deposit/withdrawal history
- `ai_conversations` — chat history per user
- `admin_logs` — audit trail for admin actions

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📋 Feature Checklist

### Phase 1 — Foundation
- [ ] Project scaffold (Next.js + TypeScript + Tailwind)
- [ ] Database setup (Neon PostgreSQL + Prisma)
- [ ] User registration and login
- [ ] JWT session management
- [ ] Basic dashboard layout

### Phase 2 — Core Product
- [ ] Portfolio creation and management
- [ ] Asset tracking and performance charts
- [ ] Transaction history
- [ ] User profile and settings

### Phase 3 — AI & Admin
- [ ] AI assistant chat interface
- [ ] Claude API integration
- [ ] Admin user management panel
- [ ] Admin analytics dashboard

### Phase 4 — Production
- [ ] VPS deployment scripts
- [ ] SSL/TLS configuration
- [ ] Domain and DNS setup
- [ ] Performance optimization
- [ ] Security audit

---

## 🔒 Security

- All passwords hashed with bcrypt
- JWT tokens with expiry and refresh
- Environment variables for all secrets — never hardcoded
- HTTPS enforced in production
- Input validation on all API routes
- Role-based access control (user vs admin)

---

## 🧠 Development Notes for Copilot

- Use TypeScript strictly — no `any` types
- All components are functional with React hooks
- API routes live in `app/api/` using Next.js Route Handlers
- Database access always goes through `lib/db.ts`
- Auth checks use middleware in `middleware.ts`
- Tailwind only for styling — no inline styles
- Every function must have JSDoc comments
- Write unit tests for all utility functions in `lib/`

---

## 📌 Vision

Fortress Fund aims to become a trusted digital investment platform — combining modern financial tools, AI-driven insights, and enterprise-grade security to help users grow and manage their wealth with confidence.
