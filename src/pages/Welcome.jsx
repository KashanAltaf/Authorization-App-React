import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/style.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleText = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'User';

  return (
    <div className="welcome-page">
      <header className="header">
        {/* Hamburger on the left */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h2>Welcome, <span id="roleText">{roleText}</span>!</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Side menu */}
      <nav className={`side-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><Link to="/welcome" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/contacts" onClick={() => setMenuOpen(false)}>Contact List</Link></li>
          <li><Link to="/reset-password" onClick={() => setMenuOpen(false)}>Reset Password</Link></li>
          <li><button onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button></li>
        </ul>
      </nav>

      <div className="welcome-box">
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}
