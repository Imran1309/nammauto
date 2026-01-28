import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const HERO_BG = '/assets/hero_bg.png'; 
const CONNECT_IMG = '/assets/connect_3d.png';

const LoginScreen = () => {
  const { login } = useRadio();
  const { type } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'driver' | 'user'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (type === 'driver') setRole('driver');
    if (type === 'user') setRole('user');
  }, [type]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (identifier && password && role) {
      // Simulation: Use identifier as name for now since we removed the name field
      const simulatedName = identifier.split('@')[0]; 
      login(simulatedName, role, identifier, ''); 
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-[--font-body] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 z-0 bg-[--app-secondary]/80 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-4xl glass rounded-3xl p-4 md:p-8 flex flex-col md:flex-row shadow-2xl overflow-hidden m-4"
      >
        
        {/* Left Side: Branding & Illustration */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl font-[--font-display] font-bold text-[--app-secondary] mb-2 drop-shadow-sm">
            Namm<span className="text-[--app-rose]">Auto</span>
          </h1>
          <p className="text-gray-600 mb-6 font-medium">Your City. Your Ride. Instantly.</p>
          
          <motion.img 
            src={CONNECT_IMG}
            alt="Connection"
            className="w-64 h-64 object-contain drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Right Side: Interaction */}
        <div className="md:w-1/2 bg-black/80 backdrop-blur-xl rounded-2xl p-8 flex flex-col justify-center border border-white/10">
          
          {!role ? (
            <div className="space-y-4">
               <h2 className="text-2xl font-[--font-display] font-bold text-center text-white mb-6">Who are you today?</h2>
               
               <button onClick={() => setRole('user')} className="w-full group">
                 <div className="bg-[#1a1a1a] hover:bg-[--app-primary] p-4 rounded-xl shadow-lg border border-white/10 hover:border-transparent transition-all flex items-center justify-between group-hover:scale-105">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[--app-accent]/20 flex items-center justify-center text-2xl">👋</div>
                      <div className="text-left">
                        <div className="font-bold text-lg text-white group-hover:text-black">I need a ride</div>
                        <div className="text-xs text-gray-400 group-hover:text-black/70 font-medium">Book instantly</div>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-500 group-hover:text-black" />
                 </div>
               </button>

               <button onClick={() => setRole('driver')} className="w-full group">
                 <div className="bg-[#1a1a1a] hover:bg-[--app-secondary] p-4 rounded-xl shadow-lg border border-white/10 hover:border-transparent transition-all flex items-center justify-between group-hover:scale-105">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[--app-primary]/20 flex items-center justify-center text-2xl">🛺</div>
                      <div className="text-left">
                        <div className="font-bold text-lg text-white group-hover:text-black">I am a Driver</div>
                        <div className="text-xs text-gray-400 group-hover:text-black/70 font-medium">Start earning</div>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-500 group-hover:text-black" />
                 </div>
               </button>
            </div>
          ) : (
            <motion.form 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <button 
                type="button" 
                onClick={() => setRole(null)}
                className="text-xs font-bold text-gray-400 hover:text-[--app-rose] uppercase tracking-wider mb-4"
              >
                ← Back
              </button>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email or Phone Number</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-all text-lg font-bold text-white placeholder-gray-600 outline-none"
                  placeholder="e.g., priya@example.com or 9876543210"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-all text-lg font-bold text-white placeholder-gray-600 outline-none pr-12"
                    placeholder="••••••••"
                    style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-[--font-display] font-bold text-black text-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all bg-[gold] border border-black/5 mt-6"
              >
                Let's Go!
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-500 font-medium">
                  Don't have an account? <Link to="/signup" className="text-[--app-primary] font-bold hover:underline">Sign Up Now</Link>
                </p>
              </div>
            </motion.form>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
