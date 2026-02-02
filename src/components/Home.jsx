import React, { useEffect, useRef, useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Bike, Car, Bus, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import Map from './Map';

const Home = () => {
  const { user, requestRide, activeBooking, drivers, submitReview, cancelRide } = useRadio();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [selectedVehicle, setSelectedVehicle] = useState('Auto');
  const [carType, setCarType] = useState('Mini');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const [distance, setDistance] = useState(0);

  // Derive assigned driver
  const assignedDriver = activeBooking?.driverId ? drivers.find(d => d.id === activeBooking.driverId) : null;



  const handleBookRide = () => {
    if (user) {
      // If logged in, scroll to booking inputs on Home Page
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/login/user');
    }
  };

  const onBookNow = (e) => {
    e.preventDefault();
    document.getElementById('ride-options')?.scrollIntoView({ behavior: 'smooth' });
    toast.info("Select a trip type below to confirm booking");
  };

  const confirmBooking = (type) => {
     if (!user) {
        navigate('/login/user');
        return;
     }

     let currentPickup = pickup;
     let currentDrop = drop;

     // Auto-fill locations if empty to ensure booking process completes for user convenience
     if (!currentPickup) {
        currentPickup = "Tiruchengode Old Bus Stand";
        setPickup(currentPickup);
     }
     if (!currentDrop) {
        currentDrop = "New Bus Stand";
        setDrop(currentDrop);
     }

     const finalVehicle = selectedVehicle === 'Car' ? `Car (${carType})` : selectedVehicle;
     requestRide(currentPickup, currentDrop, finalVehicle, type);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(e => console.log("Video play failed:", e));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-start pt-32 justify-center overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 z-0">
          {/* Multi-color Radiant Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00FF00]/10 via-[#121212] to-[gold]/10" />
          
          {/* Ambient Color Blobs */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#00FF00]/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse" />
          <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-[gold]/20 rounded-full blur-[100px] mix-blend-screen opacity-50" />
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] bg-emerald-900/20 rounded-full blur-[120px]" />

          <img src="/assets/hero_bg.png" className="w-full h-full object-cover opacity-90" alt="background" />
          <div className="absolute inset-0 bg-gradient-to-t from-[--app-bg] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
             <h1 className="text-5xl md:text-8xl font-[--font-display] font-bold text-[gold] leading-tight mb-6 flex flex-wrap items-center gap-4">Ride</h1>
              <h1 className="text-5xl md:text-8xl font-[--font-display] font-bold text-[gold] leading-tight mb-6 flex flex-wrap items-center gap-4">
                Ride <span className="text-[green] inline-flex items-center gap-[1px]">N<TyreSpinner />mmAut<TyreSpinner /></span>
              </h1>
             <p className="text-lg md:text-xl text-[--app-primary]/70 mb-6 max-w-lg font-medium">
               The fastest, safest, and most affordable way to travel. Connect with nearby auto drivers instantly. No bargaining, just riding.
             </p>
            
            {!user && (
              <button 
                onClick={handleBookRide}
                className="px-8 py-4 bg-black text-white font-[--font-display] font-bold text-xl rounded-full border border-[--app-primary] hover:bg-[--app-primary] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] flex items-center gap-2 group mb-8"
              >
                Book Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            
          


            {/* Quick Booking Form (Logged In) */}
            {user && user.role !== 'driver' && (
              <motion.div 
                id="booking-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-lg w-full"
              >
                  {/* Where To Header */}


                  <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-2xl">
                     <form onSubmit={onBookNow} className="space-y-4">
                        {/* Vehicle Selection - Integrated */}
                         <div className="bg-[#1a1a1a] p-2 rounded-full flex items-center justify-between mb-6 shadow-inner border border-white/5">
                            {['Bike', 'Auto', 'Car', 'Traveller'].map((vehicle) => (
                                <button
                                   key={vehicle}
                                   type="button"
                                   onClick={() => setSelectedVehicle(vehicle)}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                                      selectedVehicle === vehicle 
                                      ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,215,0,0.4)]' 
                                      : 'text-gray-400 hover:text-white'
                                   }`}
                                >
                                    {vehicle === 'Bike' && <Bike size={18} />}
                                    {vehicle === 'Auto' && <AutoRickshawIcon size={18} />} 
                                    {vehicle === 'Car' && <Car size={18} />}
                                    {vehicle === 'Traveller' && <Bus size={18} />}
                                    <span className="hidden md:inline">{vehicle}</span>
                                </button>
                            ))}
                         </div>

                        {/* Car Type Selection - Only for Car */}
                        {selectedVehicle === 'Car' && (
                           <div className="flex gap-3 mb-6">
                              {['Mini', 'SUV'].map((type) => (
                                 <button
                                    key={type}
                                    type="button"
                                    onClick={() => setCarType(type)}
                                    className={`flex-1 py-2 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                       carType === type
                                       ? 'bg-[--app-secondary] text-green-900 border-[--app-secondary] shadow-[0_0_15px_var(--app-secondary)]'
                                       : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }`}
                                 > 
                                    {type === 'Mini' ? 'Hatchback/Mini' : 'Sedan/SUV'}
                                 </button>
                              ))}
                           </div>
                        )}

                        <div className="bg-[#0a0a0a] p-4 rounded-2xl flex items-center gap-4 border border-white/5 focus-within:border-[--app-primary] transition-colors relative overflow-hidden group">
                           <MapPin size={20} className="text-[--app-secondary] shrink-0" />
                           <input 
                             value={pickup}
                             onChange={(e) => setPickup(e.target.value)}
                             placeholder="Pickup Location"
                             className="bg-transparent w-full font-bold text-white placeholder-gray-500 outline-none text-lg"
                             required
                           />
                        </div>
                        
                        <div className="bg-[#0a0a0a] p-4 rounded-2xl flex items-center gap-4 border border-white/5 focus-within:border-[--app-secondary] transition-colors relative overflow-hidden group">
                           <Navigation size={20} className="text-[--app-primary] shrink-0" />
                           <input 
                             value={drop}
                             onChange={(e) => setDrop(e.target.value)}
                             placeholder="Drop Location"
                             className="bg-transparent w-full font-bold text-white placeholder-gray-500 outline-none text-lg"
                             required
                           />
                        </div>

                        <button type="submit" className="w-full py-4 mt-4 bg-black border border-white/20 text-white font-[--font-display] font-bold text-lg rounded-2xl hover:bg-white hover:text-black hover:border-transparent transition-all shadow-lg active:scale-95">
                          View Ride Options ▼
                        </button>
                     </form>
                  </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[--app-primary]/20 rounded-full blur-[100px] z-0" />
             <div className="relative z-10 w-full h-full"> 
                <Map 
                    pickup={pickup}
                    drop={drop}
                    onDistanceChange={(d) => setDistance(d)}
                    onPickupChange={(addr) => setPickup(addr)}
                    onDropChange={(addr) => setDrop(addr)}
                    onLocationFound={(coords) => {
                        setPickup("Current Location (GPS)");
                        toast.success("Location found!");
                    }} 
                />
             </div>
          </motion.div>
        </div>

        

      </section>



      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        {/* Section Background with Multi-color Ambient Glows */}
        {/* Section Background with Multi-color Ambient Glows */}
        <div className="absolute inset-0 bg-[black]" />
        
        {/* Neon Auto Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            src="/assets/auto.mp4" 
            muted
            playsInline
            className="w-[80%] md:w-[50%] h-auto object-contain mix-blend-screen opacity-40"
          />
        </div>

        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full blur-[120px] opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-red-900/40 to-yellow-500/20 rounded-full blur-[120px] opacity-60" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-[--font-display] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[gold]">Why NammAuto?</h2>
            <p className="text-[--app-primary]/60 text-lg md:text-xl font-medium">We make your daily commute effortless</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-pink-500" />}
              title="Lightning Fast"
              desc="Get matched with a driver in under 15 seconds. Our smart radar tech finds the nearest auto instantly."
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-yellow-400" />}
              title="Secure Rides"
              desc="Verified drivers and real-time tracking. Share your ride details with loved ones for peace of mind."
            />
            <FeatureCard 
              icon={<Star className="w-10 h-10 text-blue-500" />}
              title="Best Rated"
              desc="Top-rated drivers ensuring a smooth, polite, and safe journey every time you book."
            />
          </div>
        </div>
      </section>
      
      {/* Ride Options Section */}
      <section id="ride-options" className="py-24 relative overflow-hidden bg-[--app-bg]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black/30">
          <div className="absolute inset-0 bg-gradient-to-b from-[--app-bg]/90 via-[--app-bg]/80 to-[--app-bg]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-[--font-display] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[gold]">
              Ride Your Way - {selectedVehicle === 'Car' ? `${selectedVehicle} (${carType.split('-')[0]})` : selectedVehicle}
            </h2>
            <p className="text-[--app-primary]/60 text-lg md:text-xl font-medium">Choose the perfect trip for your needs</p>
          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
             {/* Drop Off Trip */}
             <div className="p-8 rounded-3xl bg-[--app-surface] border-2 border-transparent hover:border-[#00FFFF] relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#00FFFF]/20 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00FFFF]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 font-[--font-display] text-white">Drop Off</h3>
                <p className="text-gray-400 mb-6">One-way trip to your destination. Quick and affordable.</p>
                <button onClick={() => confirmBooking('drop_off')} className="relative z-20 px-6 py-2 rounded-full border border-[#00FFFF] text-[#00FFFF] font-bold hover:bg-[#00FFFF] hover:text-black transition-colors cursor-pointer">Book Ride</button>
             </div>
             {/* Round Trip */}
             <div className="p-8 rounded-3xl bg-[--app-surface] border-2 border-transparent hover:border-[#00FF00] relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#00FF00]/20 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-[#00FF00]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {/* Icon made with simple divs/spans if icon lib not fully available, but assuming lucide icons usage above, better import them or just use generic SVG */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00FF00]"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 font-[--font-display] text-white">Round Trip</h3>
                <p className="text-gray-400 mb-6">Go there and back again with ease. Perfect for errands or visits.</p>
                <button onClick={() => confirmBooking('round_trip')} className="relative z-20 px-6 py-2 rounded-full border border-[#00FF00] text-[#00FF00] font-bold hover:bg-[#00FF00] hover:text-black transition-colors cursor-pointer">Book Ride</button>
             </div>

             {/* Hourly Rental */}
             <div className="p-8 rounded-3xl bg-[--app-surface] border-2 border-transparent hover:border-[gold] relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[gold]/20 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[gold]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-[gold]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[gold]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 font-[--font-display] text-white">Hourly Rental</h3>
                <p className="text-gray-400 mb-6">Keep the auto for as long as you need. Multiple stops, one price.</p>
                <button onClick={() => confirmBooking('hourly')} className="relative z-20 px-6 py-2 rounded-full border border-[gold] text-[gold] font-bold hover:bg-[gold] hover:text-black transition-colors cursor-pointer">Book Ride</button>
             </div>

             {/* Trip for a Day */}
             <div className="p-8 rounded-3xl bg-[--app-surface] border-2 border-transparent hover:border-[orange] relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[orange]/20 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[orange]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-[orange]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[orange]"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 font-[--font-display] text-white">Full Day Pass</h3>
                <p className="text-gray-400 mb-6">Explore the city without limits. Your personal driver for the whole day.</p>
                <button onClick={() => confirmBooking('full_day')} className="relative z-20 px-6 py-2 rounded-full border border-[orange] text-[orange] font-bold hover:bg-[orange] hover:text-black transition-colors cursor-pointer">Book Ride</button>
             </div>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-[--font-display] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[gold]">What people say</h2>
            <p className="text-[--app-primary]/60 text-lg md:text-xl font-medium">Trusted by thousands of riders and drivers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Daily Commuter", rating: 5, text: "NammAuto has changed my daily travel. The drivers are polite and the app is super fast!" },
              { name: "Rahul Verma", role: "Student", rating: 4, text: "Great app for college students. Affordable prices and quick booking." },
              { name: "Anitha Raj", role: "Office Worker", rating: 5, text: "I feel safe using NammAuto late at night. The live tracking is a lifesaver." }
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#002200]/80 backdrop-blur-sm border border-[#00FF00]/30 hover:border-[#00FF00] hover:shadow-xl hover:shadow-[#00FF00]/20 transition-all hover:-translate-y-1">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-yellow-400/20"} />
                  ))}
                </div>
                <p className="text-white/90 font-medium text-lg leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF00] to-[gold] flex items-center justify-center text-black font-bold text-lg border border-[#00FF00]">
                      {review.name.charAt(0)}
                   </div>
                   <div>
                      <div className="font-bold text-white">{review.name}</div>
                      <div className="text-xs font-bold text-[#00FF00] uppercase">{review.role}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Roadside Rock Decoration */}
         <div className="absolute bottom-0 right-0 z-0 opacity-80 pointer-events-none transform translate-y-4 scale-75 md:scale-100 origin-bottom-right">
             <Milestone distance={distance} />
         </div>
      </section>

      {/* Footer / Last Contact Section */}
      <footer className="py-12 relative bg-[#0a0a0a] border-t border-[--app-primary]/10">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
               <h2 className="text-3xl font-[--font-display] font-bold text-white mb-4">NammAuto</h2>
               <p className="text-gray-400 max-w-sm mb-6">
                 Your reliable ride partner. Safe, fast, and affordable auto rides at your doorstep.
               </p>
               <div className="flex gap-4">
                  {/* Social Icons Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-[--app-surface] flex items-center justify-center text-white hover:bg-[--app-primary] hover:text-black transition-colors cursor-pointer">FB</div>
                  <div className="w-10 h-10 rounded-full bg-[--app-surface] flex items-center justify-center text-white hover:bg-[--app-primary] hover:text-black transition-colors cursor-pointer">TW</div>
                  <div className="w-10 h-10 rounded-full bg-[--app-surface] flex items-center justify-center text-white hover:bg-[--app-primary] hover:text-black transition-colors cursor-pointer">IG</div>
               </div>
            </div>
            
            <div>
               <h3 className="text-3xl font-[--font-display] font-bold text-white mb-6">Quick Links</h3>
               <ul className="space-y-4 text-lg font-medium text-gray-300">
                  <li><Link to="/" className="hover:text-[#00FF00] transition-colors hover:pl-2 duration-300 inline-block">Home</Link></li>
                  <li><Link to="#" className="hover:text-[#00FF00] transition-colors hover:pl-2 duration-300 inline-block">About Us</Link></li>
                  <li><Link to="#" className="hover:text-[#00FF00] transition-colors hover:pl-2 duration-300 inline-block">Services</Link></li>
                  <li><Link to="/contact" className="hover:text-[#00FF00] transition-colors hover:pl-2 duration-300 inline-block">Contact</Link></li>
               </ul>
            </div>

            <div>
               <h3 className="text-xl font-bold text-[--app-secondary] mb-4">Contact Info</h3>
               <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                     <span className="text-[--app-primary]">📍</span> 6/28, KuttimaikanpattioRajapalayam (post)Tiruchengode (Tk)Namakkal-637 209
                  </li>
                  <li className="flex items-center gap-2">
                     <span className="text-[--app-primary]">📞</span> +91 8668167715
                  </li>
                  <li className="flex items-center gap-2">
                     <span className="text-[--app-primary]">📞</span> +91 8825635432
                  </li>
                  <li className="flex items-center gap-2">
                     <span className="text-[--app-primary]">✉️</span> support@nammauto.com
                  </li>
               </ul>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} NammAuto. All rights reserved. Made with ❤️ in Tiruchengode.
         </div>
      </footer>


      {/* Searching Overlay */}


      {/* Driver Found Overlay */}
      {activeBooking && activeBooking.status === 'accepted' && assignedDriver && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
              {/* Header Gradient */}
              <div className="bg-gradient-to-r from-[#00FF00] to-[gold] p-6 text-center pt-8 pb-12">
                 <h2 className="text-2xl font-[--font-display] font-bold text-black drop-shadow-sm">Booking Confirmed!</h2>
                 <p className="text-black/80 font-bold uppercase text-xs mt-1 tracking-wider">{activeBooking.type?.replace('_', ' ')} • {activeBooking.vehicle}</p>
              </div>

              <div className="px-6 -mt-8 pb-6 relative z-10">
                 {/* Driver Card */}
                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl border-2 border-white shadow-md">
                       🛺
                    </div>
                    <div>
                       <div className="text-xs text-black font-bold uppercase tracking-wider mb-1">Crew Details</div>
                       <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Driver</div>
                       <div className="text-xl font-bold text-black">{assignedDriver.name}</div>
                       <div className="flex text-yellow-500 mb-1">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} fill="currentColor" className={i < Math.floor(assignedDriver.rating) ? "" : "text-gray-200"} />
                          ))}
                       </div>
                       {/* Phone Number Display */}
                       <div className="text-sm font-bold text-gray-800 bg-gray-100 rounded-lg px-2 py-1 inline-block">
                         📞 {showPhone ? assignedDriver.phone : assignedDriver.phone.slice(0, 3) + '*******'}
                       </div>
                    </div>
                 </div>

                 {/* Trip Details */}
                 <div className="space-y-6 mb-8 relative pl-6">
                    {/* Dashed Line */}
                    <div className="absolute left-[11px] top-3 bottom-8 w-[2px] border-l-2 border-dashed border-gray-200" />
                    
                    <div className="relative">
                       <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center shrink-0" />
                       <div className="text-xs text-gray-400 font-bold uppercase">Pickup</div>
                       <div className="font-bold text-gray-800 text-lg leading-tight">{activeBooking.from}</div>
                    </div>

                    <div className="relative">
                       <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-black border-4 border-gray-300 shadow-sm flex items-center justify-center shrink-0 text-white">
                          <Navigation size={10} />
                       </div>
                       <div className="text-xs text-gray-400 font-bold uppercase">Drop</div>
                       <div className="font-bold text-gray-800 text-lg leading-tight">{activeBooking.to}</div>
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="flex gap-4">
                    <button 
                       onClick={cancelRide}
                       className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={() => {
                         if (showPhone) {
                           window.location.href = `tel:${assignedDriver.phone.replace(/\s/g, '')}`;
                         } else {
                           setShowPhone(true);
                         }
                       }}
                       className="flex-1 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-lg flex flex-col items-center justify-center leading-none"
                    >
                       <span>{showPhone ? assignedDriver.phone : 'Call Driver'}</span>
                       {showPhone && <span className="text-[10px] text-green-400 font-normal mt-1">Tap to dial</span>}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Rating & Review Overlay */}
      {activeBooking && activeBooking.status === 'completed' && (user?.id === activeBooking.passengerId || !user) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative text-center p-6">
              <div className="mb-6">
                 <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-lg animate-bounce-short">
                    🎉
                 </div>
                 <h2 className="text-2xl font-[--font-display] font-bold text-black mb-1">Ride Completed!</h2>
                 <p className="text-gray-500 text-sm">How was your ride with <span className="font-bold text-black">{assignedDriver?.name || 'your driver'}</span>?</p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                 {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                       key={star}
                       onClick={() => setRating(star)}
                       className="transition-transform hover:scale-110 focus:outline-none"
                    >
                       <Star 
                          size={32} 
                          fill={star <= rating ? "#FFD700" : "none"} 
                          className={star <= rating ? "text-[gold]" : "text-gray-300"} 
                          strokeWidth={1.5}
                       />
                    </button>
                 ))}
              </div>

              {/* Review Text */}
              <textarea 
                 value={review}
                 onChange={(e) => setReview(e.target.value)}
                 placeholder="Write a review (optional)..."
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 outline-none focus:ring-2 focus:ring-[--app-primary] text-black resize-none h-24 font-medium"
              />

              <button 
                 onClick={() => submitReview(rating, review)}
                 disabled={rating === 0}
                 className="w-full py-4 bg-black disabled:bg-gray-300 text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg active:scale-95"
              >
                 Submit Feedback
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-[--app-surface] border-2 border-transparent hover:border-[--app-primary] relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[--app-primary]/20">
    {/* Gradient Border Overlay on Hover (optional, simplified to border color change above, but let's add a subtle multi-color glow) */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00FF00]/10 to-[gold]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    
    <div className="relative z-10 bg-transparent">
      <div className="w-20 h-20 rounded-2xl bg-black/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-4 border-t-pink-500 border-r-blue-500 border-b-yellow-500 border-l-purple-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 font-[--font-display] text-pink-500">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TyreSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    className="w-[0.65em] h-[0.65em] bg-[#1a1a1a] rounded-full border-[0.08em] border-[#333] relative flex items-center justify-center shrink-0 mx-[0.02em]"
  >
    {/* Tyre Treads */}
    <div className="absolute inset-0 rounded-full border-[0.1em] border-dashed border-gray-600" />
    {/* Inner Rim */}
    <div className="w-[60%] h-[60%] rounded-full border-[0.08em] border-[gold] flex items-center justify-center relative bg-[#000]">
      {/* Spokes */}
      <div className="absolute inset-0 bg-transparent rotate-45 border-t-[0.05em] border-b-[0.05em] border-[gold]/50 top-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 bg-transparent -rotate-45 border-t-[0.05em] border-b-[0.05em] border-[gold]/50 top-1/2 -translate-y-1/2" />
      {/* Hubcap */}
      <div className="w-[30%] h-[30%] bg-[gold] rounded-full z-10" />
    </div>
  </motion.div>
);

const Milestone = ({ distance = 0 }) => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
    className="relative w-44 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group hover:scale-105 transition-transform duration-300"
  >
    {/* Top Curve (Yellow) */}
    <div className="w-full h-24 bg-[#FFD700] rounded-t-full relative z-10 flex items-end justify-center pb-2 border-b border-black/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 to-transparent" />
      <span className="text-black font-bold text-xl font-[--font-display] tracking-wider">TN</span>
    </div>
    
    {/* Bottom Rectangle (White) */}
    <div className="w-full h-28 bg-white z-10 flex flex-col items-center justify-start pt-2 relative overflow-hidden rounded-b-lg">
        {/* Weathering effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-gray-300/30 pointer-events-none" />
        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-gray-900/10 to-transparent pointer-events-none" />
        
        <span className="text-black font-extrabold text-lg md:text-xl font-[--font-display] z-10 px-2 text-center uppercase">TIRUCHENGODE</span>
        <div className="flex items-baseline gap-1 z-10 mt-1">
          <span className="text-black font-black text-4xl font-sans">{distance}</span>
          <span className="text-black/70 font-bold text-sm">km</span>
        </div>
    </div>
    
    {/* 3D Side Depth (Pseudo-3D) */}
    <div className="absolute top-4 -right-3 w-full h-full bg-[#1a1a1a] rounded-t-full rounded-b-lg -z-0 opacity-50 skew-y-[10deg] scale-x-95 origin-left blur-[1px]" />
    
    {/* Grass/Decoration at base */}
    <div className="absolute -bottom-4 -left-4 -right-4 h-8 bg-transparent flex justify-center gap-1">
       {/* Simple CSS grass blades or just shadow */}
       <div className="w-[80%] h-4 bg-black/60 blur-md rounded-[100%]" />
    </div>
  </motion.div>
);

const AutoRickshawIcon = ({ size = 24, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="17" r="3" />
    <path d="M2.5 17h15" />
    <path d="M7 17v-8" />
    <path d="M7 9l8-4 5 7" />
    <path d="M15 17v-5" />
    <path d="M2.5 10l4.5-1" />
  </svg>
);

export default Home;
