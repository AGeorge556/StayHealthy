import './App.css';
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar/navbar';
import LandingPage from './Components/Landing_page/Landing_page';  // Ensure correct capitalization
import Login from './Components/Login/login';
import SignUp from './Components/Sign_up/Sign_up';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import BookingConsultation from './Components/BookingConsultation/BookingConsultation';
import Notification from './Components/Notification';
import AppointmentNotification from './Components/AppointmentNotification';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import ReportsLayout from './Components/ReportsLayout/ReportsLayout';
import { checkServerAvailability, SHOW_SERVER_STATUS } from './config';

// Function component for the main App
function App() {
  const [, setIsLoggedIn] = useState(!!sessionStorage.getItem('auth-token'));
  const [serverAvailable, setServerAvailable] = useState(true);
  const [showServerNotice, setShowServerNotice] = useState(SHOW_SERVER_STATUS);

  useEffect(() => {
    // Check if the API server is available on component mount
    const checkServer = async () => {
      try {
        const available = await checkServerAvailability();
        setServerAvailable(available);
        // Store server status in session storage for components to access
        sessionStorage.setItem("server-available", available ? "true" : "false");
      } catch (error) {
        console.error('Error checking server:', error);
        setServerAvailable(false);
        sessionStorage.setItem("server-available", "false");
      }
    };
    
    checkServer();

    // Add listeners for login/logout events
    const handleLogin = () => {
      setIsLoggedIn(true);
    };
    
    const handleLogout = () => {
      setIsLoggedIn(false);
      // Clear auth data from session storage
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('name');
    };

    // Add event listeners
    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  // Render the main App component
  return (
    <div className="App">
      {showServerNotice && !serverAvailable && (
        <div className="alert alert--warning server-notice" role="status">
          Server unavailable, running in offline mode.
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowServerNotice(false)}>Dismiss</button>
        </div>
      )}
      
      <HashRouter>
        {/* Display the Navbar component */}
        {/* HashRouter owns the URL hash, so move focus instead of linking to #main */}
        <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
        <Navbar/>
        <main id="main" tabIndex={-1}>
        {/* Main content with routes */}
        <Routes>
          {/* Define individual Route components for different pages */}
          <Route path="/" element={<LandingPage/>}/> {/* Correct component name */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/instant-consultation" element={<InstantConsultation/>}/>
          <Route path="/booking-consultation" element={<BookingConsultation/>}/>
          <Route path="/reviews" element={<ReviewForm/>}/>
          <Route path="/profile" element={<ProfileCard/>}/>
          <Route path="/reports" element={<ReportsLayout/>}/>
        </Routes>
        </main>
        <Notification />
        <AppointmentNotification />
      </HashRouter>
    </div>
  );
}

export default App;
