import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

const useSocket = () => {
    const { updateVehicle, updateDriver, updateTrip, addTrip } = useStore();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

        socket.on('vehicleStatusUpdate', (data) => {
            updateVehicle(data);
        });

        socket.on('driverStatusUpdate', (data) => {
            updateDriver(data);
        });

        socket.on('newTrip', (data) => {
            addTrip(data);
        });

        socket.on('tripStatusUpdate', (data) => {
            updateTrip(data);
        });

        socket.on('maintenanceAlert', (data) => {
            // Handle alert, maybe a toast
            console.log('Maintenance Alert:', data);
        });

        return () => {
            socket.disconnect();
        };
    }, [updateVehicle, updateDriver, updateTrip, addTrip]);
};

export default useSocket;
