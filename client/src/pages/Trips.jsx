import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Navigation, CheckCircle2, X, AlertCircle, Clock, MapPin } from 'lucide-react';
import { tripService, vehicleService, driverService } from '../services/api';
import useStore from '../store/useStore';

const TripForm = ({ onClose }) => {
    const { vehicles, drivers } = useStore();
    const [formData, setFormData] = useState({
        vehicleId: '',
        driverId: '',
        cargoWeight: 0,
        origin: '',
        destination: '',
        revenue: 0,
        startOdometer: 0
    });
    const [error, setError] = useState('');

    const availableVehicles = vehicles.filter(v => v.status === 'Available');
    const availableDrivers = drivers.filter(d => d.status === 'OnDuty');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await tripService.createTrip(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create trip');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20} /></button>
                <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">New Trip Dispatch</h3>
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Vehicle</label>
                            <select
                                value={formData.vehicleId}
                                onChange={(e) => {
                                    const v = vehicles.find(veh => veh._id === e.target.value);
                                    setFormData({ ...formData, vehicleId: e.target.value, startOdometer: v ? v.odometer : 0 });
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none" required
                            >
                                <option value="">Select Available Vehicle</option>
                                {availableVehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.licensePlate}) - Cap: {v.maxLoadCapacity}kg</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Driver</label>
                            <select value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none" required>
                                <option value="">Select On-Duty Driver</option>
                                {availableDrivers.map(d => <option key={d._id} value={d._id}>{d.name} (Score: {d.safetyScore})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Origin</label>
                            <input value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="E.g. Port of Los Angeles" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                            <input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="E.g. Chicago Warehouse" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo Weight (KG)</label>
                            <input type="number" value={formData.cargoWeight} onChange={(e) => setFormData({ ...formData, cargoWeight: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Revenue ($)</label>
                            <input type="number" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all font-bold">
                        Create Trip Log
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Trips = () => {
    const { trips, setTrips, vehicles, drivers, setVehicles, setDrivers } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, vRes, dRes] = await Promise.all([
                    tripService.getTrips(),
                    vehicleService.getVehicles(),
                    driverService.getDrivers()
                ]);
                setTrips(tRes.data);
                setVehicles(vRes.data);
                setDrivers(dRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setTrips, setVehicles, setDrivers]);

    if (loading) return <div className="animate-pulse flex items-center justify-center p-20 text-slate-400 font-bold">Coordinating Logistics...</div>;

    const handleDispatch = async (id) => {
        try {
            await tripService.dispatchTrip(id);
        } catch (err) {
            console.error(err);
        }
    };


    const statusIcons = {
        Draft: <Clock className="text-slate-400" size={16} />,
        Dispatched: <Navigation className="text-indigo-500 animate-pulse" size={16} />,
        Completed: <CheckCircle2 className="text-green-500" size={16} />,
        Cancelled: <X className="text-red-500" size={16} />,
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Trip Dispatcher</h2>
                    <p className="text-slate-500 font-medium">Manage active logistics and routing</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all">
                    <Plus size={20} /> Create New Trip
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {trips.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                        <Truck size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium text-lg">No active trips scheduled. Create one above to begin.</p>
                    </div>
                ) : (
                    trips.map((trip) => (

                        <motion.div
                            key={trip._id} layout
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-10 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                        >
                            <div className="flex-1 min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${trip.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-600' : trip.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {statusIcons[trip.status]} {trip.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-300">#{trip._id.slice(-6)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <Truck size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{trip.vehicle?.name || 'Loading...'}</h4>
                                        <p className="text-xs font-bold text-slate-400">{trip.driver?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-[300px] flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><MapPin size={10} /> Origin</p>
                                    <p className="text-sm font-black text-slate-800">{trip.origin}</p>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <div className="h-[2px] flex-1 bg-slate-100 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><MapPin size={10} /> Destination</p>
                                    <p className="text-sm font-black text-slate-800">{trip.destination}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 min-w-[200px] justify-between lg:justify-end flex-1">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payload / Revenue</p>
                                    <p className="text-base font-black text-slate-800">{trip.cargoWeight}kg / <span className="text-indigo-600">${trip.revenue}</span></p>
                                </div>

                                {trip.status === 'Draft' ? (
                                    <button
                                        onClick={() => handleDispatch(trip._id)}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                                    >
                                        Dispatch
                                    </button>
                                ) : trip.status === 'Dispatched' ? (
                                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-slate-100">
                                        Update Log
                                    </button>
                                ) : (
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {isFormOpen && <TripForm onClose={() => setIsFormOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Trips;
