import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import useSocket from './hooks/useSocket';

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
    const { user, isAuthChecked, checkAuth } = useStore();

    useEffect(() => {
        if (!isAuthChecked) {
            checkAuth();
        }
    }, [isAuthChecked, checkAuth]);

    if (!isAuthChecked) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <p className="text-slate-400 font-medium animate-pulse">
                        Initializing FleetFlow...
                    </p>
                </div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
};

function App() {
    useSocket(); // ✅ ENABLE REALTIME SOCKET

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="drivers" element={<Drivers />} />
                <Route path="trips" element={<Trips />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="analytics" element={<Analytics />} />
            </Route>

            <Route path="*" element={
                <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            404 - Page Not Found
                        </h2>
                        <p className="text-slate-500 mb-6">
                            The page you are looking for doesn't exist or has been moved.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-500 transition-all"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            } />
        </Routes>
    );
}

export default App;