# CCNA Backend

Minimal Express + Sequelize backend for the CCNA React app.

Setup

1. Copy `.env.example` to `.env` and adjust values (DB credentials, JWT secret).
2. From `backend` folder run:

```bash
npm install
npm run start
```

This server will auto-sync models to the MySQL database named in `DB_NAME` (default `ccnaportal`).

API highlights
- `POST /admin/register` — register an admin (one-time)
- `POST /admin/login` — login to get JWT
- `POST /admin/students` — create students (admin-protected)
- `POST /admin/quizzes` — create a quiz
- `POST /admin/quizzes/:quizId/questions` — add questions
- `POST /students/:id/submissions` — student submit answers and files (multipart/form-data; files field name `files`)
- `GET /admin/submissions` — admin view submissions
