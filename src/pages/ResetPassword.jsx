// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPwd } from '../services/authService';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import '../styles/style.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const emailParam = params.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strengthPct, setStrengthPct] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [submitted, setSubmitted] = useState(false);

  // Password rules
  const rules = {
    length: pwd => pwd.length >= 8,
    uppercase: pwd => /[A-Z]/.test(pwd),
    number:    pwd => /[0-9]/.test(pwd),
    special:   pwd => /[^A-Za-z0-9]/.test(pwd),
  };

  // Update strength & criteria on password change
  useEffect(() => {
    let passed = 0;
    const updated = {};
    Object.entries(rules).forEach(([key, test]) => {
      const ok = test(newPassword);
      updated[key] = ok;
      if (ok) passed++;
    });
    setCriteria(updated);
    setStrengthPct((passed / Object.keys(rules).length) * 100);
  }, [newPassword]);

  // Show/hide password
  const togglePassword = eye => {
    const inp = eye.previousElementSibling;
    inp.type = inp.type === 'password' ? 'text' : 'password';
    eye.textContent = inp.type === 'password' ? '👁️' : '🙈';
  };

  // Form submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return Toastify({
        text: 'Passwords do not match.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }
    if (strengthPct < 100) {
      return Toastify({
        text: 'Password does not meet all criteria.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }

    try {
      const res = await resetPwd({ email: emailParam, newPassword });
      if (res.data.ok) {
        setSubmitted(true);
      } else {
        const msg = res.data.err === 'samepass'
          ? 'New password cannot be the same as the old one.'
          : 'Error: ' + res.data.err;
        Toastify({
          text: `❌ ${msg}`,
          duration: 3000,
          gravity: 'top',
          position: 'center',
          backgroundColor: '#e74c3c'
        }).showToast();
      }
    } catch {
      Toastify({
        text: 'Server error. Try again.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }
  };

  if (submitted) {
    return (
      <main className="rp-form-card-container">
        <section className="rp-form-card rp-success">
          <h2>Password Reset!</h2>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <a href="/" className="rp-success-login-button">Go to Login</a>
        </section>
      </main>
    );
  }

  return (
    <main className="rp-form-card-container" >
      <form id="resetPasswordForm" className="rp-form-card" onSubmit={handleSubmit} style={{ width:'420px'}} noValidate>
        <h2>Set New Password</h2>
        <p>Email: <strong id="userEmail">{emailParam}</strong></p>
        <input type="hidden" id="emailInput" name="email" value={emailParam} />

        <div className="rp-input-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="rp-input-wrapper">
            <span className="rp-icon">🔑</span>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              aria-describedby="criteriaList"
            />
            <span className="rp-icon rp-eye" onClick={e => togglePassword(e.target)}>👁️</span>
          </div>
        </div>

        <div className="rp-password-strength">
          <div className="rp-strength-bar" style={{ width: `${strengthPct}%` }} />
        </div>

        <ul id="criteriaList" className="rp-password-criteria">
          <li className={criteria.length ? 'valid' : ''}>At least 8 characters</li>
          <li className={criteria.uppercase ? 'valid' : ''}>At least one uppercase letter</li>
          <li className={criteria.number ? 'valid' : ''}>At least one number</li>
          <li className={criteria.special ? 'valid' : ''}>At least one special character</li>
        </ul>

        <div className="rp-input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="rp-input-wrapper">
            <span className="rp-icon">🔑</span>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <span className="rp-icon rp-eye" onClick={e => togglePassword(e.target)}>👁️</span>
          </div>
        </div>

        <button type="submit" id="submitButton" className="rp-submit">Reset Password</button>
      </form>
    </main>
  );
}
