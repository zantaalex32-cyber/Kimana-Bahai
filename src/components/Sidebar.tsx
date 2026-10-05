import React from 'react';
import { 
  LayoutDashboard, MapPin, Users, CalendarCheck, BookOpen, 
  Sparkles, GraduationCap, HeartHandshake, Home, PlaneTakeoff, 
  UserPlus, Calendar, ListTodo, BarChart3, RotateCw, Settings,
  LogIn, UserCheck, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { AppLogo } from './common/AppLogo';
import { InstallAppButton } from './common/InstallAppButton';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, followUps, currentUser, userRole } = useApp();

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
    <aside className="hidden lg:flex flex-col w-64 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 gap-1 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Navigation
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
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

        {/* Dedicated Account / Login Tab */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('login')}
            id="nav-login"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition border ${
              activeTab === 'login'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold'
                : currentUser
                ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {currentUser ? (
                currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                )
              ) : (
                <LogIn className="w-4 h-4 text-emerald-600" />
              )}
              <div className="text-left truncate">
                <span className="block truncate font-semibold text-xs">
                  {currentUser ? (currentUser.displayName || 'Google Account') : 'Google Sign-In'}
                </span>
                <span className="block text-[10px] opacity-75 truncate">
                  {userRole}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {currentUser ? 'Active' : 'Auth'}
            </span>
          </button>
        </div>
      </nav>

      {/* Download / Install Application PWA card */}
      <div className="pt-2">
        <InstallAppButton variant="sidebar" />
      </div>

      {/* Cluster Emblem Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 px-2">
        <AppLogo size="sm" showText={false} />
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Kimana Cluster</p>
          <p className="text-[11px]">Kajiado South, Kenya</p>
        </div>
      </div>
    </aside>
  );
};
