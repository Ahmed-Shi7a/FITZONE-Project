# FITZONE - Authentication & Authorization Module

Backend authentication and authorization system built with Node.js, Express, MongoDB, and JSON Web Tokens (JWT).

## Features
- User Registration with Password Hashing (`bcryptjs`).
- Secure Login & JWT Token Generation.
- Role-based Access Control (`admin` vs `member`).
- Protected Routes via Authentication Middleware.

## User Roles
- **Admin:** Has elevated access to system-wide data (e.g., fetch all registered users).
- **Member:** Regular access, restricted from admin-only routes.

## API Endpoints
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User authentication & token issuance
- `GET /api/v1/users/me` - Fetch logged-in user profile (Protected Route)
- `GET /api/v1/users` - Fetch all users (Admin Access Only)

## Project Testing & Screenshots
All testing scenarios and API response captures are documented inside the `./screenshots` directory.

## How to Run Locally
1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install