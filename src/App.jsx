import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RadioProvider, useRadio } from './context/RadioContext';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import UserDashboard from './components/UserDashboard';
import DriverDashboard from './components/DriverDashboard';
import Home from './components/Home';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Signup from './components/Signup';

// Wrapper to conditionally show Navbar
const Layout = ({ children }) => {
  const { user } = useRadio();
  const location = useLocation();
  
  // Hide Navbar on Dashboard routes if user is logged in (dashboards have their own headers usually, 
  // but for now let's keep it consistent or hiding it might be better? 
  // UserDashboard checks 'user' state.
  // Actually, Navbar is useful everywhere except maybe inside the specific dashboard if it conflicts.
  // Let's keep Navbar for public pages, and maybe hide it for actual utility dashboards if they are full screen?
  // Current Navbar design is "overlay" type.
  
  // Let's show Navbar on: Home, Contact, Reviews, Signup, Login pages.
  // Hide on: /dashboard/*
  
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
    </>
  );
};

const ProtectedRoute = ({ children, role }) => {
  const { user } = useRadio();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

// Component to handle auto-routing based on auth state
const AppRoutes = () => {
  const { user } = useRadio();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Login Routes - reused LoginScreen but passed params if needed or internal state */}
      <Route path="/login/:type?" element={user ? (user.role === 'driver' ? <Navigate to="/dashboard/driver" /> : <Navigate to="/" />) : <LoginScreen />} />
      
      {/* Protected Dashboards */}
      <Route path="/dashboard/user" element={
        <ProtectedRoute role="user">
           <UserDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/driver" element={
        <ProtectedRoute role="driver">
           <DriverDashboard />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <RadioProvider>
      <Router>
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: { fontFamily: 'Outfit, sans-serif' }
          }}
        />
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </RadioProvider>
  );
}
