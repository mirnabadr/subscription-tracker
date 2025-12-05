# 📅 SubDub - Subscription Tracker API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-Workflow-00E9A3?style=for-the-badge&logo=upstash&logoColor=white)

**A robust RESTful API for managing subscriptions with intelligent automated email reminders powered by Upstash Workflows**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

---

## 🎯 Overview

SubDub is a production-ready subscription management system that helps users track their recurring subscriptions and never miss a renewal. The system automatically sends personalized email reminders at strategic intervals (7, 5, 2, and 1 days before renewal) using advanced workflow orchestration.

### Key Highlights

- ✅ **Automated Workflow Orchestration** - Powered by Upstash Workflows for reliable, scheduled email delivery
- ✅ **Intelligent Reminder System** - Multi-stage email notifications before subscription renewals
- ✅ **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- ✅ **Rate Limiting & Bot Protection** - Arcjet integration for API security
- ✅ **Production-Ready** - Comprehensive error handling, validation, and logging
- ✅ **RESTful Architecture** - Clean, scalable API design following best practices

---

## ✨ Features

### Core Functionality
- **User Management**: Secure registration, authentication, and profile management
- **Subscription CRUD**: Create, read, update, and delete subscriptions
- **Smart Renewal Tracking**: Automatic calculation of renewal dates based on frequency
- **Multi-Currency Support**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, NZD
- **Category Organization**: Food, transport, housing, utilities, entertainment, health, education, technology, and more

### Advanced Features
- **Automated Email Reminders**: 
  - 7 days before renewal
  - 5 days before renewal
  - 2 days before renewal
  - 1 day before renewal (final reminder)
- **Workflow Orchestration**: Reliable, distributed workflow execution with Upstash
- **Email Templates**: Beautiful, responsive HTML email templates
- **Status Management**: Active, cancelled, and expired subscription states
- **Test Mode**: Development-friendly immediate email sending for testing

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Workflow Engine**: Upstash Workflows & QStash
- **Email Service**: Nodemailer with Gmail SMTP
- **Security**: Arcjet (rate limiting & bot protection)
- **Date Handling**: Day.js

### Development Tools
- **Code Quality**: ESLint
- **Development**: Nodemon for hot reloading
- **Environment**: dotenv for configuration management

---

## 🏗 Architecture

```
subscription-tracker/
├── config/           # Configuration files (env, database, services)
├── controllers/      # Business logic layer
├── database/         # Database connection & setup
├── middlewares/      # Express middlewares (auth, error handling, security)
├── models/           # Mongoose data models
├── routes/           # API route definitions
└── utils/            # Utility functions (email templates, helpers)
```

### Design Patterns
- **MVC Architecture**: Separation of concerns with Models, Views (API responses), and Controllers
- **Middleware Pattern**: Reusable authentication, error handling, and security middleware
- **Repository Pattern**: Data access abstraction through Mongoose models
- **Workflow Pattern**: Asynchronous workflow orchestration for email scheduling

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Gmail account with App Password (for email sending)
- Upstash account (for workflow orchestration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mirnabadr/subscription-tracker.git
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.development.local` or `.env.development`:
   ```env
   # Server Configuration
   PORT=5500
   NODE_ENV=development
   SERVER_URL=http://localhost:5500

   # Database
   MONGO_URI=your_mongodb_connection_string

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRE=7

   # Upstash QStash & Workflows
   QSTASH_TOKEN=your_upstash_qstash_token
   QSTASH_URL=http://127.0.0.1:8080  # For local development
   # QSTASH_URL=https://qstash.upstash.io/v2  # For production

   # Email Configuration (Gmail)
   EMAIL_PASSWORD=your_gmail_app_password

   # Arcjet Security
   ARCJET_API_KEY=your_arcjet_api_key
   ARCJET_ENV=development
   ```

4. **Start local QStash server** (for development)
   ```bash
   npm run qstash
   ```
   Or use Docker:
   ```bash
   npm run qstash:docker
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5500`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5500/api/v1
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Sign in and get JWT token
- `POST /auth/signout` - Sign out

#### Users
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user

#### Subscriptions
- `POST /subscriptions` - Create a new subscription (requires auth)
- `GET /subscriptions/user/:id` - Get all subscriptions for a user (requires auth)
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription

#### Workflows
- `POST /workflows/subscription/reminder` - Trigger reminder workflow (internal)
- `POST /workflows/subscription/reminder/test` - Test endpoint (sends emails immediately)

### Example Request

**Create Subscription**
```bash
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2025-12-01T00:00:00.000Z",
  "renewalDate": "2026-01-01T00:00:00.000Z"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "...",
      "name": "Netflix Premium",
      "status": "active",
      "renewalDate": "2026-01-01T00:00:00.000Z",
      ...
    },
    "workflowRunId": "msg_..."
  }
}
```

---

## 🔄 Workflow System

The subscription reminder system uses **Upstash Workflows** to orchestrate email delivery:

1. **Subscription Created** → Workflow triggered automatically
2. **Workflow Schedules Reminders**:
   - Calculates reminder dates (7, 5, 2, 1 days before renewal)
   - Schedules each reminder using `context.sleepUntil()`
3. **Email Delivery**:
   - Workflow resumes on scheduled date
   - Sends personalized email reminder
   - Continues to next reminder

### Email Reminder Flow
```
Renewal Date: Jan 15, 2026
├── 7 days before: Jan 8, 2026 → Email sent
├── 5 days before: Jan 10, 2026 → Email sent
├── 2 days before: Jan 13, 2026 → Email sent
└── 1 day before: Jan 14, 2026 → Final reminder sent
```

---

## 🧪 Testing

### Test Email Sending
Use the test endpoint to send all reminder emails immediately:

```bash
POST /api/v1/workflows/subscription/reminder/test
Content-Type: application/json

{
  "subscriptionId": "your_subscription_id"
}
```

### Test Mode
For development, you can trigger the workflow with `testMode: true` to send emails immediately instead of scheduling them.

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Arcjet integration prevents API abuse
- **Bot Protection**: Advanced bot detection and blocking
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages (no sensitive data leakage)

---

## 📦 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run qstash     # Start local QStash server
npm run qstash:docker  # Start QStash via Docker
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mirna Badr**

- GitHub: [@mirnabadr](https://github.com/mirnabadr)
- Project Link: [https://github.com/mirnabadr/subscription-tracker](https://github.com/mirnabadr/subscription-tracker)

---

## 🙏 Acknowledgments

- [Upstash](https://upstash.com/) for workflow orchestration
- [Arcjet](https://arcjet.com/) for security features
- Express.js community for the amazing framework

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Mirna Badr

</div>

