import React, { useState } from 'react';
import { 
  BarChart3, FileText, Download, Copy, Check, Printer, 
  MapPin, Users, BookOpen, Sparkles, GraduationCap, HeartHandshake, 
  RotateCw, Calendar, TrendingUp, Filter, ArrowDownRight, ArrowUpRight,
  Compass, AlertTriangle, Target, Plus, Trash2, Edit2, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportPlan, ReportChallenge, ReportPioneer } from '../../types';

export const ReportsView: React.FC = () => {
  const { 
    localities, people, activities, studyCircles, 
    childrenClasses, juniorYouthGroups, devotionals, 
    homeVisits, serviceVisits, newBahais,
    friendsComingIn, friendsGoingOut,
    reportPlans, reportChallenges, reportPioneers,
    addReportPlan, updateReportPlan, deleteReportPlan,
    addReportChallenge, updateReportChallenge, deleteReportChallenge,
    addReportPioneer, updateReportPioneer, deleteReportPioneer,
    cycles, currentCycleId, userRole, formatContact
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<string>(currentCycleId || cycles[0]?.id || 'cycle-14');
  const [activeReportSection, setActiveReportSection] = useState<string>('all'); // 'all' or section index 1..10

  // State for adding plan / challenge / pioneer in reports view
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isPioneerModalOpen, setIsPioneerModalOpen] = useState(false);

  const [newPlan, setNewPlan] = useState<Omit<ReportPlan, 'id'>>({
    cycleId: selectedCycleId,
    category: 'Teaching & Expansion',
    goalDescription: '',
    targetDate: new Date().toISOString().split('T')[0],
    responsiblePerson: 'Daniel Nkopio',
    status: 'In Action'
  });

  const [newChallenge, setNewChallenge] = useState<Omit<ReportChallenge, 'id'>>({
    cycleId: selectedCycleId,
    area: 'Institute Materials',
    description: '',
    severity: 'High',
    proposedAction: ''
  });

  const [newPioneer, setNewPioneer] = useState<Omit<ReportPioneer, 'id'>>({
    name: '',
    type: 'Inbound Pioneer',
    origin: '',
    destination: 'Kimana Cluster',
    period: 'Current Cycle',
    focusArea: 'Institute & Children Classes',
    contact: '',
    status: 'Active'
  });

  const activeCycle = cycles.find(c => c.id === selectedCycleId) || cycles[0];

  // Core Statistics
  const totalBahais = localities.reduce((sum, l) => sum + l.bahaiCount, 0);
  const activeStudyCircles = studyCircles.filter(s => s.isActive);
  const activeChildrenClasses = childrenClasses.filter(c => c.isActive);
  const activeJYGroups = juniorYouthGroups.filter(j => j.isActive);
  const totalDevotionals = devotionals.length;

  const totalSCParticipants = activeStudyCircles.reduce((sum, s) => sum + s.participants.length, 0);
  const totalCCParticipants = activeChildrenClasses.reduce((sum, c) => sum + c.childrenNames.length, 0);
  const totalJYParticipants = activeJYGroups.reduce((sum, j) => sum + j.members.length, 0);
  const totalDevAttendance = devotionals.reduce((sum, d) => sum + d.participantsCount, 0);

  // Goal Progress
  const scGoal = activeCycle?.goals.studyCirclesGoal || 6;
  const ccGoal = activeCycle?.goals.childrenClassesGoal || 8;
  const jyGoal = activeCycle?.goals.juniorYouthGroupsGoal || 5;
  const devGoal = activeCycle?.goals.devotionalsGoal || 12;

  // Filter plans and challenges for active cycle
  const currentPlans = reportPlans.filter(p => p.cycleId === selectedCycleId);
  const currentChallenges = reportChallenges.filter(c => c.cycleId === selectedCycleId);

  // Standardized Formal 10-Section Text Generator (Formatted for WhatsApp / Telegram / Print)
  const generateFullStandardReport = () => {
    return `
======================================================
KIMANA CLUSTER COMMUNITY REPORT
Standard 10-Section Formal Report
Reporting Period: ${activeCycle?.name || 'Cycle 14'}
Date: ${new Date().toLocaleDateString('en-KE')}
======================================================

SECTION 1: CHILDREN'S CLASSES
- Total Active Classes: ${activeChildrenClasses.length}
- Total Children Enrolled: ${totalCCParticipants}
- Total Sessions Held: ${activeChildrenClasses.reduce((sum, c) => sum + c.numberOfSessions, 0)}
- Classes Breakdown:
${activeChildrenClasses.map(c => `  * ${c.className} (${c.localityName}) - Teacher: ${c.teacherName} | Level: ${c.ageGroupLevel} | Enrolled: ${c.childrenNames.length} children`).join('\n')}

SECTION 2: JUNIOR YOUTH GROUPS
- Total Active Groups: ${activeJYGroups.length}
- Total Junior Youth Members: ${totalJYParticipants}
- Groups Breakdown:
${activeJYGroups.map(j => `  * ${j.groupName} (${j.localityName}) - Animator: ${j.animatorName} | Material: ${j.currentMaterial} | Members: ${j.members.length} | Service Projects: ${j.serviceProjects.join(', ') || 'None'}`).join('\n')}

SECTION 3: STUDY CIRCLES
- Total Active Circles: ${activeStudyCircles.length}
- Total Enrolled Friends: ${totalSCParticipants}
- Groups Breakdown:
${activeStudyCircles.map(s => `  * ${s.groupName} (${s.localityName}) - Tutor: ${s.tutorName} | Book: ${s.bookMaterial} | Progress: ${s.progress} | Participants: ${s.participants.length}`).join('\n')}

SECTION 4: DEVOTIONAL GATHERINGS
- Total Gatherings Recorded: ${totalDevotionals}
- Total Cumulative Attendance: ${totalDevAttendance}
- Highlights:
${devotionals.map(d => `  * ${d.title} (${d.localityName}) - Host: ${d.hostName} | Topic: ${d.themeTopic} | Attendance: ${d.participantsCount}`).join('\n')}

SECTION 5: FRIENDS COMING IN
- Total Recorded Arrivals: ${friendsComingIn.length}
- Breakdown:
${friendsComingIn.map(f => `  * ${f.fullName} (${f.localityName}) - Reached via: ${f.howReached} | Introduced By: ${f.introducedBy} | Status: ${f.currentStatus}`).join('\n')}

SECTION 6: FRIENDS GOING OUT
- Total Recorded Outbound Friends: ${friendsGoingOut.length}
- Breakdown:
${friendsGoingOut.map(f => `  * ${f.fullName} (From: ${f.previousLocalityName}) -> Destination: ${f.newLocation} | Reason: ${f.reason} | Past Service: ${f.activitiesPreviouslyInvolved.join(', ')}`).join('\n')}

SECTION 7: PLANS FOR THE CYCLE
${currentPlans.length > 0 ? currentPlans.map(p => `  * [${p.category}] ${p.goalDescription} (Target: ${p.targetDate}, Responsible: ${p.responsiblePerson}, Status: ${p.status})`).join('\n') : '  * Continuing regular expansion goals and consolidation visits.'}

SECTION 8: CHALLENGES AND NEEDS
${currentChallenges.length > 0 ? currentChallenges.map(c => `  * [${c.severity} Priority - ${c.area}] ${c.description} -> Action: ${c.proposedAction}`).join('\n') : '  * Needs ongoing monitoring.'}

SECTION 9: PIONEERS & TRAVEL TEACHERS
${reportPioneers.map(p => `  * ${p.name} (${p.type}): From ${p.origin} to ${p.destination} | Focus: ${p.focusArea} | Period: ${p.period}`).join('\n')}

SECTION 10: SUMMARY & LOCALITY OVERVIEW
- Total Localities: ${localities.length}
- Total Bahá'í Population: ${totalBahais}
- Core Activities Total: ${activeStudyCircles.length + activeChildrenClasses.length + activeJYGroups.length + totalDevotionals}
- Locality Summary:
${localities.map(l => `  * ${l.name}: ${l.bahaiCount} Bahá'ís, ${l.studyCirclesCount} SCs, ${l.childrenClassesCount} CCs, ${l.juniorYouthGroupsCount} JYGs, ${l.devotionalMeetingsCount} Devotionals`).join('\n')}

======================================================
Generated via Kimana Cluster Tracker
Kajiado South, Kenya
======================================================
    `.trim();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateFullStandardReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ['Section', 'Category', 'Entity Name', 'Locality', 'Responsible Person / Host / Teacher', 'Details / Participants', 'Status / Metric'],
      ...activeChildrenClasses.map(c => ['1. Children Classes', c.ageGroupLevel, c.className, c.localityName, c.teacherName, `${c.childrenNames.length} children`, `${c.numberOfSessions} sessions`]),
      ...activeJYGroups.map(j => ['2. Junior Youth', j.currentMaterial, j.groupName, j.localityName, j.animatorName, `${j.members.length} members`, `${j.numberOfMeetings} meetings`]),
      ...activeStudyCircles.map(s => ['3. Study Circles', s.bookMaterial, s.groupName, s.localityName, s.tutorName, `${s.participants.length} friends`, s.progress]),
      ...devotionals.map(d => ['4. Devotionals', d.themeTopic, d.title, d.localityName, d.hostName, `${d.participantsCount} attendees`, d.date]),
      ...friendsComingIn.map(f => ['5. Friends Coming In', f.howReached, f.fullName, f.localityName, f.introducedBy, f.contact, f.currentStatus]),
      ...friendsGoingOut.map(f => ['6. Friends Going Out', f.reason, f.fullName, f.previousLocalityName, f.newLocation, f.contact, f.date]),
      ...currentPlans.map(p => ['7. Plans', p.category, p.goalDescription, 'Cluster-wide', p.responsiblePerson, p.targetDate, p.status]),
      ...currentChallenges.map(c => ['8. Challenges & Needs', c.area, c.description, 'Kimana Cluster', c.severity, c.proposedAction, 'Needs Action']),
      ...reportPioneers.map(p => ['9. Pioneers', p.type, p.name, p.destination, p.origin, p.focusArea, p.period]),
      ...localities.map(l => ['10. Summary Locality', 'Locality Stats', l.name, l.name, `${l.bahaiCount} Bahá’ís`, `${l.householdsCount} households`, `SCs: ${l.studyCirclesCount}, CCs: ${l.childrenClassesCount}, JY: ${l.juniorYouthGroupsCount}`])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kimana_Cluster_Formal_Report_${activeCycle?.name || 'Cycle'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sectionsList = [
    { id: 'all', title: 'Full 10-Section Report', icon: FileText },
    { id: 's1', title: "1. Children's Classes", icon: Sparkles },
    { id: 's2', title: '2. Junior Youth Groups', icon: GraduationCap },
    { id: 's3', title: '3. Study Circles', icon: BookOpen },
    { id: 's4', title: '4. Devotional Gatherings', icon: HeartHandshake },
    { id: 's5', title: '5. Friends Coming In', icon: ArrowDownRight },
    { id: 's6', title: '6. Friends Going Out', icon: ArrowUpRight },
    { id: 's7', title: '7. Plans', icon: Target },
    { id: 's8', title: '8. Challenges and Needs', icon: AlertTriangle },
    { id: 's9', title: '9. Pioneers', icon: Compass },
    { id: 's10', title: '10. Summary', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Formalized Cluster Report</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Standardized 10-section formal reporting structure for Kimana Cluster community development.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-medium transition"
            id="copy-formal-report-btn"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Report!' : 'Copy Formatted Text'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-medium transition"
            id="download-csv-report-btn"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition"
            id="print-formal-report-btn"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Cycle Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            Reporting Period / Cycle:
          </span>
        </div>
        <select
          value={selectedCycleId}
          onChange={(e) => setSelectedCycleId(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {cycles.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.startDate} to {c.endDate})
            </option>
          ))}
        </select>
      </div>

      {/* Section Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 print:hidden scrollbar-none">
        {sectionsList.map((sec) => {
          const isSelected = activeReportSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveReportSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {sec.title}
            </button>
          );
        })}
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-slate-900">KIMANA CLUSTER COMMUNITY DEVELOPMENT REPORT</h1>
        <p className="text-sm text-slate-600">Period: {activeCycle?.name} | Date: {new Date().toLocaleDateString('en-KE')}</p>
        <p className="text-xs text-slate-500">Kajiado South, Kenya</p>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHILDREN'S CLASSES */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's1') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              1. Children’s Classes
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              {activeChildrenClasses.length} Classes • {totalCCParticipants} Children
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Class Name</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3">Age Level</th>
                  <th className="py-2.5 px-3">Enrolled</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeChildrenClasses.map(c => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{c.className}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.localityName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{c.teacherName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.ageGroupLevel}</td>
                    <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">{c.childrenNames.length} children</td>
                    <td className="py-2.5 px-3">{c.averageAttendance} avg</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.numberOfSessions} held</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. JUNIOR YOUTH GROUPS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's2') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              2. Junior Youth Groups
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
              {activeJYGroups.length} Groups • {totalJYParticipants} Junior Youth
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Group Name</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">Animator</th>
                  <th className="py-2.5 px-3">Material & Progress</th>
                  <th className="py-2.5 px-3">Members</th>
                  <th className="py-2.5 px-3">Service Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeJYGroups.map(j => (
                  <tr key={j.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{j.groupName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{j.localityName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{j.animatorName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{j.currentMaterial} ({j.progress})</td>
                    <td className="py-2.5 px-3 font-semibold text-purple-600 dark:text-purple-400">{j.members.length} members</td>
                    <td className="py-2.5 px-3 text-slate-500">{j.serviceProjects.join(', ') || 'Planning'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STUDY CIRCLES */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's3') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              3. Study Circles
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              {activeStudyCircles.length} Circles • {totalSCParticipants} Friends
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Circle Name</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">Tutor</th>
                  <th className="py-2.5 px-3">Book Studied</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Participants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeStudyCircles.map(s => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{s.groupName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{s.localityName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{s.tutorName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium">{s.bookMaterial}</td>
                    <td className="py-2.5 px-3 text-slate-500">{s.progress}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-600 dark:text-blue-400">{s.participants.length} friends</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DEVOTIONAL GATHERINGS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's4') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-500" />
              4. Devotional Gatherings
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {totalDevotionals} Recorded • {totalDevAttendance} Total Attendance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Title / Meeting</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">Host Name</th>
                  <th className="py-2.5 px-3">Theme / Focus</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {devotionals.map(d => (
                  <tr key={d.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{d.title}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{d.localityName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{d.hostName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{d.themeTopic}</td>
                    <td className="py-2.5 px-3 text-slate-500">{d.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">{d.participantsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FRIENDS COMING IN */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's5') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
              5. Friends Coming In
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              {friendsComingIn.length} Recorded Arrivals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">How Reached</th>
                  <th className="py-2.5 px-3">Introduced By</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {friendsComingIn.map(f => (
                  <tr key={f.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{f.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{f.localityName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium">{f.howReached}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{f.introducedBy}</td>
                    <td className="py-2.5 px-3 text-slate-500">{f.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">{f.currentStatus}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{formatContact(f.contact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FRIENDS GOING OUT */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's6') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-amber-600" />
              6. Friends Going Out (Historical Record)
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              {friendsGoingOut.length} Recorded Movements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">From Locality</th>
                  <th className="py-2.5 px-3">New Location</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Historical Kimana Service</th>
                  <th className="py-2.5 px-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {friendsGoingOut.map(f => (
                  <tr key={f.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{f.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{f.previousLocalityName}</td>
                    <td className="py-2.5 px-3 font-medium text-amber-700 dark:text-amber-300">{f.newLocation}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{f.reason}</td>
                    <td className="py-2.5 px-3 text-slate-500">{f.date}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{f.activitiesPreviouslyInvolved.join(', ')}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{formatContact(f.contact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PLANS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's7') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              7. Plans for Current Cycle
            </h2>
            {userRole !== 'Viewer' && (
              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 print:hidden"
              >
                <Plus className="w-3.5 h-3.5" /> Add Goal / Plan
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPlans.map(plan => (
              <div key={plan.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {plan.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">{plan.status}</span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {plan.goalDescription}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Target Date: <strong>{plan.targetDate}</strong></span>
                  <span>Responsible: <strong>{plan.responsiblePerson}</strong></span>
                  {userRole !== 'Viewer' && (
                    <button onClick={() => deleteReportPlan(plan.id)} className="text-rose-500 hover:underline print:hidden">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CHALLENGES AND NEEDS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's8') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              8. Challenges and Needs
            </h2>
            {userRole !== 'Viewer' && (
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 print:hidden"
              >
                <Plus className="w-3.5 h-3.5" /> Log Challenge / Need
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentChallenges.map(c => (
              <div key={c.id} className="p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                    {c.area}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.severity === 'High' ? 'bg-rose-200 text-rose-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.severity} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {c.description}
                </p>
                <div className="pt-2 border-t border-rose-100 dark:border-rose-900/30 text-xs">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                    Proposed Action:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {c.proposedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. PIONEERS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's9') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              9. Pioneers & Travel Teachers
            </h2>
            {userRole !== 'Viewer' && (
              <button
                onClick={() => setIsPioneerModalOpen(true)}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 print:hidden"
              >
                <Plus className="w-3.5 h-3.5" /> Record Pioneer
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Friend Name</th>
                  <th className="py-2.5 px-3">Service Role / Type</th>
                  <th className="py-2.5 px-3">Origin Location</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Focus Area</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reportPioneers.map(p => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="py-2.5 px-3 font-medium text-teal-700 dark:text-teal-300">{p.type}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{p.origin}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{p.destination}</td>
                    <td className="py-2.5 px-3 text-slate-500">{p.period}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200">{p.focusArea}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. SUMMARY */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 's10') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              10. Summary & Locality Matrix
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {totalBahais} Total Bahá’ís in Kimana Cluster
            </span>
          </div>

          {/* Goal Completion Rates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Study Circles</span>
              <span className="text-lg font-bold text-blue-600">{activeStudyCircles.length} / {scGoal}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round((activeStudyCircles.length / scGoal) * 100)}% of goal</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Children Classes</span>
              <span className="text-lg font-bold text-amber-600">{activeChildrenClasses.length} / {ccGoal}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round((activeChildrenClasses.length / ccGoal) * 100)}% of goal</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Junior Youth</span>
              <span className="text-lg font-bold text-purple-600">{activeJYGroups.length} / {jyGoal}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round((activeJYGroups.length / jyGoal) * 100)}% of goal</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Devotionals</span>
              <span className="text-lg font-bold text-emerald-600">{totalDevotionals} / {devGoal}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round((totalDevotionals / devGoal) * 100)}% of goal</span>
            </div>
          </div>

          {/* Locality Comparison Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Locality Name</th>
                  <th className="py-2.5 px-3">Bahá'í Count</th>
                  <th className="py-2.5 px-3">Households</th>
                  <th className="py-2.5 px-3">Study Circles</th>
                  <th className="py-2.5 px-3">Children Classes</th>
                  <th className="py-2.5 px-3">Junior Youth</th>
                  <th className="py-2.5 px-3">Devotionals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {localities.map(l => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{l.name}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{l.bahaiCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{l.householdsCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{l.studyCirclesCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{l.childrenClassesCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{l.juniorYouthGroupsCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{l.devotionalMeetingsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plans Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Add Cycle Action Plan Goal</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold">Category</label>
                <select
                  value={newPlan.category}
                  onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value as any })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value="Teaching & Expansion">Teaching & Expansion</option>
                  <option value="Institute & Study Circles">Institute & Study Circles</option>
                  <option value="Children & Junior Youth">Children & Junior Youth</option>
                  <option value="Devotional & Feasts">Devotional & Feasts</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={newPlan.goalDescription}
                  onChange={(e) => setNewPlan({ ...newPlan, goalDescription: e.target.value })}
                  placeholder="e.g. Conduct tutor accompaniment for Book 1..."
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Target Date</label>
                  <input
                    type="date"
                    value={newPlan.targetDate}
                    onChange={(e) => setNewPlan({ ...newPlan, targetDate: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Responsible</label>
                  <input
                    type="text"
                    value={newPlan.responsiblePerson}
                    onChange={(e) => setNewPlan({ ...newPlan, responsiblePerson: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsPlanModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
              <button
                onClick={() => {
                  if (!newPlan.goalDescription) return;
                  addReportPlan(newPlan);
                  setIsPlanModalOpen(false);
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Log Community Challenge / Need</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold">Area / Need</label>
                <input
                  type="text"
                  value={newChallenge.area}
                  onChange={(e) => setNewChallenge({ ...newChallenge, area: e.target.value })}
                  placeholder="e.g. Institute Materials, Transport"
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Describe the challenge..."
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Proposed Action</label>
                <input
                  type="text"
                  value={newChallenge.proposedAction}
                  onChange={(e) => setNewChallenge({ ...newChallenge, proposedAction: e.target.value })}
                  placeholder="Proposed solution..."
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsChallengeModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
              <button
                onClick={() => {
                  if (!newChallenge.description) return;
                  addReportChallenge(newChallenge);
                  setIsChallengeModalOpen(false);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Save Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pioneer Modal */}
      {isPioneerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Record Pioneer / Travel Teacher</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  value={newPioneer.name}
                  onChange={(e) => setNewPioneer({ ...newPioneer, name: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Type</label>
                  <select
                    value={newPioneer.type}
                    onChange={(e) => setNewPioneer({ ...newPioneer, type: e.target.value as any })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="Inbound Pioneer">Inbound Pioneer</option>
                    <option value="Outbound Pioneer">Outbound Pioneer</option>
                    <option value="Short-Term Travel Teacher">Travel Teacher</option>
                    <option value="Long-Term Pioneer">Long-Term Pioneer</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Period</label>
                  <input
                    type="text"
                    value={newPioneer.period}
                    onChange={(e) => setNewPioneer({ ...newPioneer, period: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Origin</label>
                  <input
                    type="text"
                    value={newPioneer.origin}
                    onChange={(e) => setNewPioneer({ ...newPioneer, origin: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Destination</label>
                  <input
                    type="text"
                    value={newPioneer.destination}
                    onChange={(e) => setNewPioneer({ ...newPioneer, destination: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Focus Area</label>
                <input
                  type="text"
                  value={newPioneer.focusArea}
                  onChange={(e) => setNewPioneer({ ...newPioneer, focusArea: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsPioneerModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
              <button
                onClick={() => {
                  if (!newPioneer.name) return;
                  addReportPioneer(newPioneer);
                  setIsPioneerModalOpen(false);
                }}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold"
              >
                Save Pioneer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
