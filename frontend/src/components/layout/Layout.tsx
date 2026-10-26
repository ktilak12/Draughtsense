import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {/* Demo mode alert banner */}
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded font-bold bg-amber-200 text-amber-900 uppercase tracking-wide">
                Demo Environment
              </span>
              <span>
                Demonstration platform initialized with synthetic hydrometeorological stations (Anantapur, Marathwada, Jodhpur, Vidarbha, Bundelkhand). All indicators are simulated for academic research demonstration.
              </span>
            </div>
            <span className="hidden md:inline font-medium text-amber-700">Course EHDS-2026</span>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
