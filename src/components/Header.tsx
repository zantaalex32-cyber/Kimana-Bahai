import React, { useState } from 'react';
import { 
  Search, Plus, Moon, Sun, Menu, X, Shield, 
  MapPin, Calendar, Activity, UserPlus, FileText,
  Lock, Unlock, Users, LogIn, LogOut, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { AppLogo } from './common/AppLogo';
import { InstallAppButton } from './common/InstallAppButton';
import { LiveSyncIndicator } from './common/LiveSyncIndicator';
import { isSystemAdminEmail } from '../services/firebase';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onQuickRecord: () => void;
  onOpenMultiEntry?: () => void;
  onOpenSecurityPin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobileMenu, 
  onQuickRecord,
  onOpenMultiEntry,
  onOpenSecurityPin
}) => {
  const { 
    userRole, setUserRole, theme, toggleTheme, 
    setIsSearchOpen, activeTab, setActiveTab,
    isSecurityUnlocked, currentUser, logout 
  } = useApp();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const isSysAdmin = isSystemAdminEmail(currentUser?.email);

  const roles: UserRole[] = [
    'Cluster Coordinator',
    'Administrator',
    'Activity Coordinator',
    'Tutor/Animator/Teacher',
    'Viewer'
  ];

  const allowedRoles = roles.filter(r => r !== 'Administrator' || isSysAdmin);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Button & Brand with New Logo */}
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
            className="cursor-pointer group flex items-center"
            id="brand-logo"
            title="Kimana Cluster Tracker - Dashboard"
          >
            <AppLogo size="md" showText={true} />
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

        {/* Right: Actions, Security Lock, Role Selector, Google Auth & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Search Mobile Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Search"
            id="mobile-search-trigger"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Contact Security Privacy Badge Button */}
          {onOpenSecurityPin && (
            <button
              onClick={onOpenSecurityPin}
              title={isSecurityUnlocked ? 'Contacts Unlocked (Click to manage privacy PIN)' : 'Sensitive Contacts Masked (Click to unlock)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isSecurityUnlocked
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
              id="security-pin-btn"
            >
              {isSecurityUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSecurityUnlocked ? 'Contacts Unlocked' : 'Protected'}</span>
            </button>
          )}

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

          {/* Live Multi-User Sync Indicator */}
          <LiveSyncIndicator compact />

          {/* Role Switcher */}
          {currentUser?.isAnonymous ? (
            <div 
              className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed select-none"
              title="Guest session is locked to Viewer (read-only). Sign in with Google to change roles."
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Viewer (Guest)</span>
            </div>
          ) : (
            <div className="relative group hidden sm:block">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1 text-slate-900 dark:text-white"
                  aria-label="Select User Role"
                  id="role-selector"
                >
                  {allowedRoles.map(r => (
                    <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Google Auth Status / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                id="user-profile-menu-button"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google Account'}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.displayName?.[0]?.toUpperCase() || 'G'}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left text-xs leading-none">
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                    {currentUser.displayName || 'User'}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[100px]">
                    {userRole}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Account Dropdown Menu */}
              {showAccountDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 z-50 text-xs"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email || 'Guest Visitor (Read-Only Viewer)'}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-emerald-600">Active Role:</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('login')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manage Account & Roles</span>
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              id="header-login-button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              {/* Google G mini icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          {/* Download App to Browser / Device Button */}
          <InstallAppButton variant="header" label="Download App" />

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
