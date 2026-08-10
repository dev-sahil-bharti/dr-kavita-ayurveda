# Dr. Kavita Ayurveda 🌿

A comprehensive, full-stack Clinic Management System built on the MERN stack (MongoDB, Express, React, Node.js). This platform provides a seamless digital experience for patients to book consultations and for clinic administrators to manage appointments, payments, and patient records efficiently.

## 🚀 Features

### For Patients
* **OTP-based Authentication**: Secure login and registration using mobile numbers via MSG91.
* **Appointment Booking**: Easy-to-use interface to book Online or In-person consultations.
* **Payment Integration**: Secure online payments using **Razorpay**.
* **Instant Notifications**: Automated Email, SMS (via MSG91), and In-App notifications for booking confirmations, rescheduling, and reminders.
* **Patient Dashboard**: Track upcoming appointments, view past consultation history, and manage profile settings.

### For Administrators
* **Admin Dashboard**: A beautiful, modern interface with dark/light mode support.
* **Patient Management**: View registered patients, filter by status (Active/Archived) and Gender, and access detailed medical history.
* **Appointment Lifecycle**: Complete control over appointments (Pending, Confirmed, Checked-in, Completed, Cancelled, Rescheduled).
* **Automated Alerts**: Triggers notifications to patients automatically whenever their appointment status is updated or rescheduled.
* **Global Settings**: Configure clinic address, working hours, themes, and notification preferences dynamically.

## 💻 Tech Stack

* **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), Vite
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT (Admin), OTP via MSG91 (Patients)
* **Payments**: Razorpay Integration
* **Email & SMS**: Nodemailer, MSG91 DLT APIs

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/dev-sahil-bharti/dr-kavita-ayurveda.git
cd dr-kavita-ayurveda
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
MSG91_AUTH_KEY=your_msg91_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🤝 Contribution
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is proprietary and confidential.
