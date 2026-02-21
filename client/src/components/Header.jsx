import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
    const user = useStore((state) => state.user);

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full w-96">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search fleet, trips, or drivers..."
                    className="bg-transparent border-none outline-none text-sm w-full"
                />
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Bell size={20} className="text-slate-500 cursor-pointer" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                        {user?.name?.charAt(0) || <User size={18} />}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
