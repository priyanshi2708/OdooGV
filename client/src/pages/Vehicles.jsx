import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, X } from 'lucide-react';
import { vehicleService } from '../services/api';
import useStore from '../store/useStore';

const StatusBadge = ({ status }) => {
    const colors = {
        Available: 'bg-green-100 text-green-700',
        OnTrip: 'bg-amber-100 text-amber-700',
        InShop: 'bg-red-100 text-red-700',
        Retired: 'bg-slate-100 text-slate-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
};

const VehicleForm = ({ onClose, vehicle = null }) => {
    const { vehicles, setVehicles } = useStore();

    const [formData, setFormData] = useState(vehicle || {
        name: '',
        model: '', // ✅ REQUIRED
        licensePlate: '',
        vehicleType: 'Truck',
        maxLoadCapacity: '',
        acquisitionCost: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                maxLoadCapacity: Number(formData.maxLoadCapacity),
                acquisitionCost: Number(formData.acquisitionCost),
            };

            if (vehicle) {
                const updatedVehicle = await vehicleService.updateVehicle(vehicle._id, payload);
                setVehicles(vehicles.map(v => v._id === updatedVehicle._id ? updatedVehicle : v));
            } else {
                const newVehicle = await vehicleService.createVehicle(payload);
                setVehicles([newVehicle, ...vehicles]);
            }

            onClose();
        } catch (err) {
            console.error("Vehicle Error:", err.response?.data || err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-all">
                    <X size={20} className="text-slate-400" />
                </button>

                <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">
                    {vehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">

                        {/* Vehicle Name */}
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Vehicle Name
                            </label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                required
                            />
                        </div>

                        {/* ✅ Model Field */}
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Model
                            </label>
                            <input
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Type
                            </label>
                            <select
                                value={formData.vehicleType}
                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            >
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>

                        {/* License Plate */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                License Plate
                            </label>
                            <input
                                value={formData.licensePlate}
                                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Capacity */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Capacity (KG)
                            </label>
                            <input
                                type="number"
                                value={formData.maxLoadCapacity}
                                onChange={(e) => setFormData({ ...formData, maxLoadCapacity: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Acquisition Cost */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Acquisition Cost
                            </label>
                            <input
                                type="number"
                                value={formData.acquisitionCost}
                                onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all"
                    >
                        {vehicle ? 'Save Changes' : 'Register Vehicle'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Vehicles = () => {
    const { vehicles, setVehicles } = useStore();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await vehicleService.getVehicles();
                setVehicles(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, [setVehicles]);

    const filteredVehicles = vehicles.filter(
        v =>
            v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Vehicle Registry
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {vehicles.length} vehicles currently registered
                    </p>
                </div>

                <button
                    onClick={() => { setEditingVehicle(null); setIsFormOpen(true); }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
                >
                    <Plus size={20} /> Register Vehicle
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Vehicle</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Plate No.</th>
                                <th className="px-8 py-5">Odometer</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredVehicles.map((v) => (
                                <tr key={v._id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6 font-bold text-slate-800">
                                        {v.name}
                                        <br />
                                        <span className="text-xs text-slate-400 font-medium">
                                            {v.model}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">{v.vehicleType}</td>
                                    <td className="px-8 py-6 font-mono text-indigo-600">
                                        {v.licensePlate}
                                    </td>
                                    <td className="px-8 py-6">
                                        {(v.odometer || 0).toLocaleString()} KM
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={v.status} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => { setEditingVehicle(v); setIsFormOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <VehicleForm
                        onClose={() => setIsFormOpen(false)}
                        vehicle={editingVehicle}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vehicles;