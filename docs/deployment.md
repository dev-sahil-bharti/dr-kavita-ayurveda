# Dr. Kavita Ayurveda — Deployment Guide

This guide outlines production deployment best practices for both the independent frontend and backend services.

---

## 1. Production Architecture Overview

```text
       [ Clients / Browsers ]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[ Static CDN / Vercel ]   [ Backend Service / Render ]
(React SPA - client/dist)  (Node.js API - server)
      │                     │
      │                     ▼
      │           [ MongoDB Atlas Cluster ]
      │                     ▲
      └─────────────────────┘
```

---

## 2. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

### Build Settings
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `18.x` or `20.x`

### Environment Variables
```env
VITE_API_URL=https://api.drkavitaayurveda.com/api
VITE_APP_NAME="Dr. Kavita Ayurveda"
```

### SPA Routing Fallback
Create `client/public/_redirects` (for Netlify) or `client/vercel.json` (for Vercel):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Backend Deployment (Render / Railway / AWS EC2)

### Build & Run Settings
- **Root Directory**: `server`
- **Build Command**: `npm install --omit=dev`
- **Start Command**: `node server.js`

### Environment Variables
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://drkavitaayurveda.com
CLIENT_URL=https://drkavitaayurveda.com
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dr-kavita-ayurveda?retryWrites=true&w=majority
JWT_SECRET=<strong-random-64-char-string>
JWT_EXPIRE=7d

# 3rd Party Integrations
MSG91_AUTH_KEY=...
MSG91_OTP_TEMPLATE_ID=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### Health Check Endpoint
Configure deployment container health checks pointing to:
```text
GET /api/health
```

---

## 4. Security & Hardening Checklist

1. **HTTPS Only**: Ensure SSL/TLS is enforced across both client and server.
2. **CORS Restrictions**: `FRONTEND_URL` in production must match exact production domain(s).
3. **Database Security**: Whitelist backend hosting IP addresses in MongoDB Atlas Network Access.
4. **Secret Management**: Never commit `.env` files into source repositories.
