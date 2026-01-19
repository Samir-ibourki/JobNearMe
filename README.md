# JobNearMe

A mobile application for finding job opportunities near your location, built with React Native and Node.js.

## Author

**Samir Ibourki**

- GitHub: [@Samir-ibourki](https://github.com/Samir-ibourki)
- Repository: [JobNearMe](https://github.com/Samir-ibourki/JobNearMe)

## Overview

JobNearMe is a location-based job search application that helps users discover employment opportunities in their vicinity. The app features a modern, user-friendly interface with comprehensive authentication and job browsing capabilities.

## Context and Problem Statement

Today, many job search platforms exist (such as Indeed, LinkedIn, or local sites), but they are often complex, overloaded with national or international offers, and not optimized for quick local searches. Local job offers from small businesses (shops, restaurants, crafts, services) are frequently buried or hard to find on these large platforms.

**Main Problem:**  
How can users easily and quickly find job offers near them, in a simple, intuitive, and efficient way — especially for urgent or local needs?

JobNearMe addresses this issue by prioritizing geolocation and simplicity, making local employment accessible with just a few taps.

## Project Structure

```
JobNearMe/
├── backend/                    # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database & environment configuration
│   │   │   └── database.js     # Sequelize database connection
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   └── userController.js
│   │   ├── models/             # Sequelize models
│   │   │   ├── User.js         # Candidate model
│   │   │   ├── Employer.js     # Employer model
│   │   │   ├── Job.js          # Job posting model
│   │   │   ├── Application.js  # Job application model
│   │   │   └── index.js        # Model associations
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middlewares/        # Auth & error handling
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── services/           # Reusable services
│   │   │   └── emailService.js
│   │   ├── seeders/            # Database seeders
│   │   └── tests/              # Jest tests
│   ├── server.js               # Server entry point
│   ├── Dockerfile              # Docker configuration
│   ├── railway.toml            # Railway deployment config
│   └── package.json
│
├── frontend/                    # Mobile Application (React Native + Expo)
│   ├── app/                     # Screens & routing (Expo Router)
│   │   ├── (auth)/              # Authentication screens
│   │   │   ├── logIn.jsx
│   │   │   ├── signUp.jsx
│   │   │   ├── forgotPassword.jsx
│   │   │   └── resetPassword.jsx
│   │   ├── (candidate)/         # Candidate screens
│   │   │   ├── index.jsx        # Home/Job listings
│   │   │   ├── map.jsx          # Jobs on map
│   │   │   ├── myApplications.jsx
│   │   │   └── profile.jsx
│   │   ├── (employer)/          # Employer screens
│   │   │   ├── dashboard.jsx
│   │   │   ├── addJob.jsx
│   │   │   ├── myJobs.jsx
│   │   │   └── applicants.jsx
│   │   └── onboarding/          # Onboarding flow
│   ├── api/                     # API services
│   │   └── axios.js             # Axios configuration
│   ├── components/              # Reusable components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useJobs.js
│   │   └── useApplications.js
│   ├── store/                   # Zustand global state
│   │   └── useStore.js
│   ├── theme/                   # UI theme & styles
│   │   └── colors.js
│   └── package.json
│
├── railway.toml                 # Railway deployment config
└── docker-compose.yml           # Docker compose config
```

## Tech Stack

### Frontend

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Maps**: React Native Maps

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Email**: Nodemailer

## Features

### For Candidates
- User registration and authentication
- Browse and search job listings
- View jobs on interactive map
- Apply for jobs with cover letter
- Track application status
- Location-based job recommendations
- Profile management

### For Employers
- Employer registration
- Post new job listings
- Manage posted jobs (edit, delete)
- View applicants for each job
- Accept or reject applications
- Dashboard with statistics

### General
- Onboarding experience for new users
- Forgot/Reset password functionality
- Modern and responsive UI
- Secure API with JWT authentication

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (for mobile development)
- Android Studio or Xcode (for mobile testing)

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
# APP CONFIG
PORT=3030
NODE_ENV=development

# DATABASE CONFIG
DB_HOST=localhost
DB_PORT=5432
DB_NAME=JobNearMe
DB_USER=postgres
DB_PASSWORD=your_password

# EMAIL CONFIG
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# JWT CONFIG
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Start the server:

```bash
npm run dev    # Development
npm start      # Production
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get job by ID |
| GET | `/api/jobs/nearby` | Get nearby jobs |
| GET | `/api/jobs/employer` | Get employer's jobs |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get user applications |
| GET | `/api/applications/job/:jobId` | Get job applicants |
| POST | `/api/applications` | Submit application |
| PUT | `/api/applications/:id` | Update application status |

## Deployment

The backend is deployed on **Railway** with PostgreSQL database.

- **API URL**: `https://jobnearme-az.railway.app`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

---

Made with ❤️ by Samir Ibourki
