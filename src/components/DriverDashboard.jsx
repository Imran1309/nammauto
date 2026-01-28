import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Power, MapPin, CheckCircle, Bell, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const { user, logout, activeBooking, toggleStatus, drivers } = useRadio();
  const navigate = useNavigate();
  const myStatus = drivers.find(d => d.id === user.id)?.status || 'online';

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

         {/* Today's Stats */}
         {!activeBooking && (
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-1">Today's Earnings</div>
                  <div className="text-2xl font-[--font-display] font-bold text-gray-800">₹850</div>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-1">Rides</div>
                  <div className="text-2xl font-[--font-display] font-bold text-gray-800">12</div>
               </div>
            </div>
         )}
         
         <AnimatePresence mode="wait">
            {activeBooking ? (
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
                           <div className="text-3xl font-[--font-display] font-bold">₹55</div>
                           <div className="text-gray-400 text-xs font-bold">Cash Payment</div>
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

                     <div className="mt-8 pt-4 border-t border-gray-100">
                        {activeBooking.status === 'accepted' ? (
                           <div className="w-full py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-lg">
                              <CheckCircle /> Accepted
                           </div>
                        ) : (
                           <button className="w-full py-4 bg-black text-white rounded-xl font-[--font-display] font-bold text-xl shadow-lg active:scale-95 transition-transform">
                              Accept Ride
                           </button>
                        )}
                     </div>
                  </div>
               </motion.div>
            ) : (
               <div className="text-center py-10 opacity-50">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                     <Navigation className="text-gray-400" size={32} />
                  </div>
                  <div className="font-[--font-display] font-bold text-gray-400 uppercase tracking-widest">Looking for rides...</div>
               </div>
            )}
         </AnimatePresence>
      </div>

    </div>
  );
};

export default DriverDashboard;
