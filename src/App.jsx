import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Welcome from './pages/Welcome';
import Contacts from './pages/Contacts';

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/welcome"
            element={<Protected><Welcome /></Protected>}
          />
          <Route
            path="/contacts"
            element={<Protected><Contacts /></Protected>} // ✅ Protected route
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
