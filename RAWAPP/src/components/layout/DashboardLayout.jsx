import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-black relative">

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden absolute top-4 left-4 z-50 text-[#00FF41] p-2 bg-black/80 border border-[#00FF41] rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        h-full border-r border-[rgba(0,255,65,0.2)] bg-[rgba(5,5,5,0.9)]
      `}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative w-full">
        {/* Background Grid Effect for the whole dashboard area */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}>
        </div>

        <div className="relative z-10 h-full pt-16 md:pt-0">
          {children}
        </div>
      </div>

    </div>
  );
}
