import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserHome from './pages/UserHome';
import DistributorDashboard from './pages/DistributorDashboard';

function App() {
  return (
    <Router>
        <Routes>
          {/* Main Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* User Dashboard (The destination after scanning) */}
          <Route path="/app" element={<UserHome />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<DistributorDashboard />} />
        </Routes>
    </Router>
  );
}

export default App;