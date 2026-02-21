import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',

});

api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch (e) {
        // Continue without auth header if parsing fails
    }
    return config;
});


export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
};

export const vehicleService = {
    getVehicles: () => api.get('/vehicles'),
    createVehicle: (data) => api.post('/vehicles', data),
    updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
    deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
};

export const driverService = {
    getDrivers: () => api.get('/drivers'),
    createDriver: (data) => api.post('/drivers', data),
    updateDriver: (id, data) => api.put(`/drivers/${id}`, data),
};

export const tripService = {
    getTrips: () => api.get('/trips'),
    createTrip: (data) => api.post('/trips', data),
    dispatchTrip: (id) => api.put(`/trips/${id}/dispatch`),
    completeTrip: (id, data) => api.put(`/trips/${id}/complete`, data),
};

export const analyticsService = {
    getKPIs: () => api.get('/analytics/kpis'),
    getVehicleStats: () => api.get('/analytics/vehicle-stats'),
};

export default api;
