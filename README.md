# FleetFlow - Modular Fleet & Logistics Management System

FleetFlow is a production-ready, real-time Fleet Management System built with the MERN stack. It provides a centralized digital platform for fleet managers, dispatchers, and safety officers to manage vehicles, drivers, and trips in real-time with high resilience.

## 🚀 Tech Stack

- **Frontend**: React.js, TailwindCSS, Framer Motion, Zustand, Recharts, Lucide-React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT, Bcrypt, Joi.
- **Utilities**: Winston (Logging), Multer (Uploads), PDFKit (Exports).

## 📂 Project Structure

```text
FleetFlow/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/             # Images and styles
│   │   ├── components/         # Reusable UI components (Sidebar, Header, ErrorBoundary)
│   │   ├── hooks/              # Custom React hooks (useSocket)
│   │   ├── pages/              # Main view components (Dashboard, Vehicles, Drivers, etc.)
│   │   ├── services/           # API communication layer (Axios)
│   │   ├── store/              # State management (Zustand)
│   │   ├── App.jsx             # Root component with routing and auth hydration
│   │   └── main.jsx            # Application entry point with Error Boundary
│   ├── tailwind.config.js      # CSS configuration
│   └── vite.config.js          # Build configuration
├── server/                     # Express Backend
│   ├── config/                 # Database and environment config
│   ├── controllers/            # Business logic for each resource
│   ├── middleware/             # Auth, Error handling, and Validation middleware
│   ├── models/                 # Mongoose schemas (Vehicle, Driver, Trip, User)
│   ├── routes/                 # API endpoints
│   ├── utils/                  # Helper functions and exporters
│   ├── seeder.js               # Initial data population script
│   └── server.js               # Main executable for the API
└── README.md                   # This file
```

## ✅ Tasks Performed

### 1. Backend Implementation
- **Architecture**: Established a robust MVC-style backend structure.
- **Security**: Implemented JWT-based authentication and Bcrypt password hashing.
- **Validation**: Added Joi schema validation for all API inputs.
- **Database**: Configured MongoDB connection with optimized Mongoose models.

### 2. Frontend Implementation
- **Premium UI**: Created a visually rich dashboard using TailwindCSS and Framer Motion.
- **State Management**: Integrated Zustand for lightweight, efficient global state.
- **Real-time**: Leveraged Socket.io for live updates (KPIs, Trip status).

### 3. Frontend Stabilization (Critical Fixes)
- **Error Boundary**: Implemented a global `ErrorBoundary` to prevent blank screens on runtime failures.
- **Auth Hydration**: Fixed the "white screen" issue by adding `isAuthChecked` logic in Zustand, ensuring the app waits for local data before rendering.
- **Icon Standardization**: Corrected fragile icon imports by standardizing on `lucide-react` stable icons.
- **Routing**: Refactored `main.jsx` and `App.jsx` to correctly wrap the application in `BrowserRouter`.
- **Loading Safety**: Added skeleton loaders and "No Data" fallbacks to all core pages.

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
# Terminal 1: Backend
cd server && npm install

# Terminal 2: Frontend
cd client && npm install
```

### 2. Run the Application
```bash
# Terminal 1: Start Backend (Port 5001)
cd server && npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd client && npm run dev
```

## 🔐 Default Credentials
- **User**: `admin@fleetflow.com`
- **Password**: `password123`
