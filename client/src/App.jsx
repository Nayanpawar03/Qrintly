import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import GenerateQrPage from './pages/GenerateQrPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import UploadPage from './pages/UploadPage';
import TrackJobPage from './pages/TrackJobPage';
import LandingPage from './pages/LandingPage';
import SecurityPage from './pages/SecurityPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/upload/:shopId" element={<UploadPage />} />
      <Route path="/track/:jobId" element={<TrackJobPage />} />
      <Route path="/security" element={<SecurityPage />} />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/generate-qr"
        element={
          <ProtectedRoute>
            <GenerateQrPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;