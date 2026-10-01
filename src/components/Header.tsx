import React from 'react';
import { 
  Search, Plus, Moon, Sun, Menu, X, Shield, 
  MapPin, Calendar, Activity, UserPlus, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onQuickRecord: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onQuickRecord }) => {
  const { 
    userRole, setUserRole, theme, toggleTheme, 
    setIsSearchOpen, activeTab, setActiveTab 
  } = useApp();

  const roles: UserRole[] = [
    'Cluster Coordinator',
    'Administrator',
    'Activity Coordinator',
    'Tutor/Animator/Teacher',
    'Viewer'
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Navigation Menu"
            id="mobile-menu-button"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Kimana Cluster
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Kenya
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Community Development Tracker
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            id="desktop-search-trigger"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-left">Search activities, people, localities...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Selector & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Mobile Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Search"
            id="mobile-search-trigger"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Record Button */}
          {userRole !== 'Viewer' && (
            <button
              onClick={onQuickRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm shadow-sm transition"
              id="quick-record-button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Record</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                aria-label="Select User Role"
                id="role-selector"
              >
                {roles.map(r => (
                  <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark/light theme"
            id="theme-toggle-button"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
