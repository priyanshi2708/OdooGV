import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Star, MoreVertical, X, Phone, Mail } from 'lucide-react';
import { driverService } from '../services/api';
import useStore from '../store/useStore';

const DriverForm = ({ onClose, driver = null }) => {
    const [formData, setFormData] = useState(driver || {
        name: '',
        licenseNumber: '',
        licenseCategory: '',
        licenseExpiryDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (driver) {
                await driverService.updateDriver(driver._id, formData);
            } else {
                await driverService.createDriver(formData);
            }
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
                <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20} /></button>
                <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{driver ? 'Edit Driver' : 'Hire New Driver'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="E.g. John Doe" required />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">License No.</label>
                            <input value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="DL-XXXX" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <input value={formData.licenseCategory} onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Heavy Duty" required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">License Expiry</label>
                        <input type="date" value={formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all font-bold">
                        {driver ? 'Update Profile' : 'Complete Hiring'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Drivers = () => {
    const { drivers, setDrivers } = useStore();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredDrivers = drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="animate-pulse flex items-center justify-center p-20 text-slate-400 font-bold">Loading Driver Records...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Driver Performance</h2>
                    <p className="text-slate-500 font-medium">{drivers.length} active fleet personnel</p>
                </div>
                <button onClick={() => { setEditingDriver(null); setIsFormOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all">
                    <Plus size={20} /> Hire Personnel
                </button>
            </div>

            {filteredDrivers.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium text-lg">No drivers found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {filteredDrivers.map((d) => (
                        <motion.div
                            key={d._id} layout
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 translate-x-12 translate-y-[-40px] rotate-45 opacity-5 ${d.status === 'OnTrip' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>

                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-2xl border border-slate-100">
                                    {d.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{d.name}</h3>
                                    <p className="text-xs font-bold text-indigo-500 tracking-widest uppercase">ID: {d.licenseNumber}</p>
                                </div>
                                <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === 'OnTrip' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                    {d.status}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-slate-400">Safety Score</span>
                                    <span className="text-slate-800 font-black">{d.safetyScore}/100</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${d.safetyScore}%` }}
                                        className={`h-full ${d.safetyScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trip Completion</p>
                                        <p className="text-lg font-black text-slate-800">{d.tripCompletionRate}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">License Expr.</p>
                                        <p className={`text-lg font-black ${new Date(d.licenseExpiryDate) < new Date() ? 'text-red-500' : 'text-slate-800'}`}>
                                            {new Date(d.licenseExpiryDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingDriver(d); setIsFormOpen(true); }}
                                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all text-xs"
                                    >
                                        View Details
                                    </button>
                                    <button className="bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-500 p-3 rounded-xl transition-all">
                                        <Star size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && <DriverForm onClose={() => setIsFormOpen(false)} driver={editingDriver} />}
            </AnimatePresence>
        </div>
    );
};

export default Drivers;
