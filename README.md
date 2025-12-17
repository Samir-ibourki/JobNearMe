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

````
JobNearMe/
├── backend/                  # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/            # Database & environment configuration
│   │   ├── models/            # Sequelize models
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Auth & error handling
│   │   └── services/          # Reusable services
│   ├── server.js              # Server entry point
│   └── package.json
│
└── frontend/                  # Mobile Application (React Native + Expo)
    ├── app/                   # Screens & routing (Expo Router)
    │   ├── (auth)/            # Authentication screens
    │   ├── onboarding/        # Onboarding flow
    │   └── home/              # Main application screens
    ├── assets/                # Images & icons
    ├── store/                 # Zustand global state
    ├── services/              # API & Axios services
    ├── theme/                 # UI theme & styles
    └── package.json


## Tech Stack

### Frontend

- **Framework**: React Native (v0.81.5) with Expo (v54)
- **Navigation**: Expo Router (v6)
- **State Management**: Zustand (v5)
- **UI Components**: React Native Reanimated, Gesture Handler
- **Languages**: JavaScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Features

- User authentication (Sign Up, Log In, Forgot Password)
- Onboarding experience for new users
- Location-based job search
- Modern and responsive UI
- Secure API with JWT authentication
- Database management with Sequelize

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (for mobile development)
- Android Studio or Xcode (for mobile testing)

## Installation

This project has separate frontend and backend folders. Navigate to each folder to install dependencies and run the project.

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with your configuration:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:

```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Development

### Backend Scripts

Navigate to `backend/` directory:

- `npm start` - Start the backend server
- `npm run dev` - Start with nodemon (hot-reload)
- `npm test` - Run tests

### Frontend Scripts

Navigate to `frontend/` directory:

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Adding Dependencies

To add new packages:

```bash
# Backend
cd backend
npm install <package-name>

# Frontend
cd frontend
npm install <package-name>
```

## Database

The application uses PostgreSQL with Sequelize ORM. Database configuration can be found in:

- [backend/src/config/database.js](backend/src/config/database.js)
- [backend/src/config/config.json](backend/src/config/config.json)

## API Endpoints

The backend provides RESTful API endpoints for:

- User registration and authentication
- Job listings and search
- User profile management
- Location-based queries

## Screens

### Authentication

- [Sign Up](<frontend/app/(auth)/signUp.jsx>) - New user registration
- [Log In](<frontend/app/(auth)/logIn.jsx>) - User authentication
- [Forgot Password](<frontend/app/(auth)/forgotPassword.jsx>) - Password recovery

### Onboarding

- [Onboarding Flow](frontend/app/onboarding/index.jsx) - First-time user experience

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any inquiries or issues, please open an issue on the [GitHub repository](https://github.com/Samir-ibourki/JobNearMe/issues).

---

Made with ❤️ by Samir Ibourki
