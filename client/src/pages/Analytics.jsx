import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, FileText, Filter, TrendingUp, DollarSign, Fuel } from 'lucide-react';
import { analyticsService } from '../services/api';

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await analyticsService.getVehicleStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const fuelEffData = stats.map(s => ({ name: s.name, efficiency: parseFloat(s.fuelEfficiency) }));
    const roiData = stats.map(s => ({ name: s.licensePlate, roi: parseFloat(s.roi) }));

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-bounce">Compiling Financial Data...</div>;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Business Analytics</h2>
                    <p className="text-slate-500 font-medium">Profitability and efficiency oversight</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <FileText size={18} /> Export PDF
                    </button>
                    <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Fuel Efficiency</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">KM per Liter per Vehicle</p>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Fuel size={20} /></div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fuelEffData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="efficiency" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Return on Investment (ROI)</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Percentage gain per vehicle</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={20} /></div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={roiData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800">Detailed Financial Performance</h3>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all uppercase tracking-widest">Filter by Region</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Vehicle Unit</th>
                                <th className="px-10 py-6 text-center">ROI</th>
                                <th className="px-10 py-6 text-center">Efficiency</th>
                                <th className="px-10 py-6 text-right">Revenue</th>
                                <th className="px-10 py-6 text-right">Cost</th>
                                <th className="px-10 py-6 text-right">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-10 py-6">
                                        <p className="font-black text-slate-800 tracking-tight">{s.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{s.licensePlate}</p>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`font-black text-sm ${s.roi > 0 ? 'text-green-600' : 'text-red-500'}`}>{s.roi}%</span>
                                    </td>
                                    <td className="px-10 py-6 text-center font-bold text-slate-600 text-sm">
                                        {s.fuelEfficiency} <span className="text-[10px] text-slate-400">KM/L</span>
                                    </td>
                                    <td className="px-10 py-6 text-right font-bold text-slate-800">${s.totalRevenue.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-right font-bold text-slate-500">${s.totalCost.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="bg-slate-50 px-4 py-2 rounded-xl font-black text-indigo-600 shadow-sm border border-slate-100">
                                            ${(s.totalRevenue - s.totalCost).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
