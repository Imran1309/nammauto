import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      toast.success(`Account created! Welcome, ${formData.name}`);
      // In a real app, API call goes here
      navigate(`/login/${role}`);
    } else {
      toast.error('Please fill all fields');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-black flex items-center justify-center font-[--font-body] p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/hero_bg.png')] bg-cover opacity-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-[--app-primary]/10 rounded-full blur-[100px] top-0 right-0" />

      <div className="max-w-md w-full bg-[#121212] rounded-3xl shadow-2xl overflow-hidden p-8 border border-[#333] relative z-10">
        <h1 className="text-4xl font-[--font-display] font-bold text-center mb-2 text-[--app-secondary]">Join Namm<span className="text-[--app-primary]">Auto</span></h1>
        <p className="text-center text-gray-400 font-medium mb-8">Create an account to get started</p>

        {/* Role Toggle */}
        <div className="flex bg-black p-1 rounded-xl mb-8 border border-[#333]">
          <button 
            onClick={() => setRole('user')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${role === 'user' ? 'bg-[#1a1a1a] shadow-inner text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Passenger
          </button>
          <button 
            onClick={() => setRole('driver')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${role === 'driver' ? 'bg-[#1a1a1a] shadow-inner text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[--app-primary] uppercase mb-1 tracking-wider">Full Name</label>
            <input 
               type="text" 
               value={formData.name}
               onChange={e => setFormData({...formData, name: e.target.value})}
               className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#333] focus:bg-[#1a1a1a] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-colors font-bold text-white placeholder-gray-600 outline-none"
               placeholder="Your name"
               required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[--app-primary] uppercase mb-1 tracking-wider">Email Address</label>
             <input 
               type="email" 
               value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
               className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#333] focus:bg-[#1a1a1a] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-colors font-bold text-white placeholder-gray-600 outline-none"
               placeholder="name@example.com"
               required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[--app-primary] uppercase mb-1 tracking-wider">Phone Number</label>
             <input 
               type="tel" 
               value={formData.phone}
               onChange={e => setFormData({...formData, phone: e.target.value})}
               className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#333] focus:bg-[#1a1a1a] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-colors font-bold text-white placeholder-gray-600 outline-none"
               placeholder="+91 98765 43210"
               required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[--app-primary] uppercase mb-1 tracking-wider">Password</label>
             <input 
               type="password" 
               value={formData.password}
               onChange={e => setFormData({...formData, password: e.target.value})}
               className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#333] focus:bg-[#1a1a1a] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] transition-colors font-bold text-white placeholder-gray-600 outline-none"
               placeholder="••••••••"
               style={{ backgroundColor: '#0a0a0a', color: 'white' }}
               required
            />
          </div>

          <button className="w-full py-4 bg-[gold] text-black font-[--font-display] font-bold text-xl rounded-xl shadow-lg hover:bg-yellow-400 hover:scale-[1.02] transition-all mt-6 shadow-[gold]/20">
            Sign Up as {role === 'user' ? 'Passenger' : 'Driver'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400 font-medium">
            Already have an account? <Link to={`/login/${role}`} className="text-[gold] font-bold hover:text-yellow-300 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
