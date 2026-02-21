import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Navigation, CheckCircle2, X, Clock, MapPin } from 'lucide-react';
import { tripService, vehicleService, driverService } from '../services/api';
import { Truck } from "lucide-react";
import useStore from '../store/useStore';

const Trips = () => {
    const { trips, setTrips, setVehicles, setDrivers } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔥 Fetch Data
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

    useEffect(() => {
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="animate-pulse flex items-center justify-center p-20 text-slate-400 font-bold">
                Coordinating Logistics...
            </div>
        );

    // 🚛 Dispatch Trip
    const handleDispatch = async (id) => {
        try {
            await tripService.dispatchTrip(id);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    // ✅ Complete Trip
    const handleComplete = async (id) => {
        try {
            await tripService.completeTrip(id, {
                endOdometer: 15000,   // you can replace later with modal input
                fuelUsed: 40,
                fuelCost: 4000
            });
            fetchData();
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
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Trip Dispatcher
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Manage active logistics and routing
                    </p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-500 transition-all"
                >
                    <Plus size={20} /> Create New Trip
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {trips.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                        <Truck size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium text-lg">
                            No active trips scheduled.
                        </p>
                    </div>
                ) : (
                    trips.map((trip) => (
                        <motion.div
                            key={trip._id}
                            layout
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-10"
                        >
                            <div className="flex-1 min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 bg-slate-50 text-slate-600">
                                        {statusIcons[trip.status]} {trip.status}
                                    </span>
                                </div>

                                <h4 className="font-black text-slate-800 uppercase">
                                    {trip.vehicle?.name}
                                </h4>
                                <p className="text-xs font-bold text-slate-400">
                                    {trip.driver?.name}
                                </p>
                            </div>

                            <div className="flex-1 text-center">
                                <p className="text-sm font-black text-slate-800">
                                    {trip.origin} → {trip.destination}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {trip.cargoWeight}kg / ${trip.revenue}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {trip.status === 'Draft' && (
                                    <button
                                        onClick={() => handleDispatch(trip._id)}
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all"
                                    >
                                        Dispatch
                                    </button>
                                )}

                                {trip.status === 'Dispatched' && (
                                    <button
                                        onClick={() => handleComplete(trip._id)}
                                        className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-500 transition-all"
                                    >
                                        Complete Trip
                                    </button>
                                )}

                                {trip.status === 'Completed' && (
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <div>Trip Form Here</div>  // keep your existing TripForm component
                )}
            </AnimatePresence>
        </div>
    );
};

export default Trips;