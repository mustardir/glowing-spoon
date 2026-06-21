# Contributing to Fortress Fund

Thank you for your interest in contributing to Fortress Fund! This document provides guidelines and instructions for contributing to the project.

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others succeed
- Report issues responsibly

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/glowing-spoon.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Follow the setup instructions in [SETUP.md](./SETUP.md)

---

## Development Guidelines

### Code Quality

- **TypeScript**: Use strict mode, no `any` types
- **Linting**: Code must pass ESLint
- **Formatting**: Use Prettier for consistent formatting
- **Comments**: Add JSDoc comments to all functions

```typescript
/**
 * Calculate portfolio performance metrics
 * @param portfolio - The portfolio to analyze
 * @returns Object containing ROI, gains, and loss percentage
 */
export function calculateMetrics(portfolio: Portfolio): Metrics {
  // implementation
}
```

### Naming Conventions

- **Files**: Use kebab-case for filenames (`my-component.tsx`)
- **Components**: Use PascalCase (`MyComponent`)
- **Functions**: Use camelCase (`myFunction`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_PORTFOLIO_SIZE`)
- **Types/Interfaces**: Use PascalCase (`UserProfile`)

### Component Structure

```typescript
"use client"; // Add if using client-side features

import { ReactNode } from "react";

interface MyComponentProps {
  title: string;
  children: ReactNode;
}

/**
 * My component description
 */
export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default MyComponent;
```

---

## Testing

### Writing Tests

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./my-module";

describe("myFunction", () => {
  it("should return the correct value", () => {
    const result = myFunction(5);
    expect(result).toBe(10);
  });

  it("should handle edge cases", () => {
    const result = myFunction(0);
    expect(result).toBe(0);
  });
});
```

### Running Tests

```bash
npm test                # Run all tests
npm test -- src/lib    # Run specific directory
npm run test:ui        # Visual dashboard
```

### Coverage Requirements

- Aim for >80% coverage
- All utility functions must have tests
- API routes should be tested

---

## Git Workflow

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(portfolio): add portfolio performance charts
fix(auth): correct session timeout issue
docs(api): update API documentation
```

### Pull Request Process

1. Update [CHANGELOG.md](./docs/CHANGELOG.md) with your changes
2. Ensure all tests pass: `npm test`
3. Ensure ESLint passes: `npm run lint`
4. Provide a clear description of changes
5. Link related issues: `Closes #123`

---

## Database Changes

### Creating a Migration

```bash
# After updating prisma/schema.prisma
npx prisma migrate dev --name add_new_feature
```

### Reviewing Schema Changes

- New columns should have sensible defaults
- Consider backward compatibility
- Add database indexes for frequently queried fields
- Document breaking changes

---

## API Endpoint Development

### Structure

```typescript
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mySchema } from "@/lib/validators";
import { withErrorHandling } from "@/lib/api-utils";

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const body = await request.json();
    const validated = mySchema.parse(body);

    // Business logic
    const result = await db.model.create({
      data: validated,
    });

    return result;
  }, 201);
}
```

### Validation

```typescript
import { z } from "zod";

export const mySchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  description: z.string().max(500).optional(),
});
```

---

## UI Component Development

### Design System

- **Colors**: Follow Tailwind slate palette
- **Accent**: Emerald for primary actions
- **Danger**: Red for destructive actions
- **Spacing**: Use Tailwind spacing scale
- **Typography**: Use base size of 16px

### Creating Components

```typescript
"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  // Implementation
}
```

---

## Performance Considerations

### API Optimization

- Always use `select` in Prisma queries
- Limit returned fields in API responses
- Implement pagination for large datasets
- Use database indexes

### Frontend Optimization

- Use `"use client"` only when necessary
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use React.memo for expensive components

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
});
```

---

## Security Practices

- Never hardcode secrets
- Always validate and sanitize user input
- Use HTTPS in production
- Implement CSRF protection
- Regular security audits
- Keep dependencies updated

---

## Documentation

Update documentation when:

- Adding new features
- Changing API endpoints
- Updating architecture
- Modifying deployment process

---

## Areas for Contribution

### High Priority

- [ ] Implement data export (CSV, PDF)
- [ ] Add investment goal tracking
- [ ] Create portfolio alerts/notifications
- [ ] Add two-factor authentication

### Medium Priority

- [ ] Enhanced portfolio analytics
- [ ] Mobile app (React Native)
- [ ] Real-time price updates
- [ ] Social features

### Community Contributions Welcome

- Bug fixes
- Documentation improvements
- Performance optimizations
- UI/UX improvements
- Testing additions

---

## Troubleshooting

### Common Issues

**ESLint errors:**
```bash
npm run lint -- --fix
```

**Type errors:**
```bash
npm run build
```

**Database issues:**
```bash
npx prisma migrate reset
npx prisma studio
```

---

## Getting Help

- Check [SETUP.md](./SETUP.md) for setup help
- Review [docs/API.md](./docs/API.md) for API details
- Open an issue with a clear description
- Join our community discussions

---

## Review Process

- At least one approval required
- All checks must pass
- Tests must have >80% coverage
- No merge conflicts
- Documentation updated

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Thanked in release notes
- Listed on project website

---

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Thank you for making Fortress Fund better! 🚀
