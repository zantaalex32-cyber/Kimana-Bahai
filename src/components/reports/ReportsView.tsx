import React, { useState } from 'react';
import { 
  BarChart3, FileText, Download, Copy, Check, Printer, 
  MapPin, Users, BookOpen, Sparkles, GraduationCap, HeartHandshake, 
  RotateCw, Calendar, TrendingUp, Filter 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { 
    localities, people, activities, studyCircles, 
    childrenClasses, juniorYouthGroups, devotionals, 
    homeVisits, serviceVisits, newBahais, cycles, currentCycleId 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<string>(currentCycleId || cycles[0]?.id || 'c1');

  const activeCycle = cycles.find(c => c.id === selectedCycleId) || cycles[0];

  // Core Statistics
  const totalBahais = localities.reduce((sum, l) => sum + l.bahaiCount, 0);
  const totalNewDeclarations = newBahais.length;
  
  const activeStudyCircles = studyCircles.filter(s => s.isActive);
  const activeChildrenClasses = childrenClasses.filter(c => c.isActive);
  const activeJYGroups = juniorYouthGroups.filter(j => j.isActive);
  const totalDevotionals = devotionals.length;
  const totalHomeVisits = homeVisits.length;

  const totalSCParticipants = activeStudyCircles.reduce((sum, s) => sum + s.participants.length, 0);
  const totalCCParticipants = activeChildrenClasses.reduce((sum, c) => sum + c.averageAttendance, 0);
  const totalJYParticipants = activeJYGroups.reduce((sum, j) => sum + j.averageAttendance, 0);

  // Growth & Goal Analysis for Selected Cycle
  const scGoal = activeCycle?.goals?.studyCirclesGoal || 0;
  const ccGoal = activeCycle?.goals?.childrenClassesGoal || 0;
  const jyGoal = activeCycle?.goals?.juniorYouthGroupsGoal || 0;
  const devGoal = activeCycle?.goals?.devotionalsGoal || 0;
  const newBahaisGoal = activeCycle?.goals?.newBahaisGoal || 0;

  const generateTextSummary = () => {
    return `
========================================
KIMANA CLUSTER COMMUNITY REPORT
Period / Cycle: ${activeCycle?.name || 'Current'}
========================================

📍 OVERVIEW & POPULATION
- Total Localities: ${localities.length}
- Total Bahá'í Population: ${totalBahais}
- New Bahá'í Declarations: ${totalNewDeclarations}

📚 THE FOUR CORE ACTIVITIES
1. Study Circles: ${activeStudyCircles.length} active groups (${totalSCParticipants} participants) [Goal: ${scGoal}]
2. Children's Classes: ${activeChildrenClasses.length} active classes (${totalCCParticipants} children) [Goal: ${ccGoal}]
3. Junior Youth Groups: ${activeJYGroups.length} active groups (${totalJYParticipants} members) [Goal: ${jyGoal}]
4. Devotional Meetings: ${totalDevotionals} recorded meetings [Goal: ${devGoal}]

🏠 PASTORAL CARE & TEACHING
- Home Visits Conducted: ${totalHomeVisits}
- Inter-community Visits: ${serviceVisits.length}
- Total Recorded Activities: ${activities.length}

📊 LOCALITY BREAKDOWN:
${localities.map(l => `- ${l.name}: ${l.bahaiCount} Bahá'ís, ${l.studyCirclesCount} SCs, ${l.childrenClassesCount} CCs, ${l.juniorYouthGroupsCount} JYGs`).join('\n')}

Generated on: ${new Date().toLocaleDateString('en-KE')}
Kimana Cluster Tracker - Kajiado South, Kenya
========================================
    `.trim();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cluster Reports & Analytics</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Statistical summaries and growth reports for Kimana Cluster community development.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-medium transition"
            id="copy-summary-button"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition"
            id="print-report-button"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Cycle Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-900 dark:text-white text-sm">Select Cycle Period for Statistical Summary:</span>
        </div>
        <select
          value={selectedCycleId}
          onChange={(e) => setSelectedCycleId(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          id="report-cycle-select"
        >
          {cycles.length === 0 ? (
            <option value="">No cycle defined</option>
          ) : (
            cycles.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.startDate} to {c.endDate})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Core Activities Progress Cards (Goal vs Actual) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Goal Progress ({activeCycle?.name || 'All Cycles'})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Study Circles</span>
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeStudyCircles.length}</span>
              <span className="text-xs font-medium text-slate-500">Goal: {scGoal}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeStudyCircles.length / Math.max(1, scGoal)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{totalSCParticipants} active participants</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Children's Classes</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeChildrenClasses.length}</span>
              <span className="text-xs font-medium text-slate-500">Goal: {ccGoal}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeChildrenClasses.length / Math.max(1, ccGoal)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{totalCCParticipants} children attending</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Junior Youth Groups</span>
              <GraduationCap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeJYGroups.length}</span>
              <span className="text-xs font-medium text-slate-500">Goal: {jyGoal}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (activeJYGroups.length / Math.max(1, jyGoal)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{totalJYParticipants} JY members</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Devotional Meetings</span>
              <HeartHandshake className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalDevotionals}</span>
              <span className="text-xs font-medium text-slate-500">Goal: {devGoal}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalDevotionals / Math.max(1, devGoal)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Pastoral devotional gatherings</p>
          </div>

        </div>
      </div>

      {/* Locality Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Locality Comparison Breakdown
          </h2>
          <span className="text-xs font-medium text-slate-500">{localities.length} Localities Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Locality Name</th>
                <th className="py-3 px-4">Bahá'í Count</th>
                <th className="py-3 px-4">Households</th>
                <th className="py-3 px-4">Study Circles</th>
                <th className="py-3 px-4">Children's Classes</th>
                <th className="py-3 px-4">Junior Youth</th>
                <th className="py-3 px-4">Devotionals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {localities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No localities recorded yet.
                  </td>
                </tr>
              ) : (
                localities.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {loc.name}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {loc.bahaiCount}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {loc.householdsCount}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {loc.studyCirclesCount}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {loc.childrenClassesCount}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {loc.juniorYouthGroupsCount}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {loc.devotionalMeetingsCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Report Summary Preview Box */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-lg border border-slate-800 font-mono text-xs overflow-x-auto space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 font-sans text-xs">
          <span>Formatted Cluster Text Summary (Ready to Copy/Share)</span>
          <button 
            onClick={handleCopySummary}
            className="text-emerald-400 hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">
          {generateTextSummary()}
        </pre>
      </div>
    </div>
  );
};
