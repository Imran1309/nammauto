import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { MapPin, Navigation, LogOut, Search, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout, requestRide, activeBooking, cancelRide, drivers } = useRadio();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showPhone, setShowPhone] = useState(false);

  // Derive assigned driver
  const assignedDriver = activeBooking?.driverId ? drivers.find(d => d.id === activeBooking.driverId) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRequest = (e) => {
    e.preventDefault();
    if (from && to) {
      requestRide(from, to);
    }
  };

  return (
    <div className="min-h-screen bg-[--app-bg] font-[--font-body] relative overflow-hidden flex flex-col">
      {/* Decorative Circles */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[--app-primary]/20 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[--app-secondary]/20 blur-3xl" />

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-20 glass m-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[--app-primary] to-[--app-rose] flex items-center justify-center text-white font-bold font-[--font-display]">
             {user.name.charAt(0)}
           </div>
           <div>
             <div className="text-xs text-gray-500 font-bold uppercase">Welcome back</div>
             <div className="font-[--font-display] font-bold text-gray-800 text-lg">{user.name}</div>
           </div>
        </div>
        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[--app-rose] transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-lg mx-auto">
        
        {activeBooking ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
             <div className="h-32 bg-vibrant-gradient relative flex items-center justify-center">
                {activeBooking.status === 'pending' ? (
                   <div className="text-white text-center">
                      <Search className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                      <div className="font-[--font-display] font-bold text-xl">Looking for drivers...</div>
                   </div>
                ) : (
                   <div className="text-white text-center">
                      <div className="font-[--font-display] font-bold text-xl">Driver Found!</div>
                   </div>
                )}
             </div>
             
             <div className="p-6">
                {activeBooking.status === 'accepted' && (
                  <div className="flex items-center gap-4 mb-6 p-4 bg-[--app-bg] rounded-2xl border border-gray-100">
                     <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-[--app-primary]">
                        <img src="/assets/connect_3d.png" className="w-full h-full object-cover" alt="driver" />
                     </div>
                     <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Your Driver</div>
                        <div className="font-[--font-display] font-bold text-xl text-gray-800">Auto Raja</div>
                        <div className="flex items-center gap-1 text-[--app-secondary] text-sm font-bold">
                           <span>⭐ 4.9</span> • <span>TN-05-1234</span>
                        </div>
                     </div>
                  </div>
                )}

                <div className="space-y-4 relative">
                   {/* Dotted Line */}
                   <div className="absolute left-[19px] top-8 bottom-8 w-0.5 border-l-2 border-dashed border-gray-300" />
                   
                   <div className="flex gap-4">
                      <div className="w-10 h-10 shadow-lg rounded-full bg-white flex items-center justify-center z-10 shrink-0 text-[--app-secondary]">
                         <MapPin size={20} fill="currentColor" />
                      </div>
                      <div>
                         <div className="text-xs text-gray-400 uppercase font-bold">Pickup</div>
                         <div className="font-bold text-gray-800 text-lg line-clamp-1">{activeBooking.from}</div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="w-10 h-10 shadow-lg rounded-full bg-[--app-primary] flex items-center justify-center z-10 shrink-0 text-black">
                         <Navigation size={20} fill="currentColor" />
                      </div>
                      <div>
                         <div className="text-xs text-gray-400 uppercase font-bold">Drop</div>
                         <div className="font-bold text-gray-800 text-lg line-clamp-1">{activeBooking.to}</div>
                      </div>
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                   <button 
                     onClick={cancelRide}
                     className="flex-1 py-4 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                   >
                     Cancel
                   </button>
                   {activeBooking.status === 'accepted' && assignedDriver && (
                     <button 
                       onClick={() => setShowPhone(!showPhone)}
                       className="flex-[2] py-4 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-colors"
                     >
                       {showPhone ? assignedDriver.phone : "Call Driver"}
                     </button>
                   )}
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full"
          >


            <form onSubmit={handleRequest} className="bg-[--app-surface] p-6 rounded-3xl shadow-xl border border-[--app-primary]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[--app-primary] to-[--app-secondary]" />
              
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl flex items-center gap-3 border border-white/5 focus-within:border-[--app-primary] focus-within:bg-black/60 transition-all">
                  <MapPin className="text-[--app-secondary]" />
                  <input 
                     value={from}
                     onChange={(e) => setFrom(e.target.value)}
                     placeholder="Pickup Location"
                     className="bg-transparent w-full font-bold text-white placeholder-gray-500"
                     required
                  />
                </div>

                <div className="bg-black/40 p-4 rounded-xl flex items-center gap-3 border border-white/5 focus-within:border-[--app-secondary] focus-within:bg-black/60 transition-all">
                  <Navigation className="text-[--app-primary]" />
                  <input 
                     value={to}
                     onChange={(e) => setTo(e.target.value)}
                     placeholder="Drop Location"
                     className="bg-transparent w-full font-bold text-white placeholder-gray-500"
                     required
                  />
                </div>
              </div>

              {/* Ride Types */}
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 <div className="min-w-[100px] p-3 border-2 border-[--app-primary] bg-[--app-primary]/10 rounded-xl cursor-pointer">
                    <img src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png" className="w-10 h-10 mb-2" alt="auto" />
                    <div className="font-bold text-sm">NammAuto</div>
                    <div className="text-xs font-bold">₹40-60</div>
                 </div>
                 <div className="min-w-[100px] p-3 border border-gray-200 rounded-xl cursor-pointer opacity-50">
                    <Zap className="w-8 h-8 mb-4 text-gray-400" />
                    <div className="font-bold text-sm text-gray-500">Fast</div>
                    <div className="text-xs font-bold text-gray-400">₹80-90</div>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 py-4 bg-black text-white font-[--font-display] font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                Book NammAuto
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
