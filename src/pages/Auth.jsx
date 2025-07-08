import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toastify from 'toastify-js';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { login, register } from '../services/authService'; // Import API functions
import '../styles/style.css';

export default function Auth() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', role: 'user' });
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Get setToken from context

  // Panel toggle handlers
  const handleSignUpClick = e => { e.preventDefault(); setIsSignUpActive(true); };
  const handleSignInClick = e => { e.preventDefault(); setIsSignUpActive(false); };

  // Shared eye-toggle
  const togglePassword = eye => {
    const inp = eye.previousElementSibling;
    inp.type = inp.type === 'password' ? 'text' : 'password';
    eye.textContent = inp.type === 'password' ? '👁️' : '🙈';
  };

  // Login submit
  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await login(loginForm); // Use the authService function
      if (res.data.ok && res.data.token) {
        setToken(res.data.token); // Set token in context
        navigate('/welcome');
      } else {
        throw new Error(res.data.err || 'Invalid login');
      }
    } catch (err) {
      Toastify({ text: `❌ ${err.message || 'Invalid login.'}`, duration: 3000, gravity: 'top', position: 'center' }).showToast();
    }
  };

  // Sign-Up submit
  const handleRegister = async e => {
    e.preventDefault();
    try {
      const res = await register(signUpForm); // Use the authService function
      if (res.data.ok) {
        Toastify({ text: '✅ Registration successful! Please log in.', duration: 3000, gravity: 'top', position: 'center' }).showToast();
        setIsSignUpActive(false);
        setSignUpForm({ email: '', password: '', role: 'user' });
      } else {
        const msg = res.data.err === 'weakpass'
          ? '❌ Weak password!'
          : res.data.err === 'register'
          ? '❌ Email already exists.'
          : '❌ Registration error.';
        Toastify({ text: msg, duration: 3000, gravity: 'top', position: 'center' }).showToast();
      }
    } catch {
      Toastify({ text: '❌ Network error.', duration: 3000, gravity: 'top', position: 'center' }).showToast();
    }
  };

  return (
    <div
      className={`container${isSignUpActive ? ' right-panel-active' : ''}`}
      id="container"
    >
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form id="signupForm" onSubmit={handleRegister}>
          <h2>Create Account</h2>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={signUpForm.email}
                onChange={e => setSignUpForm({ ...signUpForm, email: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Password
              <sup className="info-icon" title="Password must:…">ℹ️</sup>
            </label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={signUpForm.password}
                onChange={e => setSignUpForm({ ...signUpForm, password: e.target.value })}
              />
              <span className="icon eye" onClick={e => togglePassword(e.target)}>👁️</span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Role</label>
            <div className="role-toggle">
              <input
                type="radio" id="role-user" name="role" value="user"
                checked={signUpForm.role === 'user'}
                onChange={() => setSignUpForm({ ...signUpForm, role: 'user' })}
              />
              <label htmlFor="role-user">User</label>
              <input
                type="radio" id="role-admin" name="role" value="admin"
                checked={signUpForm.role === 'admin'}
                onChange={() => setSignUpForm({ ...signUpForm, role: 'admin' })}
              />
              <label htmlFor="role-admin">Admin</label>
            </div>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form id="loginForm" onSubmit={handleLogin}>
          <h2>Sign In</h2>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <span className="icon eye" onClick={e => togglePassword(e.target)}>👁️</span>
            </div>
          </div>

          <button type="submit">Sign In</button>
          <div className="actions">
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>
        </form>
      </div>

      {/* Overlay Panels */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Already have an Account?</h2>
            <p>Please Login</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>New Here?</h2>
            <p>Please Sign Up</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}