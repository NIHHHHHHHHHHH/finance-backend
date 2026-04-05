# Finance Dashboard Backend API

A RESTful backend API for a finance dashboard system with role-based access control, JWT authentication, and MongoDB persistence.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Validation:** express-validator
- **Security:** bcryptjs, express-rate-limit

## Project Structure
```
src/
├── config/         # MongoDB connection
├── controllers/    # Request handlers
├── middleware/     # Auth, RBAC, error handler, rate limiter
├── models/         # Mongoose schemas
├── routes/         # API routes
├── utils/          # Validators
├── app.js          # Express app
└── server.js       # Entry point
```

## Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation
```bash
git clone <your-repo-url>
cd finance-backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT secret in .env
npm run dev
```

### Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## Roles & Permissions

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Create transactions | ❌ | ❌ | ✅ |
| Update transactions | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Authenticated | Get current user |

### Transactions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/transactions` | All roles | List transactions |
| GET | `/api/transactions/:id` | All roles | Get single transaction |
| POST | `/api/transactions` | Admin | Create transaction |
| PUT | `/api/transactions/:id` | Admin | Update transaction |
| DELETE | `/api/transactions/:id` | Admin | Soft delete transaction |

### Query Parameters
```
?type=income|expense
?category=Salary
?search=keyword
?startDate=2026-01-01&endDate=2026-12-31
?page=1&limit=20
```

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | All roles | Total income, expenses, balance |
| GET | `/api/dashboard/category-totals` | All roles | Totals by category |
| GET | `/api/dashboard/monthly-trends` | All roles | Monthly trends |
| GET | `/api/dashboard/recent-activity` | All roles | Latest transactions |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update role or status |
| DELETE | `/api/users/:id` | Delete user |

## Error Responses
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 429 | Too many requests |
| 500 | Server error |

## Testing
Import `finance-api.postman_collection.json` into Postman.
Set environment variable `base_url` to `http://localhost:3000`.

