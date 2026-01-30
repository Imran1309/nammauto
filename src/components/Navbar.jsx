import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, CarFront, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRadio } from '../context/RadioContext';

const Navbar = () => {
  const { user, logout } = useRadio();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Highlight active link
  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative px-4 py-2 rounded-lg font-bold transition-all ${
        isActive(to) 
          ? 'text-[--app-primary] bg-[--app-primary]/10' 
          : 'text-white hover:text-[green] hover:bg-[yellow]/10'
      }`}
    >
      {children}
      {isActive(to) && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 rounded-lg border-2 border-[--app-primary]/20 pointer-events-none"
        />
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group text-[--app-secondary]">
          <div className="h-18 rounded-xl overflow-hidden shadow-lg border-2 border-[--app-primary]/50 group-hover:border-[--app-primary] transition-colors bg-black">
             <img src="/assets/logo.jpg" alt="NammAuto" className="h-full w-auto object-contain" />
          </div>
          <p className="text-2xl font-extrabold pb-1 text-gradient">
            NammAuto
          </p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
           {user ? (
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-[--app-surface] px-4 py-2 rounded-xl border border-white/10">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[--app-primary] to-[--app-rose] flex items-center justify-center text-white font-bold text-sm">
                   {user.name.charAt(0)}
                 </div>
                 <div className="text-white font-bold text-sm hidden lg:block">
                   {user.name}
                 </div>
                 <button 
                   onClick={logout}
                   className="ml-2 text-gray-400 hover:text-[--app-rose] transition-colors"
                   title="Logout"
                 >
                   <LogOut size={18} />
                 </button>
               </div>
               {user.role === 'driver' && (
                 <Link to="/dashboard/driver">
                   <button className="px-5 py-2.5 rounded-xl font-bold bg-[lightgreen] text-black hover:bg-[--app-secondary]/80 transition-colors shadow-lg hover:shadow-[--app-secondary]/40 hover:-translate-y-0.5 transform flex items-center gap-2">
                     <CarFront size={18} /> Dashboard
                   </button>
                 </Link>
               )}
             </div>
           ) : (
             <>
               <Link to="/login/user">
                 <button className="px-6 py-2.5 rounded-xl font-bold bg-[gold] text-black hover:bg-[--app-primary]/80 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform flex items-center gap-2">
                   Sign In
                 </button>
               </Link>
               <Link to="/login/driver">
                 <button className="px-5 py-2.5 rounded-xl font-bold bg-[lightgreen] text-black hover:bg-[--app-secondary]/80 transition-colors shadow-lg hover:shadow-[--app-secondary]/40 hover:-translate-y-0.5 transform flex items-center gap-2">
                   <CarFront size={18} /> Drive
                 </button>
               </Link>
             </>
           )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[--app-primary]">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[--app-bg] border-b border-[--app-surface] overflow-hidden"
          >
            <div className="p-6 space-y-4 flex flex-col">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[--app-text] hover:text-[--app-secondary] transition-colors">Home</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[--app-text] hover:text-[yellow] transition-colors">Contact</Link>
              <Link to="/reviews" onClick={() => setIsOpen(false)} className="text-lg font-bold text-[--app-text] hover:text-[green] transition-colors">Reviews</Link>
              <hr className="border-[--app-surface]" />
              
              {user ? (
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-white font-bold">
                     <div className="w-8 h-8 rounded-full bg-[--app-primary] flex items-center justify-center text-black">
                       {user.name.charAt(0)}
                     </div>
                     {user.name}
                   </div>
                   <button onClick={() => { logout(); setIsOpen(false); }} className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-center">
                     Logout
                   </button>
                </div>
              ) : (
                <>
                  <Link to="/login/user" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl bg-[gold] text-black font-bold text-center">Sign In</Link>
                  <Link to="/login/driver" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl bg-[--app-secondary] text-black font-bold text-center">Drive with Us</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
