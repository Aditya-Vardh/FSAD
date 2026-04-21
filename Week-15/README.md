# Skill-15: JWT-Based Authentication & Role Authorization

## Setup & Run

Run `JwtAuthDemoApplication.java` (port 8080). Uses in-memory H2 database — no MySQL needed.

Seed data auto-inserted from `data.sql`:
- admin / 123 (ADMIN role)
- employee1 / emp123 (EMPLOYEE role)

## Postman Testing

### Step 1 — Get JWT Token
**POST** `http://localhost:8080/login`
```json
{ "username": "admin", "password": "123" }
```
Copy the returned token.

### Step 2 — Use Token in Secured Endpoints
Add header: `Authorization: Bearer <your_token>`

| Method | URL | Required Role |
|--------|-----|---------------|
| POST   | /admin/add | ADMIN |
| DELETE | /admin/delete | ADMIN |
| GET    | /employee/profile | EMPLOYEE |

### H2 Console
Open http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa` | Password: (blank)
