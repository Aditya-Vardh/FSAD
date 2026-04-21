# Exercise-12: Full-Stack Student Management (React + Spring Boot)

## Backend Setup

1. Create MySQL database: `CREATE DATABASE hibernatedb;`
2. Update `backend/src/main/resources/application.properties` with your MySQL credentials
3. Run `StudentManagementSystemApplication.java` (port 8085)

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints (Postman)
| Method | URL |
|--------|-----|
| POST   | http://localhost:8085/students |
| GET    | http://localhost:8085/students |
| PUT    | http://localhost:8085/students/{id} |
| DELETE | http://localhost:8085/students/{id} |
