import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar/navbar';
import Landing_page from './Components/Landing_page/Landing_page';  // Ensure correct capitalization
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
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('auth-token'));
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
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: '#fcf8e3', 
            color: '#8a6d3b',
            padding: '5px', 
            fontSize: '12px',
            textAlign: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={() => setShowServerNotice(false)}
        >
          Server unavailable - running in offline mode (click to dismiss)
        </div>
      )}
      
      <HashRouter>
        {/* Display the Navbar component */}
        <Navbar/>
        
        {/* Main content with routes */}
        <Routes>
          {/* Define individual Route components for different pages */}
          <Route path="/" element={<Landing_page/>}/> {/* Correct component name */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/instant-consultation" element={<InstantConsultation/>}/>
          <Route path="/booking-consultation" element={<BookingConsultation/>}/>
          <Route path="/reviews" element={<ReviewForm/>}/>
          <Route path="/profile" element={<ProfileCard/>}/>
          <Route path="/reports" element={<ReportsLayout/>}/>
        </Routes>
        <Notification />
        <AppointmentNotification />
      </HashRouter>
    </div>
  );
}

export default App;
