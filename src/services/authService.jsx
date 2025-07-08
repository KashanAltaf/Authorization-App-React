import axios from 'axios';

const api = axios.create({
  baseURL: 'https://authorization-app-react-server-production.up.railway.app',
  withCredentials: true, // ✅ Add this
});

export const register = data => api.post('/register', data);
export const login    = data => api.post('/login',    data);
export const sendOtp  = data => api.post('/send-otp', data);
export const verifyOtp= data => api.post('/verify-otp',data);
export const resetPwd = data => api.post('/reset_password', data);
