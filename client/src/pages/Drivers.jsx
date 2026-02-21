import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Star,
    X,
    Users
} from 'lucide-react';
import { driverService } from '../services/api';
import useStore from '../store/useStore';

const DriverForm = ({ onClose, driver = null }) => {
    const [formData, setFormData] = useState(
        driver || {
            name: '',
            licenseNumber: '',
            licenseCategory: '',
            licenseExpiryDate: ''
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (driver) {
                await driverService.updateDriver(driver._id, formData);
            } else {
                await driverService.createDriver(formData);
            }
            onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
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
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                    <X size={20} />
                </button>

                <h3 className="text-2xl font-black text-slate-800 mb-8">
                    {driver ? 'Edit Driver' : 'Hire New Driver'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-slate-50 border rounded-2xl py-3 px-4"
                        required
                    />

                    <input
                        placeholder="License Number"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                licenseNumber: e.target.value
                            })
                        }
                        className="w-full bg-slate-50 border rounded-2xl py-3 px-4"
                        required
                    />

                    <input
                        placeholder="License Category"
                        value={formData.licenseCategory}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                licenseCategory: e.target.value
                            })
                        }
                        className="w-full bg-slate-50 border rounded-2xl py-3 px-4"
                        required
                    />

                    <input
                        type="date"
                        value={
                            formData.licenseExpiryDate
                                ? new Date(formData.licenseExpiryDate)
                                    .toISOString()
                                    .split('T')[0]
                                : ''
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                licenseExpiryDate: e.target.value
                            })
                        }
                        className="w-full bg-slate-50 border rounded-2xl py-3 px-4"
                        required
                    />

                    <button className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold">
                        {driver ? 'Update' : 'Hire Driver'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Drivers = () => {
    const { drivers, setDrivers } = useStore();
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const { data } = await driverService.getDrivers();
                setDrivers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, [setDrivers]);

    if (loading)
        return (
            <div className="p-20 text-center font-bold text-slate-400">
                Loading Drivers...
            </div>
        );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">
                        Driver Performance
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {drivers.length} active fleet personnel
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingDriver(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
                >
                    <Plus size={20} /> Hire Personnel
                </button>
            </div>

            {drivers.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400 font-medium">
                        No drivers available.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {drivers.map((d) => (
                        <motion.div
                            key={d._id}
                            layout
                            className="bg-white p-8 rounded-3xl shadow border"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black text-slate-800">
                                    {d.name}
                                </h3>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${d.status === 'OnTrip'
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-green-100 text-green-600'
                                        }`}
                                >
                                    {d.status || 'Available'}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 mb-2">
                                License: {d.licenseNumber}
                            </p>

                            <p
                                className={`text-sm font-bold ${new Date(d.licenseExpiryDate) < new Date()
                                    ? 'text-red-500'
                                    : 'text-slate-600'
                                    }`}
                            >
                                Expiry:{' '}
                                {new Date(
                                    d.licenseExpiryDate
                                ).toLocaleDateString()}
                            </p>

                            <button
                                onClick={() => {
                                    setEditingDriver(d);
                                    setIsFormOpen(true);
                                }}
                                className="mt-4 w-full bg-slate-100 hover:bg-slate-200 py-2 rounded-xl text-sm font-bold"
                            >
                                Edit Driver
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <DriverForm
                        onClose={() => setIsFormOpen(false)}
                        driver={editingDriver}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Drivers;