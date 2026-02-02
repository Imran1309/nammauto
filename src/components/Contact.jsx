import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will connect shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-24 min-h-screen bg-black flex items-center justify-center font-[--font-body] p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-[#121212] border border-[#333] rounded-[2rem] shadow-2xl overflow-hidden relative">
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FF00] to-[gold]" />
        
        {/* Left Side: Info */}
        <div className="p-6 md:p-12 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[--app-primary]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-[--font-display] font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[gold] to-[#FFA500]">Contact Us</h1>
            <p className="text-gray-400 font-medium text-lg leading-relaxed mb-12">
              Have questions or feedback? We'd love to hear from you. Reach out to the NammAuto team.
            </p>
          </div>

          <div className="space-y-8 relative z-10">
             <div className="flex items-center gap-6 group">
               <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center group-hover:border-[--app-primary] transition-colors shadow-lg">
                  <span className="text-2xl">📧</span>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                 <div className="font-bold text-white text-lg">support@nammauto.in</div>
               </div>
             </div>

             <div className="flex items-center gap-6 group">
               <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center group-hover:border-[--app-primary] transition-colors shadow-lg">
                  <span className="text-2xl">📞</span>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                 <div className="font-bold text-white text-lg">+91 8668167715</div>
                 <div className="font-bold text-white text-lg mt-1">+91 8825635432</div>
               </div>
             </div>

             <div className="flex items-center gap-6 group">
               <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center group-hover:border-[--app-primary] transition-colors shadow-lg">
                  <span className="text-2xl">🏢</span>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</div>
                 <div className="font-bold text-white text-sm leading-relaxed">
                   6/28, Kuttimaikanpattio<br/>
                   Rajapalayam (post)<br/>
                   Tiruchengode (Tk)<br/>
                   Namakkal-637 209
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 md:p-12 bg-[#0a0a0a]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-[#333] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] outline-none text-white font-bold placeholder-gray-600 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-[#333] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] outline-none text-white font-bold placeholder-gray-600 transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
              <textarea 
                rows="4"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-[#333] focus:border-[--app-primary] focus:ring-1 focus:ring-[--app-primary] outline-none text-white font-bold placeholder-gray-600 transition-all resize-none"
                placeholder="How can we help?"
                required
              />
            </div>
            <button className="w-full py-4 bg-[#FFD700] text-black font-[--font-display] font-bold text-xl rounded-2xl hover:bg-[#FFC000] hover:scale-[1.01] hover:shadow-xl hover:shadow-[gold]/20 transition-all">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
