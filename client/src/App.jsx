import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';

import { StreamSessionProvider } from './context/StreamSessionContext';

import FindDoctors from './pages/FindDoctors';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAvailability from './pages/DoctorAvailability';

import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorViewPrescription from './pages/DoctorViewPrescription';
import DoctorOnboarding from './pages/DoctorOnboarding';
import VideoCallPage from './pages/VideoCallPage';
import ChatPage from './pages/ChatPage';
import CreatePrescription from './pages/CreatePrescription';
import MyPrescriptions from './pages/MyPrescriptions';
import UploadLabReport from './pages/UploadLabReport';
import ViewReportsDoctor from './pages/ViewReportsDoctor';
import SymptomChecker from './pages/SymptomChecker';
import AmbulanceBooking from './pages/AmbulanceBooking';
import HealthTracker from './pages/HealthTracker';
import PatientVitals from './pages/PatientVitals';

import useAutoLogout from './hooks/useAutoLogout';

const AutoLogoutHandler = () => {
  useAutoLogout(); // Default 15 mins
  return null;
};

import Home from './pages/Home';

// ... imports ...

function App() {
  return (
    <Router>
      <AutoLogoutHandler />
      <StreamSessionProvider>
        <Routes>
          {/* Unified Home Route */}
          <Route path="/" element={<Home />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />

          {/* /dashboard is now handled by / (Home) if logged in. 
              Keeping /dashboard as a redirect or alias is optional, 
              but usually cleaner to remove or redirect if used by bookmarks.
              For now, we remove it and rely on Home. 
          */}

          <Route path="/doctor/onboarding" element={
            <ProtectedRoute>
              <DoctorOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/find-doctors" element={
            <ProtectedRoute>
              <FindDoctors />
            </ProtectedRoute>
          } />
          <Route path="/my-appointments" element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments/:id/prescription" element={
            <ProtectedRoute>
              <DoctorViewPrescription />
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescriptions" element={
            <ProtectedRoute>
              <DoctorPrescriptions />
            </ProtectedRoute>
          } />
          <Route path="/doctor/availability" element={
            <ProtectedRoute>
              <DoctorAvailability />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:appointmentId/call" element={
            <ProtectedRoute>
              <VideoCallPage />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:appointmentId/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments/:id/prescribe" element={
            <ProtectedRoute>
              <CreatePrescription />
            </ProtectedRoute>
          } />
          <Route path="/patient/prescriptions" element={
            <ProtectedRoute>
              <MyPrescriptions />
            </ProtectedRoute>
          } />
          <Route path="/patient/reports/upload" element={
            <ProtectedRoute>
              <UploadLabReport />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patient/:id/reports" element={
            <ProtectedRoute>
              <ViewReportsDoctor />
            </ProtectedRoute>
          } />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/ambulance/book" element={
            <ProtectedRoute>
              <AmbulanceBooking />
            </ProtectedRoute>
          } />
          <Route path="/patient/health-tracker" element={
            <ProtectedRoute>
              <HealthTracker />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patient/:id/vitals" element={
            <ProtectedRoute>
              <PatientVitals />
            </ProtectedRoute>
          } />
        </Routes>
      </StreamSessionProvider>
    </Router>
  );
}

export default App;
