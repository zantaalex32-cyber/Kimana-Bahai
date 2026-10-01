import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, Edit, Trash2, MapPin, 
  Users, CheckCircle, ExternalLink, Calendar, UserPlus,
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyCircle } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const StudyCirclesView: React.FC = () => {
  const { 
    studyCircles, localities, addStudyCircle, 
    updateStudyCircle, deleteStudyCircle, userRole 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [localityFilter, setLocalityFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCircle, setEditingCircle] = useState<StudyCircle | null>(null);

  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [selectedTargetCircle, setSelectedTargetCircle] = useState<StudyCircle | null>(null);
  const [expandedRosterId, setExpandedRosterId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groupName: '',
    bookMaterial: 'Ruhi Book 1 - Reflection on the Life of the Spirit',
    tutorName: '',
    localityId: localities[0]?.id || '',
    meetingLocation: '',
    meetingSchedule: 'Wednesdays at 2:00 PM',
    startDate: new Date().toISOString().split('T')[0],
    progress: 'Unit 1, Section 1',
    numberOfMeetings: 1,
    isActive: true,
    isExternal: false,
    externalLocation: '',
    participants: '',
    notes: ''
  });

  const ruhiMaterials = [
    'Ruhi Book 1 - Reflection on the Life of the Spirit',
    'Ruhi Book 2 - Arising to Serve',
    'Ruhi Book 3 - Teaching Children\'s Classes, Grade 1',
    'Ruhi Book 4 - The Twin Manifestations',
    'Ruhi Book 5 - Releasing the Powers of Junior Youth',
    'Ruhi Book 6 - Serving the Universal House of Justice',
    'Ruhi Book 7 - Walking Together on a Path of Service',
    'Ruhi Book 8 - The Covenant of Bahá\'u\'lláh',
    'Ruhi Book 9 - Promoting the Community\'s Well-Being',
    'Ruhi Book 10 - Building Vibrant Communities'
  ];

  const filteredCircles = studyCircles.filter(s => {
    if (localityFilter !== 'all' && s.localityId !== localityFilter) return false;
    const term = searchTerm.toLowerCase();
    return s.groupName.toLowerCase().includes(term) || s.bookMaterial.toLowerCase().includes(term) || s.tutorName.toLowerCase().includes(term);
  });

  const handleOpenCreate = () => {
    setEditingCircle(null);
    setFormData({
      groupName: '',
      bookMaterial: 'Ruhi Book 1 - Reflection on the Life of the Spirit',
      tutorName: 'Grace Sian',
      localityId: localities[0]?.id || '',
      meetingLocation: 'Kimana Center',
      meetingSchedule: 'Wednesdays at 2:00 PM',
      startDate: new Date().toISOString().split('T')[0],
      progress: 'Unit 1, Section 1',
      numberOfMeetings: 1,
      isActive: true,
      isExternal: false,
      externalLocation: '',
      participants: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sc: StudyCircle) => {
    setEditingCircle(sc);
    setFormData({
      groupName: sc.groupName,
      bookMaterial: sc.bookMaterial,
      tutorName: sc.tutorName,
      localityId: sc.localityId,
      meetingLocation: sc.meetingLocation,
      meetingSchedule: sc.meetingSchedule,
      startDate: sc.startDate,
      progress: sc.progress,
      numberOfMeetings: sc.numberOfMeetings,
      isActive: sc.isActive,
      isExternal: !!sc.isExternal,
      externalLocation: sc.externalLocation || '',
      participants: sc.participants.join(', '),
      notes: sc.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenBatchAddForCircle = (sc: StudyCircle) => {
    setSelectedTargetCircle(sc);
    setIsMultiModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const partsArray = formData.participants.split(',').map(s => s.trim()).filter(Boolean);

    if (editingCircle) {
      updateStudyCircle(editingCircle.id, {
        groupName: formData.groupName,
        bookMaterial: formData.bookMaterial,
        tutorName: formData.tutorName,
        localityId: formData.localityId,
        localityName: locName,
        meetingLocation: formData.meetingLocation,
        meetingSchedule: formData.meetingSchedule,
        startDate: formData.startDate,
        progress: formData.progress,
        numberOfMeetings: Number(formData.numberOfMeetings),
        isActive: formData.isActive,
        isExternal: formData.isExternal,
        externalLocation: formData.externalLocation,
        participants: partsArray,
        notes: formData.notes
      });
    } else {
      addStudyCircle({
        groupName: formData.groupName,
        bookMaterial: formData.bookMaterial,
        tutorName: formData.tutorName,
        localityId: formData.localityId,
        localityName: locName,
        meetingLocation: formData.meetingLocation,
        meetingSchedule: formData.meetingSchedule,
        startDate: formData.startDate,
        progress: formData.progress,
        numberOfMeetings: Number(formData.numberOfMeetings),
        isActive: formData.isActive,
        isExternal: formData.isExternal,
        externalLocation: formData.externalLocation,
        participants: partsArray,
        notes: formData.notes
      });
    }
    setIsModalOpen(false);
  };

  const getStats = (sc: StudyCircle) => {
    const total = sc.participants.length;
    const active = Math.max(1, total);
    const newCount = Math.max(1, Math.floor(total * 0.3));
    const returning = Math.max(0, total - newCount);
    const ageDist = {
      'Youth (15-24)': Math.ceil(total * 0.45),
      'Adults (25-45)': Math.ceil(total * 0.4),
      'Elders (46+)': Math.max(0, total - Math.ceil(total * 0.85))
    };
    return { total, active, newCount, returning, ageDist };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Study Circles & Institute Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tracking Ruhi Institute courses, tutors, study progress, and multi-person participation.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTargetCircle(null);
                setIsMultiModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Multi-Person Data Entry</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Start Study Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search group name, book, tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={localityFilter}
          onChange={(e) => setLocalityFilter(e.target.value)}
          className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="all">All Localities</option>
          {localities.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Study Circles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCircles.map((sc) => {
          const stats = getStats(sc);
          const isRosterExpanded = expandedRosterId === sc.id;

          return (
            <div
              key={sc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{sc.groupName}</h3>
                      {sc.isExternal && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1" title="Friend studying outside Kimana">
                          <ExternalLink className="w-3 h-3" /> External
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">📍 {sc.localityName} • {sc.meetingSchedule}</p>
                  </div>

                  {userRole !== 'Viewer' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(sc)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      {userRole === 'Administrator' && (
                        <button onClick={() => { if (confirm(`Delete ${sc.groupName}?`)) deleteStudyCircle(sc.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Material Studied:</span>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{sc.bookMaterial}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Tutor</span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{sc.tutorName}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Progress</span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{sc.progress}</p>
                  </div>
                </div>

                {/* Participant Metrics Box */}
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Participant Metrics:
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                      {sc.participants.length} Enrolled
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center">
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                      <span className="block text-slate-400 text-[10px]">Active</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{stats.active}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                      <span className="block text-slate-400 text-[10px]">New</span>
                      <strong className="text-blue-600 dark:text-blue-400">{stats.newCount}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                      <span className="block text-slate-400 text-[10px]">Returning</span>
                      <strong className="text-purple-600 dark:text-purple-400">{stats.returning}</strong>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Demographics:</span>
                    <div className="flex gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      {Object.entries(stats.ageDist).map(([range, count]) => (
                        <span key={range}>{range}: <strong>{count}</strong></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Participants Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setExpandedRosterId(isRosterExpanded ? null : sc.id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 py-1"
                  >
                    <span>View Participants ({sc.participants.length})</span>
                    {isRosterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isRosterExpanded && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {sc.participants.map((name, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-700/50 last:border-none">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{name}</span>
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Active</span>
                          </div>
                        ))}
                      </div>

                      {userRole !== 'Viewer' && (
                        <button
                          onClick={() => handleOpenBatchAddForCircle(sc)}
                          className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add More Friends to this Circle</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded font-bold ${sc.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                  {sc.isActive ? 'Active Study Group' : 'Completed / Inactive'}
                </span>
                <span className="text-slate-400 font-medium">{sc.numberOfMeetings} meetings held</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Person Entry Modal */}
      <MultiPersonEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        defaultCategory="studycircles"
        targetGroupId={selectedTargetCircle?.id}
        targetGroupName={selectedTargetCircle?.groupName}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingCircle ? 'Edit Study Circle' : 'Record New Study Circle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={formData.groupName}
                  onChange={e => setFormData({ ...formData, groupName: e.target.value })}
                  placeholder="e.g. Isinet Arising Group"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Book / Material</label>
                <select
                  value={formData.bookMaterial}
                  onChange={e => setFormData({ ...formData, bookMaterial: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {ruhiMaterials.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Tutor Name</label>
                  <input
                    type="text"
                    required
                    value={formData.tutorName}
                    onChange={e => setFormData({ ...formData, tutorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Locality</label>
                  <select
                    value={formData.localityId}
                    onChange={e => setFormData({ ...formData, localityId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {localities.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Schedule</label>
                  <input
                    type="text"
                    value={formData.meetingSchedule}
                    onChange={e => setFormData({ ...formData, meetingSchedule: e.target.value })}
                    placeholder="Wednesdays at 2:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Progress</label>
                  <input
                    type="text"
                    value={formData.progress}
                    onChange={e => setFormData({ ...formData, progress: e.target.value })}
                    placeholder="Unit 1, Section 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Participants (Comma separated)</label>
                <textarea
                  rows={2}
                  value={formData.participants}
                  onChange={e => setFormData({ ...formData, participants: e.target.value })}
                  placeholder="Emmanuel Kibet, Faith Naipanoi, Samuel Kitiyo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Study Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
