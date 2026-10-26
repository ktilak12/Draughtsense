import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  Database,
  Map,
  TrendingUp,
  Cpu,
  History,
  Settings,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/prediction', label: 'Drought Prediction', icon: BrainCircuit },
  { path: '/data', label: 'Environmental Data', icon: Database },
  { path: '/map', label: 'Drought Risk Map', icon: Map },
  { path: '/analytics', label: 'Trends & Analytics', icon: TrendingUp },
  { path: '/models', label: 'Model Performance', icon: Cpu },
  { path: '/history', label: 'Prediction History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About Project', icon: Info },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="py-5 px-3">
        <div className="px-3 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Navigation
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Academic Attribution footer */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Academic Project</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          EHDS-2026 Project 1 Team: Vyoam Joshi, Midhu John, Tilak
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[10px] text-slate-500">
          <span>v1.0.0 Stable</span>
          <span className="text-emerald-400">SPI/SPEI Verified</span>
        </div>
      </div>
    </aside>
  );
};
