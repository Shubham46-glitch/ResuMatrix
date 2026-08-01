import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Report from './pages/Report';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import InterviewPrep from './pages/InterviewPrep';
import InterviewSession from './pages/InterviewSession';
import InterviewResult from './pages/InterviewResult';
import InterviewHistory from './pages/InterviewHistory';
import DashboardLayout from './components/DashboardLayout';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route element={user ? <DashboardLayout /> : <Navigate to="/signup" />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/interview/prep/:reportId" element={<InterviewPrep />} />
          <Route path="/interview/session/:interviewId" element={<InterviewSession />} />
          <Route path="/interview/result/:interviewId" element={<InterviewResult />} />
          <Route path="/interview/history" element={<InterviewHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
