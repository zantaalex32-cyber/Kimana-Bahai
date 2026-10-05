import React from 'react';
import { 
  X, LayoutDashboard, MapPin, Users, CalendarCheck, BookOpen, 
  Sparkles, GraduationCap, HeartHandshake, Home, PlaneTakeoff, 
  UserPlus, Calendar, ListTodo, BarChart3, RotateCw, Settings,
  LogIn, UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { AppLogo } from './common/AppLogo';
import { InstallAppButton } from './common/InstallAppButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, followUps, currentUser, userRole } = useApp();

  if (!isOpen) return null;

  const pendingFollowUps = followUps.filter(f => f.status === 'Pending' || f.status === 'In Progress').length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'localities', label: 'Localities', icon: MapPin },
    { id: 'people', label: 'People / Friends', icon: Users },
    { id: 'activities', label: 'Activities', icon: CalendarCheck },
    { id: 'studycircles', label: 'Study Circles', icon: BookOpen },
    { id: 'childrensclasses', label: 'Children\'s Classes', icon: Sparkles },
    { id: 'junioryouth', label: 'Junior Youth', icon: GraduationCap },
    { id: 'devotionals', label: 'Devotionals', icon: HeartHandshake },
    { id: 'homevisits', label: 'Home Visits', icon: Home },
    { id: 'visits', label: 'Service & Visits', icon: PlaneTakeoff },
    { id: 'newbahais', label: 'New Bahá’ís', icon: UserPlus },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'followups', label: 'Follow-Ups', icon: ListTodo, badge: pendingFollowUps },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'cycles', label: 'Cycles', icon: RotateCw },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        id="mobile-nav-backdrop"
      />

      {/* Drawer */}
      <div className="relative flex-1 max-w-xs w-full bg-white dark:bg-slate-900 h-full flex flex-col p-4 shadow-xl z-10 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <AppLogo size="sm" showText={true} />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close Navigation Menu"
            id="close-mobile-nav"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Account / Login */}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveTab('login');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition border ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                {currentUser ? (
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <LogIn className="w-4 h-4 text-emerald-600" />
                )}
                <span className="truncate">
                  {currentUser ? (currentUser.displayName || 'Google Account') : 'Sign in with Google'}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10">
                {currentUser ? userRole : 'Login'}
              </span>
            </button>
          </div>

          {/* Download App */}
          <div className="pt-2">
            <InstallAppButton variant="compact" label="Download App to Device" className="w-full justify-center" />
          </div>
        </nav>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Kimana Cluster App</p>
          <p>Kajiado South, Kenya</p>
        </div>

      </div>
    </div>
  );
};
