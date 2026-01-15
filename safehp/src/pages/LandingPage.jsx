import React, { useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';
import { Flame, QrCode, ShieldCheck, ChevronRight, Camera } from 'lucide-react';
import QRScanner from '../components/QRScanner'; // Import Scanner

const LandingPage = () => {
  // State for Scanner Modal
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-primary selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className="p-6 border-b border-border-dark">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flame className="text-primary" fill="currentColor" />
            <span className="font-bold text-xl">SafeHP</span>
          </div>
          <Link to="/admin" className="text-sm font-medium text-text-muted hover:text-white">Admin Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Every Cylinder <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Tells a Story.</span>
          </h1>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Scan the QR code on your cylinder to access your household safety profile, take the quiz, and get certified.
          </p>

          {/* REAL SCANNER BUTTON */}
          <button 
            onClick={() => setShowScanner(true)}
            className="mb-12 bg-white text-background-dark text-lg font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
          >
            <Camera size={24} /> Scan Actual QR
          </button>

          {/* SIMULATION AREA (Keep for Demo) */}
          <div className="bg-card-dark border border-border-dark p-8 rounded-2xl max-w-4xl mx-auto w-full opacity-80 hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Or Click a Simulation Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile 1: Anita */}
              <Link to="/app?distributorId=Sector_104&userId=Anita_Sector104" className="group relative bg-background-dark p-6 rounded-xl border border-border-dark hover:border-primary transition-all text-center">
                <div className="bg-white p-2 rounded-lg w-fit mx-auto mb-4">
                   <QrCode className="text-black" size={32} />
                </div>
                <div className="font-bold text-white mb-1">Anita</div>
                <div className="text-xs text-text-muted">Sector 104</div>
              </Link>

              {/* Profile 2: Untitled/General */}
              <Link to="/app?distributorId=General_Dist&userId=General_User_01" className="group relative bg-background-dark p-6 rounded-xl border border-border-dark hover:border-primary transition-all text-center">
                <div className="bg-white p-2 rounded-lg w-fit mx-auto mb-4">
                   <QrCode className="text-black" size={32} />
                </div>
                <div className="font-bold text-white mb-1">General Profile</div>
                <div className="text-xs text-text-muted">Untitled QR</div>
              </Link>

              {/* Profile 3: New */}
              <Link to="/app?distributorId=Demo_Agency" className="group relative bg-background-dark p-6 rounded-xl border border-border-dark hover:border-primary transition-all text-center">
                 <div className="bg-white p-2 rounded-lg w-fit mx-auto mb-4">
                   <QrCode className="text-black" size={32} />
                </div>
                <div className="font-bold text-white mb-1">New User</div>
                <div className="text-xs text-text-muted">No ID Data</div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Render Scanner Modal */}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}

      <footer className="p-6 text-center text-text-muted text-sm border-t border-border-dark">
        &copy; 2026 SafeHP Initiative.
      </footer>
    </div>
  );
};

export default LandingPage;