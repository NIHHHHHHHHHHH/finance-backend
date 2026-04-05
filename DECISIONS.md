# Architecture Decisions & Tradeoffs

## 1. Why Node.js + Express?
Node.js is lightweight and efficient for REST APIs. Express is minimal and flexible, allowing clean structure without unnecessary overhead.

## 2. Why MongoDB + Mongoose?
Financial records are document-oriented by nature. MongoDB provides flexibility in schema design. Mongoose adds structure, validation, and middleware support on top of MongoDB.

## 3. Why JWT over Sessions?
JWT is stateless - no server-side session storage needed. This makes the API easily scalable and suitable for deployment across multiple servers.

## 4. Why Soft Delete instead of Hard Delete?
Financial records should never be permanently deleted for audit and compliance purposes. Soft delete keeps records in the database with an `isDeleted` flag while hiding them from API responses.

## 5. Why Role-Based Access Control?
Different users have different responsibilities. Viewers only need to see data, Analysts need insights, Admins need full control. RBAC ensures each role only accesses what they need.

## 6. Why Mongoose Pre-find Hook for Soft Delete?
Instead of manually adding `isDeleted: false` to every query, the pre-find hook automatically handles it at the model level. This prevents accidental exposure of deleted records.

## 7. Why Rate Limiting on Auth Routes only?
Auth routes are most vulnerable to brute force attacks. Transaction and dashboard routes are already protected by JWT so rate limiting there would add unnecessary overhead.

## 8. What would I do differently at scale?
- Add a services layer to separate business logic from controllers
- Use Redis for caching dashboard analytics
- Add refresh tokens for better JWT security
- Add proper logging with Winston or Morgan
- Write unit and integration tests