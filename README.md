# AdMitra Platform

> Scalable Campaign Management & Real-Time Analytics Platform for Digital Advertisers

AdMitra is a modern web application designed to help advertisers create campaigns, monitor performance, and manage budgets in real-time. Built with a robust Java backend and a sleek React frontend.

## 🏗️ Architecture
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT)
- **Database:** PostgreSQL (Transactional Data)
- **Cache:** Redis (Leaderboards & Analytics Aggregation)
- **Frontend:** React, TypeScript, Vite, Chart.js, Tailwind CSS
- **DevOps:** Docker Compose, GitHub Actions

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker and Docker Compose
- Java 21 and Maven
- Node.js (v20+)

### Running via Docker Compose (Easiest)
1. Clone the repository.
2. Run `docker-compose up --build`
3. Access the API at `http://localhost:8080/swagger-ui.html`

## 📚 API Documentation
The REST API is documented using Swagger. Once the backend is running, visit:
`http://localhost:8080/swagger-ui.html`

## 👨‍💻 Features
- **JWT Authentication:** Secure role-based access (ADMIN vs ADVERTISER).
- **Campaign CRUD:** Create, Pause, Resume, Delete campaigns.
- **Real-Time Analytics:** Metrics aggregated and cached in Redis with a 5-minute TTL.
- **Dark Mode Dashboard:** Premium glassmorphism design with live 5-second polling for metrics.

## 🛠️ Testing & CI
The project uses GitHub Actions for continuous integration. All commits to `main` are automatically built (Java compilation + React Vite build) to ensure zero regressions.
