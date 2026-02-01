import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const RadioContext = createContext();
const API_URL = '/api';

export const useRadio = () => useContext(RadioContext);

export const RadioProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [drivers, setDrivers] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [driverStats, setDriverStats] = useState({ earnings: 850, rides: 12 });

  // Restore session
  useEffect(() => {
    const stored = localStorage.getItem('namma_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u && u.name) {
             setUser(u);
             checkActiveRide(u.id); 
        } else {
             localStorage.removeItem('namma_user');
        }
      } catch (err) {
        console.error("Invalid session data", err);
        localStorage.removeItem('namma_user');
      }
    }
    fetchDrivers();
  }, []);

  // Poll for updates (Simulation of socket.io for simplicity)
  useEffect(() => {
      const interval = setInterval(() => {
          if (user) {
             checkActiveRide(user._id || user.id);
             if (user.role === 'driver') {
                 fetchPendingRequests();
             }
             fetchDrivers();
          }
      }, 3000);
      return () => clearInterval(interval);
  }, [user]);

  const fetchDrivers = async () => {
      try {
          const res = await fetch(`${API_URL}/auth/drivers`);
          const data = await res.json();
          if (Array.isArray(data)) {
            // Map mongo _id to id for frontend compatibility if needed, though better to use _id
            setDrivers(data.map(d => ({...d, id: d._id})));
          }
      } catch (e) { console.error("Failed to fetch drivers", e); }
  };

  const fetchPendingRequests = async () => {
      try {
          const res = await fetch(`${API_URL}/rides/pending`);
          const data = await res.json();
          setPendingRequests(data);
      } catch (e) { console.error(e); }
  };

  const checkActiveRide = async (userId) => {
      try {
          const res = await fetch(`${API_URL}/rides/active/${userId}`);
          if (res.ok) {
             const data = await res.json();
             if (data) {
                setActiveBooking(data);
             } else if (activeBooking && activeBooking.status === 'completed') {
                // Keep completed status until dismissed
             } else {
                setActiveBooking(null);
             }
          }

      } catch (e) { console.error(e); }
  };

  const login = async (name, role, email, phone, vehicleDetails = null) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role, email, phone, vehicleDetails })
        });
        const data = await res.json();
        
        if (res.ok) {
            const userData = { ...data, id: data._id };
            setUser(userData);
            localStorage.setItem('namma_user', JSON.stringify(userData));
            toast.success(`Welcome back, ${name}`);
        } else {
            toast.error(data.message || 'Login failed');
        }
    } catch (e) {
        toast.error('Server connection failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('namma_user');
    setActiveBooking(null);
  };

  const requestRide = async (from, to, vehicle = 'Auto', type = 'drop_off') => {
    if (!user) return;
    
    try {
        const res = await fetch(`${API_URL}/rides`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                passengerId: user.id || user._id,
                passengerName: user.name,
                passengerPhone: user.phone,
                from,
                to,
                vehicle,
                type
            })
        });
        const data = await res.json();
        if (res.ok) {
            setActiveBooking(data);
            toast.success("Booking Request Sent!");
        }
    } catch (e) {
        toast.error("Failed to book ride");
    }
  };

  const acceptRide = async (ride) => {
    try {
        const res = await fetch(`${API_URL}/rides/${ride._id || ride.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'accepted', 
                driverId: user.id || user._id,
                price: '₹40' // Mock price logic
            })
        });
        const data = await res.json();
        setActiveBooking(data);
        toast.success("Ride Accepted!");
        // Remove from pending locally immediately
        setPendingRequests(prev => prev.filter(r => (r._id || r.id) !== (ride._id || ride.id)));
    } catch (e) {
        toast.error("Failed to accept ride");
    }
  };

  const completeRide = async (finalPrice) => {
    if (!activeBooking) return;
    
    const amount = finalPrice ? parseInt(finalPrice.toString().replace(/[^0-9]/g, '')) : 0;
    
    try {
        const res = await fetch(`${API_URL}/rides/${activeBooking._id || activeBooking.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'completed', 
                price: `₹${amount}`
            })
        });
        const data = await res.json();
        
        setDriverStats(prev => ({
            earnings: prev.earnings + amount,
            rides: prev.rides + 1
        }));

        setActiveBooking(data);
        toast.success(`Ride Completed! ₹${amount} added.`);
    } catch (e) {
        toast.error("Failed to complete ride");
    }
  };

  const submitReview = (rating, review) => {
    toast.success("Thanks for your feedback!");
    setActiveBooking(null);
    // Here you would implement POST /api/reviews if needed
  };

  const cancelRide = async () => {
    if (!activeBooking) return;
    try {
         await fetch(`${API_URL}/rides/${activeBooking._id || activeBooking.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
        });
        setActiveBooking(null);
        toast.info("Ride cancelled.");
    } catch (e) {
        toast.error("Failed to cancel");
    }
  };

  const toggleStatus = async (status) => {
    if (user?.role !== 'driver') return;
    try {
        await fetch(`${API_URL}/auth/${user.id || user._id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        toast.info(`Status updated to: ${status}`);
        // Locally update status for UI responsiveness if needed
    } catch (e) {
        toast.error("Failed to update status");
    }
  };

  return (
    <RadioContext.Provider value={{
      user,
      drivers,
      activeBooking,
      pendingRequests,
      driverStats,
      login,
      logout,
      requestRide,
      toggleStatus,
      acceptRide,
      completeRide,
      submitReview,
      cancelRide,
      updateDriverStats: setDriverStats,
      setUser
    }}>
      {children}
    </RadioContext.Provider>
  );
};
