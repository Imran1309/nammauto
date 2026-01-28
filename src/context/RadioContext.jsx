import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const RadioContext = createContext();

export const useRadio = () => useContext(RadioContext);

export const RadioProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, role: 'driver' | 'user', id }
  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Raju Auto', status: 'offline', location: 'Bass stop', rating: 4.5 },
    { id: 'd2', name: 'Speedy Singh', status: 'online', location: 'Market', rating: 4.8 },
    { id: 'd3', name: 'Namma Anna', status: 'busy', location: 'Railway Stn', rating: 4.9 },
  ]);
  const [activeBooking, setActiveBooking] = useState(null);

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

  const login = (name, role, email, phone) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newUser = { id, name, role, email, phone };
    setUser(newUser);
    
    // If driver, add to drivers list if not exists (for simulation)
    if (role === 'driver') {
      setDrivers(prev => [...prev, { id, name, status: 'online', location: 'Unknown', rating: 5.0 }]);
    }
    
    localStorage.setItem('namma_user', JSON.stringify(newUser));
    toast.success(`Welcome back, ${name}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('namma_user');
    window.location.reload();
  };

  const requestRide = (from, to) => {
    if (!user || user.role !== 'user') return;
    
    // Find nearby driver (simulate)
    const availableDriver = drivers.find(d => d.status === 'online');
    
    const newBooking = {
      id: Date.now().toString(),
      passengerId: user.id,
      passengerName: user.name,
      from,
      to,
      status: 'pending',
      timestamp: new Date().toISOString(),
      driverId: null
    };
    
    setActiveBooking(newBooking);
    toast.loading("Broadcasting request to nearby autos...");

    // Simulate "Radio" connection delay
    setTimeout(() => {
      if (availableDriver) {
        // Assign to driver
        const updatedBooking = { ...newBooking, driverId: availableDriver.id, status: 'accepted' };
        setActiveBooking(updatedBooking);
        
        // Notify Driver (if we were logging in as them, but here we simulate the system)
        sendEmail('driver@nammaauto.com', 'New Ride Request', `Pick up ${user.name} from ${from}`);
        sendEmail('user@nammaauto.com', 'Ride Confirmed', `Driver ${availableDriver.name} is on the way!`);
        
        toast.dismiss();
        toast.success(`Connected to ${availableDriver.name}! 🛺`);
      } else {
        toast.dismiss();
        toast.error("No drivers nearby. Try again.");
        setActiveBooking(null);
      }
    }, 3000);
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
      login,
      logout,
      requestRide,
      toggleStatus,
      setUser // exposed for quick toggle if needed
    }}>
      {children}
    </RadioContext.Provider>
  );
};
