import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHome from './pages/UserHome';
import DistributorDashboard from './pages/DistributorDashboard';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/admin" element={<DistributorDashboard />} />
        </Routes>
    </Router>
  );
}

export default App;