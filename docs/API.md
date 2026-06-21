# Fortress Fund API Documentation

## Overview

Fortress Fund provides a RESTful API for portfolio management, transactions, and AI-powered financial insights. All endpoints require authentication via JWT tokens provided by NextAuth.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API requests (except `/auth/register` and `/auth/login`) require a valid session. The session is maintained via NextAuth cookies.

## Response Format

All responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Auth Required:** No
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }
  ```
- **Response:** User object with id, email, name, createdAt

---

### Portfolio

#### Get All Portfolios
- **GET** `/portfolio`
- **Auth Required:** Yes
- **Response:** Array of portfolio objects

#### Create Portfolio
- **POST** `/portfolio`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "My Investment Portfolio",
    "description": "Long-term growth strategy"
  }
  ```
- **Response:** Portfolio object

#### Get Portfolio Details
- **GET** `/portfolio/{portfolioId}`
- **Auth Required:** Yes
- **Response:** Portfolio object with assets and recent transactions

#### Update Portfolio
- **PATCH** `/portfolio/{portfolioId}`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "Updated Portfolio Name",
    "description": "Updated description"
  }
  ```
- **Response:** Updated portfolio object

#### Delete Portfolio
- **DELETE** `/portfolio/{portfolioId}`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Portfolio deleted"
    }
  }
  ```

---

### Transactions

#### Get Transactions
- **GET** `/transactions?portfolioId={portfolioId}`
- **Auth Required:** Yes
- **Query Parameters:**
  - `portfolioId` (optional): Filter by portfolio
- **Response:** Array of transaction objects

#### Create Transaction
- **POST** `/transactions`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "portfolioId": "portfolio-uuid",
    "type": "BUY",
    "assetId": "asset-uuid",
    "quantity": 10,
    "price": 150.50,
    "amount": 1505,
    "fees": 0,
    "notes": "Quarterly investment"
  }
  ```
- **Transaction Types:** `BUY`, `SELL`, `DEPOSIT`, `WITHDRAWAL`, `DIVIDEND`, `INTEREST`, `FEE`
- **Response:** Created transaction object

---

### AI Conversations

#### Get Conversations
- **GET** `/ai-conversations`
- **Auth Required:** Yes
- **Response:** Array of conversation objects

#### Create Conversation
- **POST** `/ai-conversations`
- **Auth Required:** Yes
- **Response:** New conversation object

#### Get Messages
- **GET** `/ai-conversations/{conversationId}/messages`
- **Auth Required:** Yes
- **Response:** Array of message objects

#### Send Message
- **POST** `/ai-conversations/{conversationId}/messages`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "content": "Tell me about my portfolio performance"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "response": "AI response text here..."
    }
  }
  ```

---

### User Profile

#### Get Profile
- **GET** `/user/profile`
- **Auth Required:** Yes
- **Response:** User profile object

#### Update Profile
- **PATCH** `/user/profile`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "bio": "Investor and tech enthusiast",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Response:** Updated user profile object

---

### Admin

#### Get All Users
- **GET** `/admin/users`
- **Auth Required:** Yes
- **Admin Required:** Yes
- **Response:** Array of user objects with statistics

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200    | Success |
| 201    | Created |
| 400    | Bad Request (validation error) |
| 401    | Unauthorized (not authenticated) |
| 403    | Forbidden (insufficient permissions) |
| 404    | Not Found |
| 500    | Internal Server Error |

## Rate Limiting

Not currently implemented but planned for production.

## Pagination

Not currently implemented but planned for endpoints with large datasets.

## Webhooks

Not currently implemented but planned for future releases.

---

## Example Usage

### Create Portfolio and Add Transaction

```bash
# Create portfolio
curl -X POST http://localhost:3000/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{"name":"My Portfolio","description":"Personal investments"}'

# Get portfolio ID from response, then create transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioId":"<portfolio-id>",
    "type":"DEPOSIT",
    "amount":5000
  }'
```

### Chat with AI Assistant

```bash
# Create conversation
curl -X POST http://localhost:3000/api/ai-conversations

# Send message
curl -X POST http://localhost:3000/api/ai-conversations/<conv-id>/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"What is my portfolio allocation?"}'
```

---

## SDK & Client Libraries

### JavaScript/TypeScript

```typescript
import fetch from "node-fetch";

const api = {
  async getPortfolios() {
    const res = await fetch("/api/portfolio");
    return res.json();
  },

  async createPortfolio(name: string, description?: string) {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    return res.json();
  },
};
```

---

## Troubleshooting

### 401 Unauthorized
- Ensure you have an active session
- Clear cookies and re-authenticate
- Check `NEXTAUTH_SECRET` is set correctly

### 403 Forbidden
- User does not have required permissions
- Admin endpoints require `role === "ADMIN"`

### Validation Errors
- Check request body matches schema
- All required fields must be provided
- Email format must be valid
- Amounts must be positive numbers

---

## Support

For API issues or questions:
- Check the SETUP.md guide
- Review the copilot-instructions.md for conventions
- Open an issue on GitHub
