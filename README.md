# JobNearMe

A mobile application for finding job opportunities near your location, built with React Native and Node.js.

## Author

**Samir Ibourki**

- GitHub: [@Samir-ibourki](https://github.com/Samir-ibourki)
- Repository: [JobNearMe](https://github.com/Samir-ibourki/JobNearMe)

## Overview

JobNearMe is a location-based job search application that helps users discover employment opportunities in their vicinity. The app features a modern, user-friendly interface with comprehensive authentication and job browsing capabilities.

## Project Structure

This is a **pnpm monorepo** containing frontend and backend packages.

```
JobNearMe/
├── package.json              # Root package.json with monorepo scripts
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── .npmrc                    # pnpm configuration
│
├── backend/                  # @jobnearme/backend
│   ├── src/
│   │   └── config/           # Database configuration
│   ├── server.js             # Main server entry point
│   └── package.json          # Backend dependencies
│
└── frontend/                 # @jobnearme/frontend
    ├── app/                  # Application screens and routing
    │   ├── (auth)/           # Authentication screens
    │   └── onboarding/       # Onboarding flow
    ├── assets/               # Images and media files
    ├── store/                # State management (Zustand)
    ├── theme/                # UI theming and styles
    ├── utils/                # Utility functions and data
    └── package.json          # Frontend dependencies
```

## Tech Stack

### Frontend

- **Framework**: React Native (v0.81.5) with Expo (v54)
- **Navigation**: Expo Router (v6)
- **State Management**: Zustand (v5)
- **UI Components**: React Native Reanimated, Gesture Handler
- **Languages**: JavaScript/TypeScript

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
- pnpm (v9 or higher) - [Install pnpm](https://pnpm.io/installation)
- PostgreSQL database
- Expo CLI (for mobile development)
- Android Studio or Xcode (for mobile testing)

## Installation

This project uses **pnpm** with a monorepo structure for better dependency management and faster installations.

### Quick Start

1. Install pnpm globally (if not already installed):

```bash
npm install -g pnpm
```

2. Install all dependencies for the entire monorepo:

```bash
pnpm install
```

3. Create a `.env` file in the backend directory:

```bash
cd backend
```

Create `.env` file with:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Project

#### Run Both Frontend and Backend in Parallel

```bash
pnpm dev
```

#### Run Frontend Only (Android)

```bash
pnpm android
```

#### Run Frontend Only (iOS)

```bash
pnpm ios
```

#### Run Frontend Only (Web)

```bash
pnpm web
```

#### Run Backend Only

```bash
pnpm backend
```

Or for development with hot-reload:

```bash
pnpm dev:backend
```

## Development

### Available Scripts

From the root directory, you can run:

- `pnpm dev` - Run both frontend and backend in development mode (parallel)
- `pnpm android` - Run the Android app
- `pnpm ios` - Run the iOS app
- `pnpm web` - Run the web version
- `pnpm backend` - Start the backend server
- `pnpm dev:frontend` - Run only frontend in development mode
- `pnpm dev:backend` - Run only backend in development mode
- `pnpm lint` - Run linting for all packages
- `pnpm clean` - Clean node_modules in all packages
- `pnpm clean:all` - Clean everything including lock files

### Working on Individual Packages

To run commands in a specific package:

```bash
# Frontend
pnpm --filter @jobnearme/frontend <command>

# Backend
pnpm --filter @jobnearme/backend <command>
```

Examples:

```bash
# Install a package in frontend
pnpm --filter @jobnearme/frontend add axios

# Install a package in backend
pnpm --filter @jobnearme/backend add express-rate-limit
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
