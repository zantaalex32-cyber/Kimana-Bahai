import React, { useState } from 'react';
import { 
  Users, UserPlus, MapPin, BookOpen, Sparkles, GraduationCap, 
  HeartHandshake, Home, Calendar, AlertCircle, PlaneTakeoff, 
  HelpCircle, ArrowUpRight, TrendingUp, Filter, ChevronRight, CheckCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC<{ onQuickRecord: () => void }> = ({ onQuickRecord }) => {
  const { 
    localities, people, activities, studyCircles, 
    childrenClasses, juniorYouthGroups, devotionals, 
    homeVisits, serviceVisits, newBahais, followUps, 
    cycles, currentCycleId, dateFilter, setDateFilter, 
    selectedLocalityFilter, setSelectedLocalityFilter,
    setActiveTab 
  } = useApp();

  const [activeQuickTab, setActiveQuickTab] = useState<'happening' | 'growth' | 'visits' | 'followup'>('happening');

  // Filter calculations based on dateFilter and localityFilter
  const filteredActivities = activities.filter(a => {
    if (selectedLocalityFilter !== 'all' && a.localityId !== selectedLocalityFilter) return false;
    if (dateFilter === 'cycle' && a.cycleId !== currentCycleId) return false;
    
    const actDate = new Date(a.date);
    const now = new Date();
    
    if (dateFilter === 'today') {
      return a.date === now.toISOString().split('T')[0];
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return actDate >= weekAgo;
    }
    if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return actDate >= monthAgo;
    }
    return true;
  });

  // Calculate high-level stats
  const totalBahais = localities.reduce((sum, l) => sum + l.bahaiCount, 0);
  const totalNewBahais = newBahais.length;
  const activeLocalitiesCount = localities.filter(l => !l.archived).length;
  const studyCirclesCount = studyCircles.filter(s => s.isActive).length;
  const childrenClassesCount = childrenClasses.filter(c => c.isActive).length;
  const juniorYouthGroupsCount = juniorYouthGroups.filter(j => j.isActive).length;
  const devotionalsCount = devotionals.length;
  const homeVisitsCount = homeVisits.length;
  const scheduledActivitiesCount = filteredActivities.filter(a => a.status === 'Scheduled').length;
  const upcomingVisitsCount = serviceVisits.filter(v => v.status === 'Planned' || v.status === 'In Progress').length;
  const pendingFollowUpsCount = followUps.filter(f => f.status === 'Pending' || f.status === 'In Progress').length;

  // Chart Data Preparation:
  // 1. Activities by Type
  const typeCounts: Record<string, number> = {};
  filteredActivities.forEach(a => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });
  const activitiesByTypeData = Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // 2. Activities by Locality
  const localityCounts: Record<string, number> = {};
  filteredActivities.forEach(a => {
    localityCounts[a.localityName] = (localityCounts[a.localityName] || 0) + 1;
  });
  const activitiesByLocalityData = Object.keys(localityCounts).map(loc => ({
    name: loc,
    count: localityCounts[loc]
  }));

  // Find locality with most activities
  let topLocality = 'Kimana Town';
  let topCount = 0;
  Object.entries(localityCounts).forEach(([loc, cnt]) => {
    if (cnt > topCount) {
      topCount = cnt;
      topLocality = loc;
    }
  });

  // 3. Total Participation Numbers
  const totalChildrenCount = childrenClasses.reduce((sum, c) => sum + c.averageAttendance, 0);
  const totalJYCount = juniorYouthGroups.reduce((sum, j) => sum + j.averageAttendance, 0);
  const totalAdultSCParticipants = studyCircles.reduce((sum, s) => sum + s.participants.length, 0);

  // 4. Growth Trend Data
  const growthTrendData = [
    { month: 'Mar', count: 185 },
    { month: 'Apr', count: 194 },
    { month: 'May', count: 202 },
    { month: 'Jun', count: 208 },
    { month: 'Jul', count: 212 },
    { month: 'Aug', count: totalBahais }
  ];

  // Stat Card Item List
  const statCards = [
    { title: 'Total Bahá’ís', value: totalBahais, icon: Users, color: 'emerald', tab: 'localities' as const },
    { title: 'New Bahá’ís', value: totalNewBahais, icon: UserPlus, color: 'blue', tab: 'newbahais' as const },
    { title: 'Active Localities', value: activeLocalitiesCount, icon: MapPin, color: 'teal', tab: 'localities' as const },
    { title: 'Study Circles', value: studyCirclesCount, icon: BookOpen, color: 'indigo', tab: 'studycircles' as const },
    { title: 'Children’s Classes', value: childrenClassesCount, icon: Sparkles, color: 'amber', tab: 'childrensclasses' as const },
    { title: 'Junior Youth Groups', value: juniorYouthGroupsCount, icon: GraduationCap, color: 'purple', tab: 'junioryouth' as const },
    { title: 'Devotionals', value: devotionalsCount, icon: HeartHandshake, color: 'rose', tab: 'devotionals' as const },
    { title: 'Home Visits', value: homeVisitsCount, icon: Home, color: 'cyan', tab: 'homevisits' as const },
    { title: 'Scheduled Activities', value: scheduledActivitiesCount, icon: Calendar, color: 'sky', tab: 'activities' as const },
    { title: 'Visiting / Travelling', value: upcomingVisitsCount, icon: PlaneTakeoff, color: 'orange', tab: 'visits' as const },
    { title: 'Follow-Ups Pending', value: pendingFollowUpsCount, icon: AlertCircle, color: 'red', tab: 'followups' as const },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Filter Controls */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kimana Cluster • Cycle 14 Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kimana Community Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Centralized monitoring for local community-building activities, study circles, junior youth, children's classes, and expansion in Kimana.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <Filter className="w-3.5 h-3.5" />
              <span>Timeframe:</span>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="bg-slate-900/80 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
              aria-label="Filter timeframe"
              id="dashboard-timeframe-filter"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="cycle">Current Cycle</option>
            </select>

            <select
              value={selectedLocalityFilter}
              onChange={(e) => setSelectedLocalityFilter(e.target.value)}
              className="bg-slate-900/80 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
              aria-label="Filter locality"
              id="dashboard-locality-filter"
            >
              <option value="all">All Localities</option>
              {localities.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Answers Section: "What's happening in Kimana this week?" */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Kimana Community At A Glance
            </h2>
          </div>
          <div className="flex gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveQuickTab('happening')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeQuickTab === 'happening' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveQuickTab('growth')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeQuickTab === 'growth' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Participation & Localities
            </button>
            <button
              onClick={() => setActiveQuickTab('visits')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeQuickTab === 'visits' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Service & Visits
            </button>
            <button
              onClick={() => setActiveQuickTab('followup')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeQuickTab === 'followup' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Follow-ups ({pendingFollowUpsCount})
            </button>
          </div>
        </div>

        <div className="pt-4">
          {activeQuickTab === 'happening' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                What's Happening in Kimana This Week:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activities.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {a.type}
                        </span>
                        <span className="text-xs text-slate-500">{a.date}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white mt-1.5">
                        {a.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        📍 {a.localityName} • {a.venue}
                      </p>
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span>Resp: {a.personResponsible}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeQuickTab === 'growth' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Top Active Locality</span>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mt-1">{topLocality}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{topCount} recorded activities</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900">
                <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Total Active Participants</span>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {totalChildrenCount + totalJYCount + totalAdultSCParticipants}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {totalChildrenCount} Children, {totalJYCount} JY, {totalAdultSCParticipants} SC Adults
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">New Bahá’í Declarations</span>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-200 mt-1">+{totalNewBahais} Friends</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Enrolled in institute courses</p>
              </div>
            </div>
          )}

          {activeQuickTab === 'visits' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-semibold">Friends Travelling or Visiting Communities:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceVisits.map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.direction === 'Outbound' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {v.direction}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{v.personName}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">
                        {v.origin} ➔ {v.destination}
                      </p>
                      <p className="text-slate-500">{v.purpose} ({v.startDate})</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 font-semibold">
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeQuickTab === 'followup' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-semibold">Action Items Needing Follow-up:</p>
              <div className="space-y-2">
                {followUps.slice(0, 3).map(f => (
                  <div key={f.id} className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{f.title}</p>
                      <p className="text-slate-600 dark:text-slate-400">Assigned: {f.responsiblePerson} • Due: {f.dueDate}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold">
                      {f.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(card.tab as any)}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
              id={`stat-card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-950 text-${card.color}-600 dark:text-${card.color}-400 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Activities by Type */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Activities by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution of activities across Kimana</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
              {filteredActivities.length} Total
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activitiesByTypeData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Growth in Bahá’í Community */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Community Growth Trend
              </h3>
              <p className="text-xs text-slate-500">Total Bahá’í population growth in Kimana Cluster</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.5%</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrendData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Localities Activity Overview Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Localities Activity Summary
            </h3>
            <p className="text-xs text-slate-500">Active human resources and core activities per locality</p>
          </div>
          <button 
            onClick={() => setActiveTab('localities')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All Localities <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Locality Name</th>
                <th className="p-3">Bahá'ís</th>
                <th className="p-3">Children Classes</th>
                <th className="p-3">JY Groups</th>
                <th className="p-3">Study Circles</th>
                <th className="p-3">Devotionals</th>
                <th className="p-3">Key Serving Friends</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {localities.map(loc => (
                <tr key={loc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{loc.name}</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{loc.bahaiCount}</td>
                  <td className="p-3">{loc.childrenClassesCount}</td>
                  <td className="p-3">{loc.juniorYouthGroupsCount}</td>
                  <td className="p-3">{loc.studyCirclesCount}</td>
                  <td className="p-3">{loc.devotionalMeetingsCount}</td>
                  <td className="p-3 text-slate-500 truncate max-w-xs">
                    {loc.humanResources.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
