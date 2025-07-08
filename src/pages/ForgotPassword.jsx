// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/authService';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import '../styles/style.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      return Toastify({
        text: "Please enter your email.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#e74c3c"
      }).showToast();
    }

    try {
      const res = await sendOtp({ email: trimmed });
      if (res.data.ok) {
        Toastify({
          text: "OTP sent—check your email.",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "#2ecc71"
        }).showToast();
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(trimmed)}`);
        }, 1000);
      } else {
        throw new Error();
      }
    } catch {
      Toastify({
        text: "Failed to send OTP. Try again.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#e74c3c"
      }).showToast();
    }
  };

  return (
    <main className="fp-card-container">
      <form
        id="forgotPasswordForm"
        className="fp-form-card"
        onSubmit={handleSubmit}
      >
        <h2>Forgot Password</h2>
        <p>Enter your email address. We'll send you a 4-digit OTP.</p>

        <div className="fp-input-group">
          <label>Email</label>
          <div className="fp-input-wrapper">
            <span className="fp-icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit">Send OTP</button>
        </div>

        <a href="/" className="back-link">🔙</a>
      </form>
    </main>
  );
}
