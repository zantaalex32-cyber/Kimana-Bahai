import React, { useState } from 'react';
import { 
  X, Home, HeartHandshake, UserPlus, CalendarCheck, 
  BookOpen, Sparkles, GraduationCap, CheckCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickRecordModal: React.FC<QuickRecordModalProps> = ({ isOpen, onClose }) => {
  const { 
    localities, people, addHomeVisit, addDevotional, 
    addNewBahai, addActivity, addFollowUp 
  } = useApp();

  const [activeType, setActiveType] = useState<
    'homevisit' | 'devotional' | 'declaration' | 'activity'
  >('homevisit');

  const [localityName, setLocalityName] = useState(localities[0]?.name || 'Kimana Town');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [homeVisitData, setHomeVisitData] = useState({
    familyOrPersonVisited: '',
    visitors: '',
    date: new Date().toISOString().split('T')[0],
    purpose: 'Deepening & Pastoral Visit',
    followUpNeeded: false,
    notes: ''
  });

  const [devotionalData, setDevotionalData] = useState({
    title: 'Community Devotional',
    hostName: '',
    date: new Date().toISOString().split('T')[0],
    themeTopic: 'Unity & Prayer',
    participantsCount: 5,
    description: ''
  });

  const [declarationData, setDeclarationData] = useState({
    name: '',
    connectionChannel: 'Home Visit',
    accompanyingFriend: '',
    dateRegistered: new Date().toISOString().split('T')[0],
    followUpStatus: 'Needs Initial Visit' as const
  });

  const [activityData, setActivityData] = useState({
    title: '',
    type: 'Community Meeting' as const,
    date: new Date().toISOString().split('T')[0],
    venue: '',
    personResponsible: '',
    actualAttendance: 10,
    followUpRequired: false
  });

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  const handleHomeVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = localities.find(l => l.name === localityName);
    const visitorArray = homeVisitData.visitors.split(',').map(s => s.trim()).filter(Boolean);

    addHomeVisit({
      familyOrPersonVisited: homeVisitData.familyOrPersonVisited,
      localityId: locObj?.id || 'loc1',
      localityName: localityName,
      visitors: visitorArray.length > 0 ? visitorArray : ['Cluster Friend'],
      date: homeVisitData.date,
      purpose: homeVisitData.purpose,
      followUpNeeded: homeVisitData.followUpNeeded,
      notes: homeVisitData.notes
    });

    if (homeVisitData.followUpNeeded) {
      addFollowUp({
        title: `Follow-up visit for ${homeVisitData.familyOrPersonVisited}`,
        responsiblePerson: visitorArray[0] || 'Local Community Member',
        relatedEntity: `Home Visit: ${homeVisitData.familyOrPersonVisited}`,
        localityName: localityName,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'High',
        status: 'Pending',
        notes: homeVisitData.notes
      });
    }

    showSuccess('Home visit recorded successfully!');
  };

  const handleDevotionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = localities.find(l => l.name === localityName);
    addDevotional({
      title: devotionalData.title,
      hostName: devotionalData.hostName || 'Local Host',
      localityId: locObj?.id || 'loc1',
      localityName: localityName,
      date: devotionalData.date,
      themeTopic: devotionalData.themeTopic,
      participantsCount: Number(devotionalData.participantsCount),
      description: devotionalData.description
    });
    showSuccess('Devotional meeting recorded!');
  };

  const handleDeclarationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = localities.find(l => l.name === localityName);
    addNewBahai({
      name: declarationData.name,
      localityId: locObj?.id || 'loc1',
      localityName: localityName,
      dateRegistered: declarationData.dateRegistered,
      connectionChannel: declarationData.connectionChannel,
      accompanyingFriend: declarationData.accompanyingFriend,
      followUpStatus: declarationData.followUpStatus,
      activitiesParticipating: ['Devotionals']
    });

    addFollowUp({
      title: `Welcome & Initial Visit for New Bahá'í: ${declarationData.name}`,
      responsiblePerson: declarationData.accompanyingFriend || 'Local LSA / Animator',
      relatedEntity: `New Declaration: ${declarationData.name}`,
      localityName: localityName,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'High',
      status: 'Pending'
    });

    showSuccess('New Bahá’í declaration recorded!');
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locObj = localities.find(l => l.name === localityName);
    addActivity({
      title: activityData.title,
      type: activityData.type,
      date: activityData.date,
      localityId: locObj?.id || 'loc1',
      localityName: localityName,
      venue: activityData.venue || localityName,
      personResponsible: activityData.personResponsible || 'Coordinating Team',
      expectedParticipants: Number(activityData.actualAttendance),
      actualAttendance: Number(activityData.actualAttendance),
      followUpRequired: activityData.followUpRequired,
      status: 'Completed'
    });

    showSuccess('Activity log saved!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Field Record</h2>
            <p className="text-xs text-slate-500">Rapid entry for cluster activities, visits & declarations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            id="quick-record-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-lg font-bold text-slate-900 dark:text-white">{successMessage}</p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Record Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveType('homevisit')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  activeType === 'homevisit'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                id="type-homevisit"
              >
                <Home className="w-4 h-4" />
                <span>Home Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType('devotional')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  activeType === 'devotional'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                id="type-devotional"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Devotional</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType('declaration')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  activeType === 'declaration'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                id="type-declaration"
              >
                <UserPlus className="w-4 h-4" />
                <span>Declaration</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType('activity')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  activeType === 'activity'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                id="type-activity"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Activity</span>
              </button>
            </div>

            {/* Locality Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Locality</label>
              <select
                value={localityName}
                onChange={(e) => setLocalityName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {localities.map(l => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Home Visit Form */}
            {activeType === 'homevisit' && (
              <form onSubmit={handleHomeVisitSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Family or Person Visited</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Naserian Family"
                    value={homeVisitData.familyOrPersonVisited}
                    onChange={(e) => setHomeVisitData({ ...homeVisitData, familyOrPersonVisited: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Visitors (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. John, Sarah"
                      value={homeVisitData.visitors}
                      onChange={(e) => setHomeVisitData({ ...homeVisitData, visitors: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Visit Date</label>
                    <input
                      type="date"
                      required
                      value={homeVisitData.date}
                      onChange={(e) => setHomeVisitData({ ...homeVisitData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hv-followup"
                    checked={homeVisitData.followUpNeeded}
                    onChange={(e) => setHomeVisitData({ ...homeVisitData, followUpNeeded: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="hv-followup" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Flag as Action Item / Follow-up Needed
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition"
                >
                  Save Home Visit
                </button>
              </form>
            )}

            {/* Devotional Form */}
            {activeType === 'devotional' && (
              <form onSubmit={handleDevotionalSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Gathering Title / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekly Devotional at Lemparo Home"
                    value={devotionalData.title}
                    onChange={(e) => setDevotionalData({ ...devotionalData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Host Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mary Naserian"
                      value={devotionalData.hostName}
                      onChange={(e) => setDevotionalData({ ...devotionalData, hostName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Attendance Count</label>
                    <input
                      type="number"
                      min={1}
                      value={devotionalData.participantsCount}
                      onChange={(e) => setDevotionalData({ ...devotionalData, participantsCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition"
                >
                  Save Devotional
                </button>
              </form>
            )}

            {/* Declaration Form */}
            {activeType === 'declaration' && (
              <form onSubmit={handleDeclarationSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Full Name of Declarant</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniel Saning'o"
                    value={declarationData.name}
                    onChange={(e) => setDeclarationData({ ...declarationData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Channel / Connection</label>
                    <select
                      value={declarationData.connectionChannel}
                      onChange={(e) => setDeclarationData({ ...declarationData, connectionChannel: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Home Visit">Home Visit</option>
                      <option value="Teaching Campaign">Teaching Campaign</option>
                      <option value="Devotional Meeting">Devotional Meeting</option>
                      <option value="Parent of JY Member">Parent of JY Member</option>
                      <option value="Friend of Friend">Friend of Friend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Accompanying Friend</label>
                    <input
                      type="text"
                      placeholder="e.g. Peter Kiprotich"
                      value={declarationData.accompanyingFriend}
                      onChange={(e) => setDeclarationData({ ...declarationData, accompanyingFriend: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition"
                >
                  Save New Declaration
                </button>
              </form>
            )}

            {/* Activity Form */}
            {activeType === 'activity' && (
              <form onSubmit={handleActivitySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Activity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Reflection Gathering"
                    value={activityData.title}
                    onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Person Responsible</label>
                    <input
                      type="text"
                      placeholder="e.g. Esther Wangari"
                      value={activityData.personResponsible}
                      onChange={(e) => setActivityData({ ...activityData, personResponsible: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Attendance</label>
                    <input
                      type="number"
                      min={1}
                      value={activityData.actualAttendance}
                      onChange={(e) => setActivityData({ ...activityData, actualAttendance: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition"
                >
                  Save Activity Log
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
