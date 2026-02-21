import { create } from 'zustand';

const getSafeUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

const useStore = create((set) => ({
    user: getSafeUser(),
    isAuthChecked: false,

    vehicles: [],
    drivers: [],
    trips: [],
    kpis: null,

    checkAuth: () => {
        const user = getSafeUser();
        set({ user, isAuthChecked: true });
    },

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },


    logout: () => {
        localStorage.removeItem('user');
        set({ user: null, vehicles: [], drivers: [], trips: [], kpis: null });
    },

    setVehicles: (vehicles) => set({ vehicles }),
    updateVehicle: (updatedVehicle) => set((state) => ({
        vehicles: state.vehicles.map(v => v._id === updatedVehicle._id ? updatedVehicle : v)
    })),

    setDrivers: (drivers) => set({ drivers }),
    updateDriver: (updatedDriver) => set((state) => ({
        drivers: state.drivers.map(d => d._id === updatedDriver._id ? updatedDriver : d)
    })),

    setTrips: (trips) => set({ trips }),
    addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
    updateTrip: (updatedTrip) => set((state) => ({
        trips: state.trips.map(t => t._id === updatedTrip._id ? updatedTrip : t)
    })),

    setKPIs: (kpis) => set({ kpis }),
}));

export default useStore;
