import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDistributor = location.pathname.includes('admin');

  // Improved scroll function that accounts for the fixed header
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Height of your header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-white font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <div className="w-full border-b border-border-dark bg-background-dark/95 backdrop-blur sticky top-0 z-50 transition-all duration-300">
        <div className="px-4 md:px-10 py-4 max-w-7xl mx-auto w-full">
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="size-10 text-primary bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                <Flame size={24} fill="currentColor" />
              </div>
              <h2 className="text-white text-xl font-bold tracking-tight">SafeHP</h2>
            </Link>

            <div className="flex items-center gap-6">
              {!isDistributor && (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
                  {/* These buttons trigger the scroll */}
                  <button onClick={() => handleScroll('stats')} className="hover:text-primary transition-colors hover:scale-105 transform">My Score</button>
                  <button onClick={() => handleScroll('features')} className="hover:text-primary transition-colors hover:scale-105 transform">Features</button>
                </div>
              )}
              
              <Link 
                to={isDistributor ? "/?distributorId=Agency123" : "/admin"}
                className="text-xs md:text-sm font-medium text-white/50 hover:text-white border border-border-dark px-4 py-2 rounded-md transition-all hover:border-primary/50"
              >
                {isDistributor ? "Exit Admin" : "Distributor Login"}
              </Link>
            </div>
          </header>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;