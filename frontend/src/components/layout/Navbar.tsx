import React, { useEffect, useState } from 'react';
import { Droplet, ShieldAlert, CheckCircle2, Clock, MapPin, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { HealthStatus } from '../../types';

interface NavbarProps {
  currentLocation?: string;
  onRefresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLocation = 'Anantapur Basin', onRefresh }) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.getHealth();
        setHealth(data);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (e) {
        console.error('Failed to load system health', e);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-700 flex items-center justify-center text-white shadow-xs">
          <Droplet className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-slate-900 tracking-tight text-lg">DroughtSense</h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              EHDS-2026
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            ML Framework for Drought Prediction & Early Warning
          </p>
        </div>
      </div>

      {/* Meta indicators */}
      <div className="flex items-center space-x-4">
        {/* Monitored region */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-slate-400">Region:</span>
          <span className="font-medium text-slate-800 truncate max-w-[140px]">{currentLocation}</span>
        </div>

        {/* System & Model status */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium hidden sm:inline">Active Model:</span>
            <span className="font-semibold text-emerald-900">{health?.active_model || 'Random Forest'}</span>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Demo Mode</span>
          </div>
        </div>

        {/* Last updated and refresh */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
          <div className="text-[11px] text-slate-500 hidden lg:flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{lastUpdated ? `Sync: ${lastUpdated}` : 'Connecting...'}</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Analytics"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
