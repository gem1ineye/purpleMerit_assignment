# Role-Based User Management System (MERN)

This project implements a full Role-Based Access Control (RBAC) system with:
- Backend: Node.js + Express + MongoDB + Mongoose + JWT + bcrypt
- Frontend: React (Hooks) + Context API + React Router
- Roles: Admin, Manager, User

## Project Structure

- backend/ : API, authentication, RBAC middleware, user management
- frontend/ : UI, auth persistence, protected routes, role-based rendering

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - `cp .env.example .env`
4. Update `.env` with your values:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
5. Run API:
   - `npm run dev`

Backend base URL: `http://localhost:5000/api`

## Frontend Setup

1. Open new terminal and go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - `cp .env.example .env`
4. Run frontend:
   - `npm run dev`

Frontend URL: `http://localhost:5173`

## API Summary

Auth routes:
- `POST /api/auth/login`
- `POST /api/auth/register`

Profile routes (authenticated):
- `GET /api/users/me`
- `PUT /api/users/me` (name/password only)

User management routes:
- `GET /api/users` (Admin, Manager)
- `GET /api/users/:id` (Admin, Manager)
- `POST /api/users` (Admin only)
- `PUT /api/users/:id` (Admin all users, Manager non-admin only)
- `DELETE /api/users/:id` (Admin only, soft delete via status=inactive)

## Security Notes

- Passwords are hashed with bcrypt before save.
- JWT protects private routes.
- Role checks are enforced on API routes.
- Password hashes are removed from all API responses.
- Request validation and sanitization is applied to key routes.

## Behavior Notes

- Managers cannot modify Admin users.
- Managers cannot assign Admin role.
- Users can only update their own name/password via `/users/me`.
- User listing supports pagination, search, and role/status filters.
