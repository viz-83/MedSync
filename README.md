# MedSync - Advanced AI-Powered Telehealth Platform

MedSync is a comprehensive healthcare application that bridges the gap between patients and doctors through seamless video consultations, AI-driven health insights, and integrated medical services.

> **⚠️ DEMO DISCLAIMER**: This application is for demonstration and educational purposes only. Do not use real medical data or authentic payment instruments. All payments are simulated or in test mode.

---

## 🚀 Key Features

### 🩺 For Patients
- **Instant Video Consultations**: High-quality video calls with doctors using Stream SDK.
- **AI Health Tracker**: Log vitals (BP, Sugar, Weight) and get trend analysis & insights powered by Google Gemini.
- **Wellbeing Assistant**: An empathetic AI companion for mental wellness support with crisis detection.
- **Online Pharmacy**: Browse and order medicines with prescription uploads.
- **Lab Tests**: Book diagnostic tests with home collection options.
- **Secure Chat**: Persistent chat channels with doctors for follow-ups.

### 👩‍⚕️ For Doctors
- **Digital Clinic**: Manage appointments, availability slots, and patient history.
- **Prescription Management**: Create and issue digital prescriptions securely.
- **Patient Monitoring**: View patient health trends and vital logs before consultations.

### 🔒 Security & Privacy
- **Role-Based Access Control**: Strict data isolation between patients and doctors.
- **Protection Against IDOR**: Relationship-based data access enforcement.
- **Secure Logging**: No sensitive data (passwords, tokens) is ever logged.
- **AI Safety**: Defense-in-depth protection against prompt injection and misuse.

---

## 🛠️ Technology Stack

**Frontend**
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Real-time**: GetStream SDK (Video & Chat)

**Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, Rate Limiting, JWT Auth, Input Sanitization

**Third-Party Integrations**
- **AI**: Google Gemini (Pro/Flash models)
- **Payments**: Razorpay
- **Communication**: Stream (Video/Chat) via `@stream-io/node-sdk`

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- API Keys for: Gemini, Stream, Razorpay

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Stream (Video/Chat)
STREAM_API_KEY=...
STREAM_API_SECRET=...

# AI
GEMINI_API_KEY=...

# Payments
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

Start the server:

```bash
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (or `.env.local`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_STREAM_KEY=...
```

Start the development server:

```bash
npm run dev
```

---

## 🛡️ Security Architecture

MedSync implements a robust security model:
- **Authentication**: JWT-based stateless auth with secure cookies.
- **Authorization**: Custom middleware enforces role checks and resource ownership.
- **Input Validation**: Joi schemas validate all incoming requests.
- **AI Hardening**: Inputs to LLMs are sanitized to prevent injection attacks.

For more details, please refer to [SECURITY.md](./security.md).

---

## 🏥 Health Check

The application exposes a lightweight health check endpoint for monitoring uptime.

- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-12-29T12:00:00.000Z"
  }
  ```

---

## 🤝 Contribution

This project is closed-source for now. Please contact the maintainers for access.
