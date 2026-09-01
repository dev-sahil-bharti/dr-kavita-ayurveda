# Dr. Kavita Ayurveda — System Architecture & Design

## 1. Overview
Dr. Kavita Ayurveda is a full-stack clinical management and patient portal application built on the MERN stack (MongoDB, Express, React, Node.js). It integrates online booking, Panchakarma multi-session therapy tracking, patient health records, SMS/Email automated reminders, Razorpay payments, and Cloudinary medical report management.

---

## 2. Target Monorepo Architecture

```text
project-root/
│
├── client/                      # React 19 + Vite Frontend SPA
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── app/                 # App root, providers, router config
│   │   ├── assets/              # Branding, icons, graphics
│   │   ├── components/          # Reusable design system components
│   │   │   ├── common/          # Button, Badge, Modal, Input, Select, Table
│   │   │   ├── feedback/        # Skeleton, LoadingState, EmptyState, ErrorState
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── ui/              # FileUpload, Loader
│   │   ├── config/              # Environment config & constants
│   │   ├── context/             # Global AuthContext & theme state
│   │   ├── features/            # Feature-sliced modules
│   │   │   ├── admin/           # Appointments, Patients, Inquiries, Settings, Stats
│   │   │   ├── auth/            # Admin/Patient Login, Registration, OTP Reset
│   │   │   ├── patient/         # Book Appointment, Appointments History, Profile
│   │   │   └── public/          # Home, About, Panchakarma, Therapies, Contact
│   │   ├── layouts/             # PublicLayout, AdminLayout, PatientLayout
│   │   ├── routes/              # AppRoutes with lazy-loading & ProtectedRoute
│   │   ├── services/api/        # Centralized Axios client & API Endpoints catalog
│   │   └── styles/              # Design tokens, variables & Tailwind globals
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express API Backend
│   ├── src/
│   │   ├── config/              # DB connection, Cloudinary, Razorpay
│   │   ├── constants/           # Error codes, roles, statuses
│   │   ├── controllers/         # Thin HTTP request/response handlers
│   │   ├── cron/                # Scheduled jobs (Daily 8 AM appointment reminder)
│   │   ├── middleware/          # JWT auth, roleCheck, errorHandler, validate
│   │   ├── models/              # Mongoose schemas with compound indexes
│   │   ├── routes/              # Express route definitions
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── services/            # Pure business logic, DB queries, integrations
│   │   └── utils/               # AppError, catchAsync, notify, receipt, logger
│   ├── uploads/                 # Local upload staging (with .gitkeep)
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Server entry point with graceful shutdown
│
├── docs/                        # Architecture, API & Deployment documentation
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
│
├── .gitignore
├── README.md
└── package.json                 # Monorepo root with unified scripts
```

---

## 3. Server Layer Responsibilities

```text
HTTP Request
     │
     ▼
[ Express Router ] ── (Validates HTTP method & URL)
     │
     ▼
[ Middleware Layer ] ── (Helmet, Rate Limiter, CORS, JWT Auth, Role Verification, Zod Validation)
     │
     ▼
[ Controller Layer ] ── (Extracts req.body/params/query, calls Service, formats JSON response)
     │
     ▼
[ Service Layer ] ── (Encapsulates business rules, transactions, 3rd party APIs, SMS/Email)
     │
     ▼
[ Model Layer (Mongoose) ] ── (Schema validation, compound indexing, TTL cleanup, hooks)
     │
     ▼
[ MongoDB Database ]
```

### Layer Rules:
- **Controllers** must remain thin (no direct database queries; delegating to Service).
- **Services** are standalone functions that throw `AppError` on domain violations.
- **Error Handling** is centralized through `catchAsync` and `errorHandler`.

---

## 4. Client Layer Architecture & State Management

- **Centralized API Client**: All HTTP traffic flows through `src/services/api/client.js` with automatic Bearer token injection and centralized 401 redirection.
- **Route-level Code Splitting**: All pages are dynamically imported via `React.lazy()` and wrapped in `<Suspense fallback={<LoadingState />}>`.
- **Feature Isolation**: Each business capability (Admin, Patient, Auth, Public) encapsulates its own pages, components, and dedicated API services.
- **UI Design System**: Tokenized CSS variables and Tailwind utility styling ensuring a serene Ayurveda aesthetic (Deep Forest Green, Warm Sand, Golden Amber, Healing Terracotta).

---

## 5. Security Architecture

1. **HTTP Security**: `helmet` headers protect against XSS, clickjacking, and MIME-type sniffing.
2. **Rate Limiting**: `express-rate-limit` prevents brute-force login and OTP flooding.
3. **Database-Backed OTP**: OTPs for password recovery are stored in a dedicated MongoDB collection with a 10-minute TTL index, attempt limits, and single-use invalidation.
4. **Payment Signature Verification**: Razorpay payment signatures are validated cryptographically using SHA256 HMAC on the server before confirming appointment payment status.
5. **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `patient` roles enforced by token verification and `authorizeRoles` middleware.
