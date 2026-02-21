import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Truck,
    Users,
    Navigation,
    Wrench,
    DollarSign,
    LogOut
} from 'lucide-react';
import useStore from '../store/useStore';

const Sidebar = () => {
    const logout = useStore((state) => state.logout);
    const navigate = useNavigate();

    const navItems = [
        { icon: <BarChart3 size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Truck size={20} />, label: 'Vehicles', path: '/vehicles' },
        { icon: <Users size={20} />, label: 'Drivers', path: '/drivers' },
        { icon: <Navigation size={20} />, label: 'Trips', path: '/trips' },
        { icon: <Wrench size={20} />, label: 'Maintenance', path: '/maintenance' },
        { icon: <DollarSign size={20} />, label: 'Analytics', path: '/analytics' },
    ];


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-slate-900 h-screen text-white flex flex-col p-4 shadow-xl">
            <div className="text-2xl font-bold mb-10 px-2 text-indigo-400">FleetFlow</div>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 mt-auto text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
