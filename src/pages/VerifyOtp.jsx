import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/authService';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import '../styles/style.css';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const email = params.get('email') || '';

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const inputsRef = useRef([]);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [timerTrigger, setTimerTrigger] = useState(0); // State to trigger timer restart

  // Start countdown. This effect now re-runs whenever timerTrigger changes.
  useEffect(() => {
    setCanResend(false);
    setSecondsLeft(60);
    const timerId = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timerTrigger]); // Dependency on the trigger

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otpValues];
    newOtp[idx] = val;
    setOtpValues(newOtp);
    if (val && idx < 3) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== 4) {
      return Toastify({
        text: 'Please enter all 4 digits.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }
    try {
      const res = await verifyOtp({ email, otp });
      if (res.data.ok) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        const msg = res.data.err === 'expired'
          ? 'OTP has expired.'
          : res.data.err === 'mismatch'
          ? 'Email mismatch.'
          : 'Invalid OTP. Please try again.';
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
        text: 'Server error. Please try again.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }
  };

  const handleResend = async e => {
    e.preventDefault();
    if (!canResend) return;
    try {
      const res = await sendOtp({ email });
      Toastify({
        text: res.data.ok ? 'OTP resent successfully.' : 'Failed to resend OTP.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: res.data.ok ? '#2ecc71' : '#e74c3c'
      }).showToast();
      
      // Restart timer by updating the trigger
      if (res.data.ok) {
        setTimerTrigger(prev => prev + 1);
      }
    } catch {
      Toastify({
        text: 'Network error. Try again.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#e74c3c'
      }).showToast();
    }
  };

  return (
    <main className="otp-card-container">
      <form id="otpForm" className="otp-form-card" onSubmit={handleSubmit}>
        <h2>Enter OTP</h2>
        <p>We've sent a 4-digit code to<br /><strong id="userEmail">{email}</strong></p>

        <div id="otp-input-group" className="otp-input-group">
          <p className="otp-input-label" id="otp-label">Verification Code</p>
          <div className="otp-boxes" role="group" aria-labelledby="otp-label">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                className="otp-box"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength="1"
                aria-label={`Digit ${idx + 1}`}
                value={val}
                onChange={e => handleInput(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
              />
            ))}
          </div>
        </div>

        <button type="submit" id="submitButton">Verify</button>

        <div className="otp-resend-container">
          Didn't receive code?
          <a
            href="#"
            id="resendLink"
            className={`otp-resend-link${canResend ? '' : ' disabled'}`}
            aria-disabled={!canResend}
            onClick={handleResend}
          >
            Resend
          </a>
          <span id="timer" className="timer">
            {secondsLeft > 0 ? `(${secondsLeft}s)` : ''}
          </span>
        </div>

        <a href="/forgot-password" className="back-link" aria-label="Back to previous page">
          <span aria-hidden="true">🔙</span> Back
        </a>
      </form>
    </main>
  );
}