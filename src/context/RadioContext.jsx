import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const RadioContext = createContext();

export const useRadio = () => useContext(RadioContext);

export const RadioProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, role: 'driver' | 'user', id }
  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Raju Auto', status: 'offline', location: 'Bass stop', rating: 4.5, phone: '98765 11111', vehicle: 'Auto' },
    { id: 'd2', name: 'Speedy Singh', status: 'online', location: 'Market', rating: 4.8, phone: '98765 22222', vehicle: 'Auto' },
    { id: 'd3', name: 'Namma Anna', status: 'busy', location: 'Railway Stn', rating: 4.9, phone: '98765 33333', vehicle: 'Auto' },
  ]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [driverStats, setDriverStats] = useState({ earnings: 850, rides: 12 }); // Initial mock stats

  // Restore session on load
  useEffect(() => {
    const stored = localStorage.getItem('namma_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Email simulation
  const sendEmail = (to, subject, body) => {
    console.log(`[EMAIL SIMULATION] To: ${to}, Subject: ${subject}, Body: ${body}`);
    toast.success(`Email sent to ${to}: ${subject}`);
  };

  const login = (name, role, email, phone, vehicleDetails = null) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newUser = { id, name, role, email, phone, vehicleDetails };
    
    // If driver, add to drivers list with verified status
    if (role === 'driver') {
      const vehicleInfo = vehicleDetails ? `${vehicleDetails.type}${vehicleDetails.subType ? ` (${vehicleDetails.subType})` : ''}` : 'Auto';
      setDrivers(prev => [...prev, { 
         id, 
         name, 
         status: 'online', 
         location: 'Unknown', 
         rating: 5.0, 
         vehicle: vehicleInfo
      }]);
    }
    
    setUser(newUser);
    localStorage.setItem('namma_user', JSON.stringify(newUser));
    toast.success(`Welcome back, ${name}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('namma_user');
  };

  const requestRide = (from, to, vehicle = 'Auto', type = 'drop_off') => {
    if (!user) return;
    
    // Create new booking
    const newBooking = {
      id: Date.now().toString(),
      passengerId: user.id,
      passengerName: user.name,
      from,
      to,
      vehicle,
      type,
      status: 'pending',
      timestamp: new Date().toISOString(),
      driverId: null
    };
      
    setActiveBooking(newBooking);
    setPendingRequests(prev => [newBooking, ...prev]);
    toast.success("Booking Successful! Finding nearby drivers...");
    
    // Simulate "Radio" connection - waiting for driver to accept
    // Auto-accept removed to allow manual driver testing
    /* 
    setTimeout(() => {
       const driver = drivers.find(d => d.status === 'online') || drivers[1]; // Fallback to Speedy Singh
       const acceptedBooking = { 
          ...newBooking, 
          status: 'accepted', 
          driverId: driver.id,
          price: '₹' + (Math.floor(Math.random() * 40) + 40) // Add a random price
       };
       setActiveBooking(acceptedBooking);
       setPendingRequests(prev => prev.filter(r => r.id !== newBooking.id));
       toast.success(`Driver ${driver.name} accepted your ride!`);
    }, 3000); 
    */
  };

  const acceptRide = (ride) => {
    setActiveBooking({ ...ride, status: 'accepted', driverId: user?.id });
    setPendingRequests(prev => prev.filter(r => r.id !== ride.id));
    toast.success("Ride Accepted! Head to pickup location.");
  };

  const completeRide = (finalPrice) => {
    let amount = 0;
    
    if (finalPrice) {
       amount = parseInt(finalPrice.toString().replace(/[^0-9]/g, '')) || 0;
    } else if (activeBooking && activeBooking.price) {
       amount = parseInt(activeBooking.price.replace(/[^0-9]/g, '')) || 0;
    }

    setDriverStats(prev => ({
       earnings: prev.earnings + amount,
       rides: prev.rides + 1
    }));

    toast.success(`Ride Completed! ₹${amount} added.`);
    // Don't clear immediately, wait for user review
    setActiveBooking(prev => ({ ...prev, status: 'completed', finalPrice: amount }));
  };

  const submitReview = (rating, review) => {
    toast.success("Thanks for your feedback!");
    setActiveBooking(null);
  };


  const cancelRide = () => {
    setActiveBooking(null);
    toast.info("Ride cancelled.");
  };

  // For Driver Dashboard
  const toggleStatus = (status) => {
    if (user?.role !== 'driver') return;
    setDrivers(prev => prev.map(d => d.id === user.id ? { ...d, status } : d));
    toast.info(`Status updated to: ${status}`);
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
      setUser // exposed for quick toggle if needed
    }}>
      {children}
    </RadioContext.Provider>
  );
};
