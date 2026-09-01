# Dr. Kavita Ayurveda — API Specification & Contract

Base URL: `/api`

All standard JSON responses adhere to the following envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## 1. System Health

### `GET /api/health`
- **Auth**: None
- **Response**:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-09-01T12:00:00.000Z",
  "uptime": 124.5
}
```

---

## 2. Authentication & Authorization

### `POST /api/admin/login`
- **Auth**: None
- **Body**: `{ "email": "admin@example.com", "password": "securepassword" }`
- **Response**: `{ "_id": "...", "name": "...", "email": "...", "token": "jwt_token" }`

### `POST /api/admin/register`
- **Auth**: None
- **Body**: `{ "name": "...", "email": "...", "mobileNo": "...", "password": "..." }`

### `GET /api/admin/profile`
- **Auth**: Bearer Token (Role: `admin`)
- **Response**: `{ "user": { "_id": "...", "name": "...", "email": "...", "mobileNo": "..." } }`

### `PUT /api/admin/updateAdminProfile/:id`
- **Auth**: Bearer Token (Role: `admin`)
- **Body**: `{ "name": "...", "email": "..." }`

### `PUT /api/admin/changepassword/:id`
- **Auth**: Bearer Token (Role: `admin`)
- **Body**: `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }`

### `POST /api/admin/forgot-password`
- **Auth**: None
- **Body**: `{ "contact": "admin@example.com" }`

### `POST /api/admin/reset-password`
- **Auth**: None
- **Body**: `{ "contact": "admin@example.com", "otp": "123456", "newPassword": "..." }`

### `POST /api/patient/login`
- **Auth**: None
- **Body**: `{ "email": "patient@example.com", "password": "..." }` (or mobile in email field)

### `POST /api/patient/register`
- **Auth**: None
- **Body**: `{ "name": "...", "mobile": "...", "email": "...", "password": "...", "gender": "Male" }`

### `GET /api/patient/profile`
- **Auth**: Bearer Token (Role: `patient`)
- **Response**: `{ "_id": "...", "name": "...", "mobile": "...", "email": "..." }`

### `PUT /api/patient/updatePatientProfile/:id`
- **Auth**: Bearer Token (Role: `patient`)
- **Body**: `{ "name": "...", "address": "...", "healthConditions": "..." }`

---

## 3. Appointments Management

### `POST /api/appointments/book`
- **Auth**: Bearer Token (Role: `patient`)
- **Content-Type**: `multipart/form-data`
- **Fields**: `patientName`, `mobile`, `email`, `gender`, `age`, `urgency`, `consultationType`, `preferredService`, `date`, `timeSlot`, `reasonForVisit`, `isFirstVisit`, `reports` (file)
- **Response (201)**: `{ "status": "success", "data": { ...appointment } }`

### `GET /api/appointments/my-appointments`
- **Auth**: Bearer Token (Role: `patient`)
- **Response**: `{ "status": "success", "data": [ ...appointments ] }`

### `GET /api/appointments/all`
- **Auth**: Bearer Token (Role: `admin`)
- **Query**: `?page=1&limit=20&status=pending&search=name`
- **Response**:
```json
{
  "status": "success",
  "data": [ ...appointments ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

### `GET /api/admin/appointments/calendar`
- **Auth**: Bearer Token (Role: `admin`)
- **Query**: `?date=YYYY-MM-DD`
- **Response**: `{ "success": true, "data": [ ...appointmentsForDate ] }`

### `PATCH /api/admin/appointments/:id/accept`
- **Auth**: Bearer Token (Role: `admin`)
- **Action**: Confirms pending appointment, creates Razorpay payment link (if online), dispatches notification.

### `PATCH /api/admin/appointments/:id/checkin`
- **Auth**: Bearer Token (Role: `admin`)
- **Action**: Sets `checkedIn: true` and `checkedInAt: now` on the day of appointment.

### `PATCH /api/admin/appointments/:id/mark-cash-paid`
- **Auth**: Bearer Token (Role: `admin`)
- **Body**: `{ "amount": 500 }`
- **Action**: Marks payment status as paid via cash and emails receipt.

### `PATCH /api/admin/appointments/:id/complete`
- **Auth**: Bearer Token (Role: `admin`)
- **Body**: `{ "doctorNote": "...", "followUpDate": "...", "sessionNumber": 1, "totalSessions": 5 }`
- **Action**: Completes consultation and schedules follow-up alert.

---

## 4. Admin Dashboard & Patients

### `GET /api/admin/dashboard-stats`
- **Auth**: Bearer Token (Role: `admin`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalPatients": 120,
    "totalAppointments": 340,
    "pendingAppointments": 5,
    "appointmentsToday": 8,
    "recentAppointments": []
  }
}
```

### `GET /api/patient`
- **Auth**: Bearer Token (Role: `admin`)
- **Query**: `?page=1&limit=20&search=john`
- **Response**: `{ "status": "success", "data": [ ...patients ], "pagination": { ... } }`

---

## 5. Inquiries

### `POST /api/inquiries`
- **Auth**: None (Public)
- **Body**: `{ "name": "...", "email": "...", "mobile": "...", "subject": "...", "message": "..." }`
- **Response (201)**: `{ "success": true, "data": { ...inquiry } }`

### `GET /api/inquiries`
- **Auth**: Bearer Token (Role: `admin`)
- **Response**: `{ "success": true, "count": 10, "data": [ ...inquiries ] }`

### `PATCH /api/inquiries/:id/status`
- **Auth**: Bearer Token (Role: `admin`)
- **Body**: `{ "status": "resolved" }`

### `DELETE /api/inquiries/:id`
- **Auth**: Bearer Token (Role: `admin`)

---

## 6. Payments & Razorpay

### `POST /api/payment/create-order`
- **Auth**: Bearer Token
- **Body**: `{ "appointmentId": "...", "amount": 500 }`
- **Response**: `{ "success": true, "order": { ...order }, "key": "rzp_test_..." }`

### `POST /api/payment/verify`
- **Auth**: Bearer Token
- **Body**: `{ "appointmentId": "...", "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }`

### `POST /api/payment/webhook`
- **Auth**: Public (Validated via `x-razorpay-signature` HMAC)

---

## 7. Notifications & Settings & Uploads

### `GET /api/notifications`
- **Auth**: Bearer Token
- **Response**: `{ "status": "success", "unreadCount": 2, "data": [ ...notifications ] }`

### `PUT /api/notifications/read-all`
- **Auth**: Bearer Token

### `GET /api/settings`
- **Auth**: Bearer Token

### `PUT /api/settings`
- **Auth**: Bearer Token (Role: `admin`)

### `POST /api/upload`
- **Auth**: Bearer Token
- **Content-Type**: `multipart/form-data`
- **File field**: `file`
- **Response**: `{ "success": true, "data": { "url": "https://res.cloudinary.com/...", "public_id": "..." } }`
