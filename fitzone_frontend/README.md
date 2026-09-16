# FITZONE — Gym & Fitness Management System

A frontend-only Angular 18 (standalone components + Signals) demo of a gym
management system with role-based UI (Admin vs Member), built with a
"Dark Neon Athletic" visual identity. No backend — all data is mock data
held in Angular signals and persisted to `localStorage`.

## Run it locally

Requires Node.js 18+ and internet access (to install packages).

```bash
npm install
npm start
```

This opens the app at `http://localhost:4200`.

## Demo accounts

| Role   | Email               | Password   |
|--------|----------------------|------------|
| Admin  | admin@fitzone.com    | admin123   |
| Member | member@fitzone.com   | member123  |

Or use "Use demo credentials" on the sign-in screen, or create a new
account via Sign Up (toggle Admin/Member).

## Routes

- `/home` — landing page (plans, trainers, CTA)
- `/signin`, `/signup` — split-screen auth with role toggle
- `/member-dashboard` — active plan, bookings, timetable (member-only, guarded)
- `/admin-dashboard` — KPIs + CRUD tables for members/plans/trainers/classes (admin-only, guarded)
- `/item-details/:id` — detail view for a plan, trainer, or class id

## Notes

- All CRUD and bookings persist in `localStorage`, so state survives refresh.
- Sign-out clears the current session but not the underlying mock data.
- To reset all data, clear your browser's localStorage for this site.
