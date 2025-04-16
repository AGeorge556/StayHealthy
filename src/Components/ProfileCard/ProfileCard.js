import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';
import { API_URL, USE_MOCK_API } from '../../config';

const ProfileCard = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    name: '',
    phone: ''
  });
  const [isServerAvailable, setIsServerAvailable] = useState(!USE_MOCK_API);
  const navigate = useNavigate();

  // Function to use session storage data (mock mode) - renamed from useSessionStorageData to getSessionStorageData
  const getSessionStorageData = () => {
    const email = sessionStorage.getItem('email');
    
    if (!email) {
      navigate('/login');
      return;
    }
    
    const name = sessionStorage.getItem('name');
    const phone = sessionStorage.getItem('phone');
    
    // Get user registration date from localStorage or set to current date
    let joinDate = localStorage.getItem(`joinDate-${email}`);
    if (!joinDate) {
      joinDate = new Date().toISOString();
      localStorage.setItem(`joinDate-${email}`, joinDate);
    }
    
    // Calculate the formatted join date
    const formattedJoinDate = formatDate(joinDate);
    
    // Set user data
    setUserData({
      name: name || email.split('@')[0],
      email,
      phone: phone || 'Not provided',
      joinDate: formattedJoinDate
    });
    
    // Initialize editable data
    setEditableData({
      name: name || email.split('@')[0],
      phone: phone || ''
    });
  };

  useEffect(() => {
    // Check if user is logged in
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      setIsLoggedIn(true);
      
      // If mock mode is enabled or server is unavailable, use session storage data
      if (USE_MOCK_API || !isServerAvailable) {
        getSessionStorageData();
      } else {
        // Try to fetch from API
        fetchUserProfile();
      }
    } else {
      navigate('/login');
    }
  }, [navigate, isServerAvailable]);

  // Function to fetch user profile data from the API
  const fetchUserProfile = async () => {
    try {
      const authToken = sessionStorage.getItem('auth-token');
      const email = sessionStorage.getItem('email');

      if (!authToken || !email) {
        navigate('/login');
        return;
      }

      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Email": email,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const user = await response.json();
        
        // Get user registration date from API or use localStorage as fallback
        let joinDate = user.joinDate || localStorage.getItem(`joinDate-${email}`);
        if (!joinDate) {
          joinDate = new Date().toISOString();
          localStorage.setItem(`joinDate-${email}`, joinDate);
        }
        
        // Calculate the formatted join date
        const formattedJoinDate = formatDate(joinDate);
        
        // Set user data
        setUserData({
          name: user.name || email.split('@')[0],
          email: user.email || email,
          phone: user.phone || 'Not provided',
          joinDate: formattedJoinDate
        });
        
        // Initialize editable data
        setEditableData({
          name: user.name || email.split('@')[0],
          phone: user.phone || ''
        });
      } else {
        // If API call fails, use data from sessionStorage as fallback
        console.warn('Failed to fetch user profile from API, using session storage data');
        setIsServerAvailable(false);
        getSessionStorageData();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Use session storage data as fallback
      setIsServerAvailable(false);
      getSessionStorageData();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  // Count total appointments
  const getTotalAppointments = () => {
    let count = 0;
    
    // Search for all appointments in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('appointments-')) {
        try {
          const appointmentsData = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(appointmentsData)) {
            count += appointmentsData.length;
          }
        } catch (error) {
          console.error('Error parsing appointments:', error);
        }
      }
    }
    
    return count;
  };
  
  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableData({
        name: userData.name,
        phone: userData.phone === 'Not provided' ? '' : userData.phone
      });
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value
    });
  };
  
  // Save profile changes to API or localStorage
  const handleSave = async () => {
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (!authToken || !email) {
      navigate('/login');
      return;
    }
    
    if (USE_MOCK_API || !isServerAvailable) {
      // Mock mode or server unavailable - update session storage only
      sessionStorage.setItem('name', editableData.name);
      sessionStorage.setItem('phone', editableData.phone);
      
      setUserData({
        ...userData,
        name: editableData.name,
        phone: editableData.phone || 'Not provided'
      });
      
      setIsEditing(false);
      
      // Dispatch event to update navbar
      const profileUpdateEvent = new Event('profileUpdate');
      window.dispatchEvent(profileUpdateEvent);
      
      // Show success message
      alert('Profile Updated Successfully!');
    } else {
      // Try to use API
      try {
        const payload = { 
          ...editableData,
          email: userData.email
        };
        
        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${API_URL}/api/auth/user`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "Email": email
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Update session storage
          sessionStorage.setItem('name', editableData.name);
          sessionStorage.setItem('phone', editableData.phone);
          
          // Update state
          setUserData({
            ...userData,
            name: editableData.name,
            phone: editableData.phone || 'Not provided'
          });
          
          // Exit edit mode
          setIsEditing(false);
          
          // Dispatch event to update navbar
          const profileUpdateEvent = new Event('profileUpdate');
          window.dispatchEvent(profileUpdateEvent);
          
          // Show success message
          alert('Profile Updated Successfully!');
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        // Fallback to session storage update if API call fails
        setIsServerAvailable(false);
        
        sessionStorage.setItem('name', editableData.name);
        sessionStorage.setItem('phone', editableData.phone);
        
        setUserData({
          ...userData,
          name: editableData.name,
          phone: editableData.phone || 'Not provided'
        });
        
        setIsEditing(false);
        
        // Dispatch event to update navbar
        const profileUpdateEvent = new Event('profileUpdate');
        window.dispatchEvent(profileUpdateEvent);
        
        // Show success message with warning
        alert('Profile Updated Successfully! (Offline Mode)');
      }
    }
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("auth-token");
    
    // Update state
    setIsLoggedIn(false);
    
    // Navigate to home page
    navigate('/');
  };

  if (!isLoggedIn) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title">
            <h2>User Profile</h2>
            {!isEditing && (
              <div className="profile-actions">
                <button className="edit-button" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-content">
          {isEditing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editableData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editableData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                />
                <small>10-digit number, no spaces or dashes</small>
              </div>
              
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSave}>Save Changes</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <strong>Name:</strong>
                <span>{userData.name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{userData.email}</span>
              </div>
              <div className="detail-row">
                <strong>Phone Number:</strong>
                <span>{userData.phone}</span>
              </div>
              <div className="detail-row">
                <strong>Member Since:</strong>
                <span>{userData.joinDate}</span>
              </div>
              <div className="detail-row">
                <strong>Total Appointments:</strong>
                <span>{getTotalAppointments()}</span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span>{(!isServerAvailable || USE_MOCK_API) ? "Offline Mode" : "Active"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 