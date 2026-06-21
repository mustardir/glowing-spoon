# Fortress Fund - Development Setup Guide

## 📋 Prerequisites

Before starting development, ensure you have:

- **Node.js** 18.17+ and npm/yarn
- **PostgreSQL** 13+ (or Neon PostgreSQL account)
- **Git**
- **VS Code** (recommended)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mustardir/glowing-spoon.git
cd glowing-spoon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# PostgreSQL Database (Neon)
DATABASE_URL=postgresql://user:password@host:5432/fortress_fund

# NextAuth Configuration
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://localhost:3000

# Anthropic API for Claude
ANTHROPIC_API_KEY=sk-ant-...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set Up Database

```bash
# Create database schema
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Development Workflow

### Project Structure

```
fortress-fund/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── portfolio/         # Portfolio management
│   ├── ai-assistant/      # AI chat interface
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── portfolio/        # Portfolio-specific components
├── lib/                   # Shared utilities and helpers
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── ai.ts             # Claude API integration
│   ├── validators.ts     # Zod schemas
│   └── api-utils.ts      # API helpers
├── prisma/               # Database schema
│   └── schema.prisma
├── public/               # Static assets
├── styles/               # Global styles
└── middleware.ts         # Route protection
```

### Key Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database
npm run db:studio       # Open Prisma Studio

# Testing
npm test                # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:e2e        # Run E2E tests

# Linting & Building
npm run lint            # Run ESLint
npm run build           # Build for production
npm start               # Start production server
```

---

## 🧪 Testing

### Unit Tests

Tests are located next to source files with `.test.ts` extension.

```bash
npm test                # Run all tests
npm run test:ui         # Visual test dashboard
```

### E2E Tests

Playwright tests are in `/e2e` directory.

```bash
npm run test:e2e        # Run Playwright tests
```

---

## 📚 Architecture & Patterns

### Authentication Flow

1. User registers/logs in via `/app/(auth)/login`
2. NextAuth validates credentials against database
3. JWT token is issued and stored in session
4. Middleware protects routes by checking session
5. API routes verify session before processing

### API Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error message"
}
```

### Database Access

Always use the Prisma client singleton from `lib/db.ts`:

```typescript
import { db } from "@/lib/db";

const users = await db.user.findMany({
  where: { role: "ADMIN" },
  select: { id: true, email: true },
});
```

### Validation

Use Zod schemas from `lib/validators.ts` for all inputs:

```typescript
import { loginSchema } from "@/lib/validators";

const validated = loginSchema.parse(body);
```

---

## 🤖 AI Integration

### Using Claude API

The AI assistant uses Claude 3.5 Sonnet via `lib/ai.ts`:

```typescript
import { sendAiMessage } from "@/lib/ai";

const response = await sendAiMessage(userId, conversationId, userMessage);
```

### System Prompt

The AI is configured as a financial advisor with portfolio context. Messages are summarized before sending to avoid exposing raw user data.

---

## 🔐 Security Practices

1. **Passwords**: Hashed with bcrypt (12 rounds)
2. **Secrets**: All in environment variables, never hardcoded
3. **Validation**: Zod validates all inputs server-side
4. **Auth**: JWT tokens with expiry
5. **Routes**: Middleware protects sensitive pages
6. **API**: Session verification on every request

---

## 🐛 Debugging

### VS Code Extensions

Recommended:
- ESLint
- Prettier
- Prisma
- Thunder Client (API testing)

### Enable Debug Logs

```bash
export DEBUG=prisma:*
npm run dev
```

### Check Database

```bash
npx prisma studio   # Visual database browser
```

---

## 🚢 Deployment

### Environment Variables for Production

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<secure random value>
NEXTAUTH_URL=https://yourdomain.com
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=production
```

### Build & Deploy

```bash
npm run build        # Build for production
npm start            # Start production server
```

For VPS deployment, use PM2, Docker, or your preferred hosting solution.

---

## 📖 Contributing

1. Create a branch for your feature
2. Follow the coding conventions in `copilot-instructions.md`
3. Write tests for new utilities
4. Ensure ESLint passes: `npm run lint`
5. Submit a PR with a clear description

---

## 🤝 Support & Community

For questions or issues:
- Check the README.md for project overview
- Review copilot-instructions.md for coding standards
- Open an issue on GitHub

---

## 📝 License

© 2026 Fortress Fund. All rights reserved.
