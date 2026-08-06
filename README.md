# AdMitra: Scalable Campaign Management & Real-Time Analytics Platform

AdMitra is a enterprise-grade ad-tech backend and analytics dashboard built to simulate production-scale campaign management systems. It provides centralized ad campaign tracking, real-time performance analytics aggregation, budget management, and cached leaderboard metrics.

---

## Live Demo & Documentation

- **Live Interactive Demo:** https://ruchita0131.github.io/AdMITRA/
- **API Documentation (OpenAPI / Swagger):** Available at `/swagger-ui.html` when running locally on port 8080.

---

## Architecture Overview

```
                        React + TypeScript Dashboard
                                     │
                              REST API Gateway
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
   Campaign Service          Analytics Service            User Service
           │                         │                         │
           └────────────────────┬────┴─────────────────────────┘
                                │
                       Spring Boot 3 Backend
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
   PostgreSQL 16           Redis Cache            JWT Authentication
         │
   Docker Compose
```

### System Components

1. **Spring Boot 3 Backend (Java 21):** Implements a layered architecture (Controller, Service, Repository, Entity, DTO). Uses Spring Data JPA for persistence and Spring Security for stateless authentication.
2. **PostgreSQL Database:** Relational store holding transactional entities: `users`, `roles`, `refresh_tokens`, `campaigns`, and `analytics`.
3. **Redis Caching Layer:** Caches aggregate analytical metrics and leaderboards with a 5-minute Time-To-Live (TTL) to minimize database query execution times under heavy traffic.
4. **React + TypeScript Frontend:** Built with Vite, Tailwind CSS, and Recharts. Features automatic 5-second polling for live metric updates.
5. **Docker Compose:** Containerized orchestration bundling PostgreSQL, Redis, Spring Boot, and Nginx.

---

## Key Engineering Decisions

### 1. Redis Caching Strategy
Campaign performance analytics (such as top CTR and aggregate campaign metrics) require expensive SQL queries (`SUM`, `AVG`, `GROUP BY`) across millions of records. AdMitra caches these dashboard summaries in Redis with a 5-minute TTL. This decouples read-heavy metrics from primary transactional databases.

### 2. Stateless JWT Authentication with Token Rotation
AdMitra implements stateless authentication using JSON Web Tokens (JWT) signed with HMAC-SHA512. Access tokens are short-lived (60 minutes), while long-lived refresh tokens are persisted in PostgreSQL to allow secure token rotation and explicit session revoking.

### 3. Real-Time Metrics Polling
Rather than maintaining persistent WebSocket connections for millions of passive dashboard viewers, AdMitra employs 5-second HTTP polling for analytics updates. This reduces connection overhead on the application server while maintaining near-real-time visibility.

---

## Database Schema

```
USERS
├── id (BIGINT, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR)
├── role_id (FK -> ROLES)
└── created_at (TIMESTAMP)

CAMPAIGNS
├── id (BIGINT, PK)
├── name (VARCHAR)
├── budget (DECIMAL)
├── status (ENUM: DRAFT, RUNNING, PAUSED, COMPLETED)
├── platform (ENUM: INMOBI, GOOGLE_ADS, META_ADS, LINKEDIN, TIKTOK)
├── target_audience (VARCHAR)
├── category (VARCHAR)
├── start_date (DATE)
├── end_date (DATE)
└── created_by (FK -> USERS)

ANALYTICS
├── id (BIGINT, PK)
├── campaign_id (FK -> CAMPAIGNS)
├── date (DATE)
├── impressions (BIGINT)
├── clicks (BIGINT)
├── spend (DECIMAL)
├── ctr (DECIMAL)
└── conversion (DECIMAL)
```

---

## REST API Specification

### Authentication Endpoints
- `POST /api/v1/auth/register` — Register a new user account
- `POST /api/v1/auth/login` — Authenticate credentials and receive JWT + Refresh Token
- `POST /api/v1/auth/refresh` — Issue new JWT using a valid Refresh Token
- `POST /api/v1/auth/logout` — Invalidate user session

### Campaign Management Endpoints
- `GET /api/v1/campaigns` — Fetch campaigns created by authenticated user
- `POST /api/v1/campaign` — Create a new advertising campaign
- `PUT /api/v1/campaign/{id}` — Update existing campaign configuration
- `DELETE /api/v1/campaign/{id}` — Remove a campaign
- `PATCH /api/v1/campaign/{id}/pause` — Change campaign status to PAUSED
- `PATCH /api/v1/campaign/{id}/resume` — Change campaign status to RUNNING

### Analytics & Leaderboard Endpoints
- `GET /api/v1/analytics/dashboard` — Fetch global analytics summary (Cached)
- `GET /api/v1/analytics/top` — Fetch top 5 campaigns ranked by CTR (Cached)
- `GET /api/v1/analytics/campaign/{id}` — Fetch detailed historical analytics for a campaign

---

## Getting Started

### Local Development Prerequisites
- Java 21 JDK
- Maven 3.9+
- Node.js 20+
- Docker & Docker Compose

### Running with Docker Compose
To launch the entire platform (PostgreSQL, Redis, Backend, and Frontend):

```bash
docker compose up --build -d
```

Access points:
- Frontend Dashboard: `http://localhost:3000`
- Backend API Gateway: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`

### Running Services Manually

1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
