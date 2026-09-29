import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const checkAuthStatus = () => {
    const authToken = sessionStorage.getItem('auth-token');
    const name = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');

    if (authToken && email) {
      setIsLoggedIn(true);
      // Fall back to the part of the email before @ when no name is stored
      setUserName(name || email.split('@')[0]);
    } else {
      setIsLoggedIn(false);
    }
  };

  // Re-check auth and close menus on every route change
  useEffect(() => {
    checkAuthStatus();
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth-token' || e.key === 'email' || e.key === 'name') {
        checkAuthStatus();
      }
    };
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', checkAuthStatus);
    window.addEventListener('profileUpdate', checkAuthStatus);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', checkAuthStatus);
      window.removeEventListener('profileUpdate', checkAuthStatus);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("auth-token");
    setIsLoggedIn(false);
    setUserName('');
    setShowDropdown(false);
    window.dispatchEvent(new Event('logout'));
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <Link to="/" className="nav__logo" aria-label="StayHealthy home">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
          <span>Stay<strong>Healthy</strong></span>
        </Link>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <ul id="nav-links" className={`nav__links${menuOpen ? ' is-open' : ''}`}>
          <li><NavLink to="/" end className="nav__link">Home</NavLink></li>
          {isLoggedIn ? (
            <>
              <li><NavLink to="/booking-consultation" className="nav__link">Book Appointment</NavLink></li>
              <li><NavLink to="/instant-consultation" className="nav__link">Instant Consultation</NavLink></li>
              <li className="nav__profile" ref={dropdownRef}>
                <button
                  type="button"
                  className="nav__profile-toggle"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <span className="avatar" aria-hidden="true">{userName.charAt(0).toUpperCase()}</span>
                  <span>{userName}</span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={showDropdown ? 'is-flipped' : ''}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="nav__menu">
                    <Link to="/profile" className="nav__menu-item">My Profile</Link>
                    <Link to="/reports" className="nav__menu-item">Your Reports</Link>
                    <Link to="/reviews" className="nav__menu-item">Reviews</Link>
                    <hr />
                    <button type="button" className="nav__menu-item nav__menu-item--danger" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn--ghost">Log in</Link></li>
              <li><Link to="/signup" className="btn btn--primary">Sign up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
