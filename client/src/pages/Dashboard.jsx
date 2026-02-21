import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    AlertCircle,
    TrendingUp,
    ChevronRight,
    Activity,
    Settings,
    Navigation
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { analyticsService } from '../services/api';
import useStore from '../store/useStore';

const KPICard = ({ title, value, icon, color, trend }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-44 transition-all hover:shadow-xl hover:shadow-slate-200/50"
    >
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
                {icon}
            </div>

            {trend !== undefined && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>

        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { kpis, setKPIs } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const { data } = await analyticsService.getKPIs();
                setKPIs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchKPIs();
    }, [setKPIs]);

    if (loading) {
        return (
            <div className="animate-pulse flex items-center justify-center p-20 text-slate-400 font-bold">
                Initializing Dashboard Data...
            </div>
        );
    }

    const chartData = [
        { name: 'Mon', revenue: 4000, expenses: 2400 },
        { name: 'Tue', revenue: 3000, expenses: 1398 },
        { name: 'Wed', revenue: 2000, expenses: 9800 },
        { name: 'Thu', revenue: 2780, expenses: 3908 },
        { name: 'Fri', revenue: 1890, expenses: 4800 },
        { name: 'Sat', revenue: 2390, expenses: 3800 },
        { name: 'Sun', revenue: 3490, expenses: 4300 },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Command Center</h2>
                    <p className="text-slate-500 font-medium">Real-time operational monitoring</p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
                        Download Report
                    </button>
                    <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all">
                        New Trip
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Active Fleet"
                    value={kpis?.activeFleet || 0}
                    icon={<Truck size={24} />}
                    color="bg-blue-500"
                    trend={12}
                />

                <KPICard
                    title="On Trip"
                    value={kpis?.onTrip || 0}
                    icon={<Activity size={24} />}
                    color="bg-green-500"
                    trend={5}
                />

                <KPICard
                    title="Fleet Utilization"
                    value={`${kpis?.utilizationRate ? kpis.utilizationRate.toFixed(1) : 0}%`}
                    icon={<TrendingUp size={24} />}
                    color="bg-indigo-500"
                    trend={2}
                />

                <KPICard
                    title="Maintenance Alerts"
                    value={kpis?.inShop || 0}
                    icon={<AlertCircle size={24} />}
                    color="bg-red-500"
                />
            </div>

            {/* CHART + QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                {/* CHART */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            Revenue vs Operational Costs
                        </h3>

                        <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold p-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />

                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Quick Actions</h3>

                    <div className="space-y-4">
                        {[
                            { label: 'Dispatch Pending Cargo', desc: '3 trucks available', icon: <Navigation size={20} />, color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Review Maintenance', desc: '2 logs require signature', icon: <Settings size={20} />, color: 'bg-amber-50 text-amber-600' },
                            { label: 'Safety Briefing', desc: '14 drivers on site', icon: <Users size={20} />, color: 'bg-green-50 text-green-600' },
                        ].map((action, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${action.color}`}>
                                    {action.icon}
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {action.label}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">{action.desc}</p>
                                </div>

                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-slate-900 rounded-[1.5rem] text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">Fleet Health</p>
                            <h4 className="text-lg font-bold mb-3">Optimal Condition</h4>
                            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                                Your fleet is operating at 94% efficiency. No critical failures detected.
                            </p>
                            <button className="text-xs font-black text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-all">
                                View Details
                            </button>
                        </div>

                        <div className="absolute right-[-20px] bottom-[-20px] text-slate-800 opacity-20">
                            <Activity size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;