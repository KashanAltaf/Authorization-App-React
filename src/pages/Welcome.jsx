import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/style.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout from context

  const handleLogout = () => {
    logout(); // Call the centralized logout function
    navigate('/');
  };

  // Derive role directly from the user object from context
  const roleText = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

  return (
    <div className="welcome-page">
      <header className="header">
        <h2>Welcome, <span id="roleText">{roleText}</span>!</h2>
        <button className="logout-btn" id="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="welcome-box">
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}