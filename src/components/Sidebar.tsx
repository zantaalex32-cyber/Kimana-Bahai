import React from 'react';
import { 
  LayoutDashboard, MapPin, Users, CalendarCheck, BookOpen, 
  Sparkles, GraduationCap, HeartHandshake, Home, PlaneTakeoff, 
  UserPlus, Calendar, ListTodo, BarChart3, RotateCw, Settings,
  ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, followUps, friendsComingIn, friendsGoingOut } = useApp();

  const pendingFollowUps = followUps.filter(f => f.status === 'Pending' || f.status === 'In Progress').length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'localities', label: 'Localities', icon: MapPin },
    { id: 'people', label: 'People / Friends', icon: Users },
    { id: 'friendscomingin', label: 'Friends Coming In', icon: ArrowDownRight, badge: friendsComingIn.length },
    { id: 'friendsgoingout', label: 'Friends Going Out', icon: ArrowUpRight, badge: friendsGoingOut.length },
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
      </nav>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 px-3">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Kimana Cluster</p>
        <p>Kajiado South, Kenya</p>
      </div>
    </aside>
  );
};
