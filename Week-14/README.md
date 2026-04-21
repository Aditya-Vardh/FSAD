# Skill-14: User Authentication & Session Management

## Backend Setup

1. Create MySQL database: `CREATE DATABASE userdb;`
2. Update `backend/src/main/resources/application.properties` if needed
3. Run `UserAuthenticationBackendApplication.java` (port 8080)

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — redirects to `/login`

## Flow
1. Register at `/register`
2. Login at `/login` → saves userId & username to localStorage → redirects to `/home`
3. View profile at `/profile` (fetches from backend)
4. Logout clears localStorage and redirects to `/login`
