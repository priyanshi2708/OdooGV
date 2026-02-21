import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, X, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { vehicleService, analyticsService } from '../services/api';
// Assuming a maintenance service or similar. Using vehicleService for now.

const Maintenance = () => {
    const [vehicles, setVehicles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [cost, setCost] = useState(0);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            const { data } = await vehicleService.getVehicles();
            setVehicles(data);
        };
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logic for creating maintenance log would go here
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Maintenance Registry</h2>
                    <p className="text-slate-500 font-medium">Schedule and track fleet service logs</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all">
                    <Plus size={20} /> Add Service Log
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><AlertTriangle className="text-amber-500" size={24} /> Service Alerts</h3>
                    {vehicles.filter(v => v.odometer > 100000 && v.status !== 'InShop').map(v => (
                        <div key={v._id} className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                                <Wrench size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-slate-800">{v.name}</p>
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mt-1">Maintenance Overdue</p>
                            </div>
                            <button className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-all">Schedule</button>
                        </div>
                    ))}
                    {vehicles.filter(v => v.odometer > 100000 && v.status !== 'InShop').length === 0 && (
                        <div className="bg-green-50 border border-green-100 p-8 rounded-[2rem] text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-green-200">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-sm font-black text-green-800">All Fleet Healthy</p>
                            <p className="text-xs text-green-600 font-medium mt-1">Next scheduled check in 4 days</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2"><History className="text-indigo-500" size={24} /> Recent Service History</h3>
                    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-50">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-6 relative">
                                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center z-10 shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="flex-1 pb-8 border-b border-slate-50 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">Heavy Duty Oil Change & Filter</h4>
                                        <span className="text-xs font-bold text-slate-400">Oct {24 - i}, 2026</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">Complete fluid flush and replacement of all primary filters. Brake inspection conducted and pads found within tolerance.</p>
                                    <div className="flex gap-3">
                                        <span className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Truck #402</span>
                                        <span className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest">$450.00</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20} /></button>
                            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Record Maintenance</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Vehicle</label>
                                    <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none" required>
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                                    <input value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="E.g. Engine Overhaul" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Total Cost ($)</label>
                                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-100 transition-all font-bold">
                                    Update Registry
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Maintenance;
