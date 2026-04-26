# LegalConnect - Backend API

The backend for LegalConnect, a high-performance legal service platform. Built with Node.js and Express using Clean Architecture and Domain-Driven Design principles.

## 🚀 Tech Stack
- **Core**: Node.js & Express 5
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis (ioredis) for OTP & session management
- **Real-time**: Socket.io
- **Authentication**: JWT, Google Auth Library
- **Payments**: Stripe (including Webhooks)
- **Storage**: Cloudinary 
- **Validation**: Zod & DTO-based validation


---

## 🏗️ Architecture
Follows **Clean Architecture** :
- **`src/domain/`**: Entities and Repository interfaces.
- **`src/application/`**: Use cases, DTOs, Mappers.
- **`src/infrastructure/`**: Implementations (DB, Redis, Mail, Cloudinary).
- **`src/interface/`**: Controllers, Routes, Middlewares.

---

## 🔒 Security Features
- **Role-Based Access Control (RBAC)**: Admin, Lawyer, and User roles.
- **OTP Brute-Force Protection**: 5-attempt limit for verification.
- **Sanitized DTOs**: Prevents Mass Assignment vulnerabilities.
- **Secure Cookies**: HTTP-only, secure, and samesite cookie handling.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis Server

### Setup
1. `npm install`
2. Create `.env` with:
```env
PORT=8080
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_uri
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_MAX_AGE=900000
REFRESH_TOKEN_MAX_AGE=604800000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```
3. `npm run dev`
