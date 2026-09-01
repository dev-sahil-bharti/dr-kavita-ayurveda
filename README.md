# Dr. Kavita Ayurveda — Clinical Management System

A production-grade, full-stack MERN application for holistic Ayurvedic healthcare management, consultation booking, multi-session Panchakarma tracking, automated SMS/Email reminders, and administrative operations.

---

## 🏛️ Architecture Overview

The repository is structured as an independently deployable monorepo:

```text
├── client/           # React 19 + Vite + Tailwind CSS Frontend
├── server/           # Node.js + Express + MongoDB Backend API
├── docs/             # Architecture, API & Deployment Documentation
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
├── package.json      # Monorepo workspace orchestration
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+ or v20+)
- MongoDB running locally or MongoDB Atlas URI
- npm or yarn

### 2. Installation
Install all dependencies across both workspaces from root:
```bash
npm install --prefix server
npm install --prefix client
```

### 3. Environment Setup
Configure the environment variables in both `server/` and `client/`:
```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

### 4. Running in Development Mode
Start both backend API and frontend Vite dev servers concurrently:
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Backend runs at: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

---

## 🛠️ Monorepo Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs both server and client development servers |
| `npm run dev:client` | Starts Vite frontend dev server |
| `npm run dev:server` | Starts Express backend server with nodemon |
| `npm run build` | Builds the client production bundle with code splitting |
| `npm run start` | Starts the production Node.js server |
| `npm run lint` | Runs oxlint on frontend codebase |

---

## 📚 Technical Documentation

- 📐 **[System Architecture](docs/architecture.md)** — Architectural layers, design tokens, state management.
- 📡 **[API Specification](docs/api.md)** — Complete catalog of endpoints, payload contracts, and error handling.
- 🚀 **[Deployment Guide](docs/deployment.md)** — Independent frontend & backend deployment on Vercel, Render, or AWS.

---

## 🔐 Security Features

- **Helmet**: Secures HTTP response headers against clickjacking, XSS, and MIME-sniffing.
- **Rate Limiting**: Defends against brute-force authentication and OTP flooding attacks.
- **Persistent OTP Storage**: MongoDB-backed OTPs with 10-minute automatic TTL expiration.
- **HMAC Payment Verification**: Cryptographic validation of Razorpay order signatures.
- **Role-Based Protection**: Strict separation of Admin vs Patient privileges.
