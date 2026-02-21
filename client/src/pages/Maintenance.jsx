import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, X, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { vehicleService, maintenanceService } from '../services/api';

const Maintenance = () => {
    const [vehicles, setVehicles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        vehicleId: '',
        serviceType: '',
        cost: 0,
        notes: ''
    });

    const fetchData = async () => {
        const vRes = await vehicleService.getVehicles();
        const lRes = await maintenanceService.getMaintenanceLogs();
        setVehicles(vRes.data);
        setLogs(lRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await maintenanceService.createMaintenance(formData);
        setIsModalOpen(false);
        setFormData({ vehicleId: '', serviceType: '', cost: 0, notes: '' });
        fetchData();
    };

    // 🔥 ALERT LOGIC
    const overdueVehicles = vehicles.filter(v => {
        const kmSinceService = v.odometer - (v.lastServiceOdometer || 0);
        return kmSinceService >= v.serviceInterval;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Maintenance Registry
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Schedule and track fleet service logs
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
                >
                    <Plus size={20} /> Add Service Log
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ALERT SECTION */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={24} />
                        Service Alerts
                    </h3>

                    {overdueVehicles.length > 0 ? (
                        overdueVehicles.map(v => (
                            <div key={v._id} className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-5">
                                <Wrench className="text-amber-600" />
                                <div>
                                    <p className="font-bold">{v.name}</p>
                                    <p className="text-xs text-amber-600 font-bold">
                                        Maintenance Overdue
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-green-50 border border-green-100 p-8 rounded-[2rem] text-center">
                            <CheckCircle2 size={32} className="mx-auto text-green-600 mb-2" />
                            <p className="text-sm font-black text-green-800">
                                All Fleet Healthy
                            </p>
                        </div>
                    )}
                </div>

                {/* HISTORY SECTION */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                        <History className="text-indigo-500" size={24} />
                        Recent Service History
                    </h3>

                    <div className="space-y-6">
                        {logs.map(log => (
                            <div key={log._id} className="border-b pb-6">
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-slate-800">
                                        {log.serviceType}
                                    </h4>
                                    <span className="text-xs text-slate-400">
                                        {new Date(log.serviceDate).toDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">
                                    {log.notes}
                                </p>
                                <div className="flex gap-4 mt-2 text-xs font-bold">
                                    <span>{log.vehicle?.name}</span>
                                    <span className="text-indigo-600">
                                        ${log.cost}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center"
                    >
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="float-right"
                            >
                                <X />
                            </button>

                            <h3 className="text-xl font-bold mb-6">
                                Record Maintenance
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <select
                                    required
                                    className="w-full border p-3 rounded-xl"
                                    onChange={(e) =>
                                        setFormData({ ...formData, vehicleId: e.target.value })
                                    }
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    required
                                    placeholder="Service Type"
                                    className="w-full border p-3 rounded-xl"
                                    onChange={(e) =>
                                        setFormData({ ...formData, serviceType: e.target.value })
                                    }
                                />

                                <input
                                    type="number"
                                    required
                                    placeholder="Cost"
                                    className="w-full border p-3 rounded-xl"
                                    onChange={(e) =>
                                        setFormData({ ...formData, cost: e.target.value })
                                    }
                                />

                                <textarea
                                    placeholder="Notes"
                                    className="w-full border p-3 rounded-xl"
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                />

                                <button className="w-full bg-black text-white py-3 rounded-xl">
                                    Save
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Maintenance;