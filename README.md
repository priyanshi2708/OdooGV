# FleetFlow - Modular Fleet & Logistics Management System

FleetFlow is a production-ready, real-time Fleet Management System built with the MURN stack. It provides a centralized digital platform for fleet managers, dispatchers, and safety officers to manage vehicles, drivers, and trips in real-time.

## 🚀 Tech Stack

- **Frontend**: React.js, TailwindCSS, ShadCN UI, Framer Motion, Zustand, Recharts, Socket.io-client.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT, Bcrypt, Joi.
- **Utilities**: PDFKit (PDF Exports), CSV-Writer (CSV Exports), Multer (File Uploads).

## ✨ Core Features

- **Real-time Dashboard**: Live KPI updates and utilization charts.
- **Vehicle Registry**: Manage fleet inventory with status tracking.
- **Trip Dispatcher**: Smart assignment with load capacity and driver eligibility checks.
- **Driver Performance**: Safety scores and license expiry tracking.
- **Maintenance Logging**: Service history and automated vehicle status updates.
- **Analytics**: ROI and Fuel Efficiency reporting with PDF/CSV export.
- **RBAC**: Role-Based Access Control for Manager, Dispatcher, Safety, and Finance roles.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas)

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Seed the Database
```bash
cd server
node seeder.js
```

### 4. Run the Application
Open two terminals:

**Terminal 1 (Backend)**:
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd client
npm run dev
```

## 🔐 Credentials (Default Seed)
- **User**: `admin@fleetflow.com`
- **Password**: `password123`

## 📈 Future Improvements
- GPS tracking integration.
- Automated route optimization.
- Mobile app for drivers.
- Multi-currency support.
