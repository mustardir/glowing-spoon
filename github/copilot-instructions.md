# Copilot Instructions — Fortress Fund

You are building **Fortress Fund**, a premium AI-powered investment and wealth management platform. Follow these instructions precisely for every file you generate.

---

## 🧱 Project Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode — no `any` types ever)
- **Styling:** Tailwind CSS only — no inline styles, no CSS modules
- **Database:** PostgreSQL via Neon, accessed through Prisma ORM
- **Auth:** NextAuth.js with JWT strategy
- **AI:** Anthropic Claude API via `@anthropic-ai/sdk`
- **Validation:** Zod for all inputs and API responses

---

## 📁 File & Folder Rules

- All pages go in `app/` using Next.js App Router conventions
- All reusable UI components go in `components/ui/`
- All feature components go in `components/` subdirectories (e.g. `components/portfolio/`)
- All shared logic, helpers, and clients go in `lib/`
- All Prisma models and migrations go in `prisma/`
- API route handlers go in `app/api/` as `route.ts` files
- Never put business logic inside page components — extract to `lib/`

---

## ✍️ Coding Conventions

- Use **functional components** with React hooks — never class components
- Use **async/await** — never `.then()` or callbacks
- Use **named exports** for components, **default exports** for pages
- All functions must have **JSDoc comments** explaining what they do
- Use **Zod schemas** to validate all incoming API request bodies
- Use **try/catch** blocks in every API route and async function
- Return consistent API responses: `{ success: true, data: ... }` or `{ success: false, error: "..." }`
- Never hardcode secrets — always use `process.env.VARIABLE_NAME`

---

## 🎨 UI & Design Rules

- The design must feel **premium, modern, and trustworthy** — think Bloomberg, Robinhood Pro
- Use a **dark theme** as the default (dark navy/slate backgrounds)
- Accent color: **emerald green** (`emerald-500`) for positive values and CTAs
- Danger/loss color: **red** (`red-500`) for negative values
- Use **shadcn/ui** component patterns for all UI elements
- All pages must be **fully responsive** — mobile first
- Use **Framer Motion** for subtle animations and transitions
- Charts use **Recharts** library

---

## 🔐 Auth & Security Rules

- Every protected API route must verify the session using `getServerSession()`
- Every protected page must use middleware or `redirect()` if unauthenticated
- Admin routes must check `user.role === "ADMIN"` before proceeding
- Hash all passwords with `bcrypt` (salt rounds: 12)
- Never return password hashes in API responses
- Sanitize and validate all user inputs with Zod before touching the database

---

## 🗄 Database Rules

- Always access the database through `lib/db.ts` (the Prisma client singleton)
- Never instantiate `PrismaClient` directly in a route or component
- Use Prisma transactions for any operation that touches multiple tables
- Always select only the fields you need — never use `findMany()` without `select`
- Use `try/catch` around every database call

---

## 🤖 AI Assistant Rules

- The AI assistant uses the Anthropic Claude API via `lib/ai.ts`
- Always include a system prompt that establishes Claude as a financial assistant
- Never send raw user portfolio data to the AI — summarize it first
- Store conversation history in the `ai_conversations` table
- Stream responses using the Anthropic streaming API for better UX

---

## 🧪 Testing Rules

- Write unit tests for every function in `lib/`
- Use **Vitest** for unit tests
- Use **Playwright** for end-to-end tests
- Test files live next to their source file: `lib/auth.test.ts`
- Always test the happy path AND error/edge cases

---

## 🚫 Never Do These

- Never use `any` TypeScript type
- Never use inline styles
- Never hardcode API keys, secrets, or database URLs
- Never put database queries directly in page components
- Never skip input validation on API routes
- Never return sensitive user data (passwords, tokens) in API responses
- Never use `console.log` in production code — use a proper logger

---

## 📦 Key Dependencies

```json
{
  "next": "^14",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3",
  "prisma": "^5",
  "@prisma/client": "^5",
  "next-auth": "^4",
  "zod": "^3",
  "@anthropic-ai/sdk": "latest",
  "bcrypt": "^5",
  "recharts": "^2",
  "framer-motion": "^11",
  "vitest": "^1",
  "@playwright/test": "^1"
}
```

---

## 🏁 When Asked to Scaffold

When scaffolding the project, always generate in this order:
1. `prisma/schema.prisma` — full database schema
2. `lib/db.ts` — Prisma client singleton
3. `lib/auth.ts` — NextAuth config and helpers
4. `middleware.ts` — route protection
5. `app/layout.tsx` — root layout with providers
6. `app/(auth)/login/page.tsx` and `register/page.tsx`
7. `app/dashboard/page.tsx` — main dashboard
8. `app/api/` — all API routes
9. `components/` — all UI components
10. Tests last

