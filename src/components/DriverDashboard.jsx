import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { Power, MapPin, CheckCircle, Bell, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const { user, logout, activeBooking, toggleStatus, drivers, acceptRide, completeRide, driverStats, updateDriverStats, pendingRequests } = useRadio();
  const navigate = useNavigate();
  const myStatus = drivers.find(d => d.id === user.id)?.status || 'online';
  
  const [editingStats, setEditingStats] = useState(false);
  const [tempStats, setTempStats] = useState({ earnings: 0, rides: 0 });
  const [manualAmount, setManualAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const handleAddMoney = () => {
    if (!manualAmount) return;
    const amount = parseInt(manualAmount) || 0;
    updateDriverStats({
      earnings: (driverStats?.earnings || 0) + amount,
      rides: (driverStats?.rides || 0) + 1
    });
    setManualAmount('');
    setShowAddMoney(false);
  };

  const [currentRidePrice, setCurrentRidePrice] = useState('');

  useEffect(() => {
     if (activeBooking?.price) {
        setCurrentRidePrice(activeBooking.price.replace(/[^0-9]/g, ''));
     }
  }, [activeBooking]);

  const handleEditStats = () => {
    setTempStats({ earnings: driverStats?.earnings || '', rides: driverStats?.rides || '' });
    setEditingStats(true);
  };

  const handleSaveStats = () => {
    updateDriverStats({
      earnings: parseInt(tempStats.earnings) || 0,
      rides: parseInt(tempStats.rides) || 0
    });
    setEditingStats(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[--font-body]">
      {/* Top Bar */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[--app-primary] flex items-center justify-center font-bold text-xl shadow-md">🛺</div>
            <div>
               <h1 className="font-[--font-display] font-bold text-lg leading-tight">Partner App</h1>
               <div className="text-xs text-green-600 font-bold bg-green-100 px-2 rounded-full inline-block">● {myStatus}</div>
            </div>
         </div>
         <button onClick={logout} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Power size={20} className="text-gray-600" />
         </button>
      </header>
      
      {/* Map Placeholder */}
      <div className="h-[30vh] bg-gray-300 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Mapbox_Layer_2.png')] bg-cover opacity-50 grayscale" />
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-[--app-primary] rounded-full border-4 border-white shadow-lg animate-pulse ring-4 ring-[--app-primary]/20" />
         </div>
      </div>

      <div className="-mt-6 relative z-10 px-4 pb-20">
         {/* Status Toggles */}
         <div className="bg-white p-2 rounded-xl shadow-lg flex mb-6">
            {['online', 'busy', 'offline'].map((status) => (
               <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm capitalize transition-all ${
                     myStatus === status 
                     ? 'bg-black text-white shadow-md' 
                     : 'text-gray-500 hover:bg-gray-50'
                  }`}
               >
                  {status}
               </button>
            ))}
         </div>

          {/* Add Manual Amount Section */}
          {!activeBooking && (
            <div className="mb-6">
               {!showAddMoney ? (
                 <button 
                   onClick={() => setShowAddMoney(true)}
                   className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
                 >
                   <span>➕</span> Add Offline Ride Amount
                 </button>
               ) : (
                 <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Enter Ride Amount (₹)</label>
                    <div className="flex gap-2">
                       <input 
                          type="number" 
                          value={manualAmount} 
                          onChange={e => setManualAmount(e.target.value)}
                          placeholder="e.g. 50"
                          className="flex-1 bg-gray-100 text-black rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-[--app-primary]"
                          autoFocus
                       />
                       <button 
                         onClick={handleAddMoney}
                         className="px-6 bg-black text-white rounded-lg font-bold"
                       >
                         Add
                       </button>
                    </div>
                    <button 
                      onClick={() => setShowAddMoney(false)}
                      className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* Today's Stats */}
          {!activeBooking && (
             <div className="mb-6 relative group">
                {editingStats ? (
                   <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Earnings (₹)</label>
                            <input 
                               type="number" 
                               value={tempStats.earnings} 
                               onChange={e => setTempStats({...tempStats, earnings: e.target.value})}
                               className="w-full bg-gray-100 text-black rounded-lg p-2 font-bold text-lg outline-none focus:ring-2 focus:ring-[--app-primary]"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Rides</label>
                            <input 
                               type="number" 
                               value={tempStats.rides} 
                               onChange={e => setTempStats({...tempStats, rides: e.target.value})}
                               className="w-full bg-gray-100 text-black rounded-lg p-2 font-bold text-lg outline-none focus:ring-2 focus:ring-[--app-primary]"
                            />
                         </div>
                      </div>
                      <button onClick={handleSaveStats} className="w-full py-2 bg-black text-white rounded-lg font-bold text-sm">Save Changes</button>
                   </div>
                ) : (
                   <div className="grid grid-cols-2 gap-4 cursor-pointer" onClick={handleEditStats}>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[--app-primary] transition-colors relative">
                         <div className="text-gray-400 text-xs font-bold uppercase mb-1">Today's Earnings</div>
                         <div className="text-2xl font-[--font-display] font-bold text-gray-800">₹{driverStats?.earnings || 0}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[--app-primary] transition-colors">
                         <div className="text-gray-400 text-xs font-bold uppercase mb-1">Rides</div>
                         <div className="text-2xl font-[--font-display] font-bold text-gray-800">{driverStats?.rides || 0}</div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded shadow pointer-events-none">Click to Edit</div>
                   </div>
                )}
             </div>
          )}
         
         <AnimatePresence mode="wait">
            {activeBooking && activeBooking.status !== 'completed' ? (
               <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden border-2 border-[--app-primary]"
               >
                  <div className="bg-[--app-primary] px-6 py-4 flex justify-between items-center text-black">
                     <span className="font-bold flex items-center gap-2">
                        <Bell className="animate-wiggle" size={18} /> New Request
                     </span>
                     <span className="bg-black/10 px-2 py-1 rounded text-xs font-bold">45s left</span>
                  </div>
                  
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-lg">₹</span>
                              <input 
                                 type="number"
                                 value={currentRidePrice}
                                 onChange={e => setCurrentRidePrice(e.target.value)}
                                 className="w-32 pl-8 py-2 bg-gray-100 text-black rounded-xl font-[--font-display] font-bold text-3xl outline-none focus:ring-2 focus:ring-[--app-primary]"
                              />
                              {activeBooking.price && activeBooking.price.replace(/[^0-9]/g, '') !== currentRidePrice && (
                                 <div className="absolute top-[-20px] left-0 text-sm text-red-500 font-bold line-through">
                                    Old: {activeBooking.price}
                                 </div>
                              )}
                           </div>
                           <div className="text-gray-400 text-xs font-bold mt-1">Cash Payment (Edit)</div>
                        </div>
                        <div className="text-right">
                           <div className="text-xl font-bold text-gray-800">2.5 km</div>
                           <div className="text-gray-400 text-xs font-bold">Total Dist</div>
                        </div>
                     </div>

                     <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2">
                        <div className="relative">
                           <div className="absolute -left-[23px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                           <div className="text-xs text-gray-400 font-bold uppercase">Pickup</div>
                           <div className="text-lg font-bold text-gray-800">{activeBooking.from}</div>
                           <div className="text-sm text-gray-500">2 mins away</div>
                        </div>
                        <div className="relative">
                           <div className="absolute -left-[23px] top-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                           <div className="text-xs text-gray-400 font-bold uppercase">Drop</div>
                           <div className="text-lg font-bold text-gray-800">{activeBooking.to}</div>
                        </div>
                     </div>

                     {/* Ride Details */}
                     <div className="flex gap-2 mt-4">
                        <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase">
                           {activeBooking.vehicle || 'Auto'}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase">
                           {activeBooking.type?.replace('_', ' ') || 'Drop Off'}
                        </div>
                     </div>

                     <div className="mt-8 pt-4 border-t border-gray-100">
                        {activeBooking.status === 'accepted' ? (
                           <button 
                              onClick={() => completeRide(currentRidePrice)}
                              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg active:scale-95 transition-all"
                           >
                              <CheckCircle /> Complete Ride (₹{currentRidePrice})
                           </button>
                        ) : (
                           <button className="w-full py-4 bg-black text-white rounded-xl font-[--font-display] font-bold text-xl shadow-lg active:scale-95 transition-transform">
                              Accept Ride
                           </button>
                        )}
                     </div>
                  </div>
               </motion.div>
            ) : (

               <div className="space-y-4">
                  <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2 px-2">Nearby Requests ({drivers.find(d => d.id === user.id)?.vehicle || 'Auto'})</h3>
                  {[
                     ...pendingRequests.map(req => ({
                        id: req.id,
                        name: req.passengerName, 
                        phone: '98765 00000', 
                        pickup: req.from,
                        drop: req.to,
                        dist: '0.5 km', 
                        price: req.price || '₹' + (Math.floor(Math.random() * 50) + 40), 
                        vehicle: req.vehicle, 
                        type: req.type
                     })),
                     { id: 'm1', name: 'Priya S', phone: '98765 12345', pickup: 'Fairlands Main Rd', drop: 'New Bus Stand', dist: '0.8 km', price: '₹50', vehicle: 'Auto' },
                     { id: 'm2', name: 'Karthik R', phone: '98765 67890', pickup: 'Junction Station', drop: 'AVR Roundana', dist: '2.1 km', price: '₹85', vehicle: 'Auto' },
                     { id: 'm3', name: 'Sarah M', phone: '99887 77665', pickup: 'Sarada College', drop: 'Omalur Toll', dist: '1.5 km', price: '₹65', vehicle: 'Bike' }
                  ]
                  .filter(req => {
                     const myVehicle = drivers.find(d => d.id === user.id)?.vehicle || 'Auto';
                     // Simple inclusion check to handle "Car (SUV)" matching "Car" if we wanted, 
                     // but for now strict equality based on user request is best or exact string match.
                     // The user request produces "Car (Mini)" and driver has "Car (Mini)".
                     
                     if (!req.vehicle) return true; // Show if no vehicle specified (fallback)
                     return req.vehicle === myVehicle;
                  })
                  .map((req) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={req.id} 
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                 {req.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-gray-800">{req.name}</div>
                                 <div className="text-xs text-gray-500 font-bold">{req.dist} away</div>
                                 <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                                    <span>📞</span> {req.phone}
                                 </div>
                                 <div className="flex gap-2 mt-2">
                                     <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200 uppercase">
                                       {req.vehicle || 'Auto'}
                                     </span>
                                     <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">
                                       {req.type?.replace('_', ' ') || 'Drop Off'}
                                     </span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="font-[--font-display] font-bold text-xl text-[--app-primary-dark]">{req.price}</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 mb-4">
                           <div className="relative pl-4">
                              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-green-500" />
                              <div className="text-sm font-medium text-gray-600 truncate max-w-[120px]">{req.pickup}</div>
                           </div>
                           <div className="relative pl-4">
                              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-red-500" />
                              <div className="text-sm font-medium text-gray-600 truncate max-w-[120px]">{req.drop}</div>
                           </div>
                        </div>

                        <button 
                           onClick={() => acceptRide(req)}
                           className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm shadow-lg group-hover:bg-[green] transition-colors"
                        >
                           Accept Ride
                        </button>
                     </motion.div>
                  ))}
               </div>
            )}
         </AnimatePresence>
      </div>

    </div>
  );
};

export default DriverDashboard;
