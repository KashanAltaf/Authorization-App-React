// src/pages/Welcome.jsx
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

  const toggleMenu = () => {
    setMenuOpen(o => {
      console.log('menuOpen →', !o);
      return !o;
    });
  };

  const roleText = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'User';

  return (
    <div className="welcome-page">
      <header className="header">
        {/* Move hamburger into header */}
        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h2>Welcome, <span id="roleText">{roleText}</span>!</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {menuOpen && (
          <div className="menu-dropdown header-dropdown">
            <Link to="/contacts" className="menu-item-btn">
              Contact List
            </Link>
          </div>
        )}
      </header>

      <div className="welcome-box">
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}
