import React, { useState } from 'react';
import { 
  HeartHandshake, Plus, Edit, Trash2, MapPin, Users, Calendar, 
  UserPlus, ChevronDown, ChevronUp, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DevotionalMeeting } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const DevotionalsView: React.FC = () => {
  const { devotionals, localities, addDevotional, updateDevotional, deleteDevotional, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<DevotionalMeeting | null>(null);

  // Multi-person batch modal state
  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [selectedTargetDev, setSelectedTargetDev] = useState<DevotionalMeeting | null>(null);

  // Expanded participants card
  const [expandedRosterId, setExpandedRosterId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    localityId: localities[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    themeTopic: 'Unity & Oneness of Humanity',
    participantsCount: 10,
    participantNames: '',
    description: '',
    notes: ''
  });

  const filteredDevotionals = devotionals.filter(d => {
    if (localityFilter !== 'all' && d.localityId !== localityFilter) return false;
    const term = searchTerm.toLowerCase();
    return (
      d.title.toLowerCase().includes(term) ||
      d.hostName.toLowerCase().includes(term) ||
      d.themeTopic.toLowerCase().includes(term) ||
      d.localityName.toLowerCase().includes(term)
    );
  });

  const totalDevotionals = devotionals.length;
  const totalAttendance = devotionals.reduce((sum, d) => sum + (d.participantNames?.length || d.participantsCount || 0), 0);
  const uniqueHosts = new Set(devotionals.map(d => d.hostName)).size;
  const activeLocalities = new Set(devotionals.map(d => d.localityId)).size;

  const handleOpenCreate = () => {
    setEditingDev(null);
    setFormData({
      title: 'Weekly Devotional Meeting',
      hostName: 'Grace Sian',
      localityId: localities[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      themeTopic: 'Unity & Prayer',
      participantsCount: 10,
      participantNames: 'Grace Sian, John Ole, Esther Mutua, Daniel Nkopio',
      description: 'Devotional prayers and spiritual reflections on unity and service.',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: DevotionalMeeting) => {
    setEditingDev(d);
    setFormData({
      title: d.title,
      hostName: d.hostName,
      localityId: d.localityId,
      date: d.date,
      time: d.time || '18:00',
      themeTopic: d.themeTopic,
      participantsCount: d.participantsCount,
      participantNames: d.participantNames ? d.participantNames.join(', ') : '',
      description: d.description || '',
      notes: d.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenBatchAddForDev = (d: DevotionalMeeting) => {
    setSelectedTargetDev(d);
    setIsMultiModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const namesArray = formData.participantNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
    const calculatedCount = Math.max(Number(formData.participantsCount), namesArray.length);

    if (editingDev) {
      updateDevotional(editingDev.id, {
        title: formData.title,
        hostName: formData.hostName,
        localityId: formData.localityId,
        localityName: locName,
        date: formData.date,
        time: formData.time,
        themeTopic: formData.themeTopic,
        participantsCount: calculatedCount,
        participantNames: namesArray,
        description: formData.description,
        notes: formData.notes
      });
    } else {
      addDevotional({
        title: formData.title,
        hostName: formData.hostName,
        localityId: formData.localityId,
        localityName: locName,
        date: formData.date,
        time: formData.time,
        themeTopic: formData.themeTopic,
        participantsCount: calculatedCount,
        participantNames: namesArray,
        description: formData.description,
        notes: formData.notes
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-rose-500" />
            Devotional Meetings & Prayer Gatherings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gatherings for prayer, meditation, and spiritual fellowship held in homes across Kimana cluster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole !== 'Viewer' && (
            <button
              onClick={() => {
                setSelectedTargetDev(null);
                setIsMultiModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              id="multi-person-devotional-btn"
            >
              <Users className="w-4 h-4" />
              <span>Multi-Person Entry</span>
            </button>
          )}

          {userRole !== 'Viewer' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
              id="record-devotional-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Record Devotional</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Devotionals</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalDevotionals}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Participants</p>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{totalAttendance}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active Host Families</p>
          <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{uniqueHosts}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Localities Reached</p>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{activeLocalities}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search devotionals by title, host, theme, or locality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Localities</option>
            {localities.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Devotionals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevotionals.map((dev) => {
          const participantList = dev.participantNames || [];
          const effectiveCount = Math.max(dev.participantsCount, participantList.length);
          const isExpanded = expandedRosterId === dev.id;

          return (
            <div key={dev.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{dev.title}</h3>
                    <p className="text-xs text-slate-500">📍 {dev.localityName} • Host: <strong>{dev.hostName}</strong></p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(dev)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit Devotional">
                        <Edit className="w-4 h-4" />
                      </button>
                      {userRole === 'Administrator' && (
                        <button onClick={() => { if (confirm(`Delete devotional?`)) deleteDevotional(dev.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="my-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                    <span className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold uppercase">Theme / Topic:</span>
                    <p className="font-bold text-rose-900 dark:text-rose-200 mt-0.5">{dev.themeTopic}</p>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pt-1">
                    <span>📅 {dev.date} {dev.time && `• ${dev.time}`}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                      {effectiveCount} participants
                    </span>
                  </div>

                  {dev.description && (
                    <p className="text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">{dev.description}</p>
                  )}

                  {/* Multi-Person Participant Roster Display */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setExpandedRosterId(isExpanded ? null : dev.id)}
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Roster ({participantList.length} recorded)</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {userRole !== 'Viewer' && (
                        <button
                          type="button"
                          onClick={() => handleOpenBatchAddForDev(dev)}
                          className="text-[11px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>+ Add Multiple</span>
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                        {participantList.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {participantList.map((name, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium border border-slate-200 dark:border-slate-600">
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">
                            No individual names recorded yet. Click "+ Add Multiple" to add attendees.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Person Entry Modal */}
      <MultiPersonEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        defaultCategory="devotionals"
        targetGroupId={selectedTargetDev?.id}
        targetGroupName={selectedTargetDev?.title}
      />

      {/* Create / Edit Devotional Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingDev ? 'Edit Devotional Meeting' : 'Record Devotional Meeting'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Rombo Sunday Devotional"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Host Name</label>
                  <input
                    type="text"
                    required
                    value={formData.hostName}
                    onChange={e => setFormData({ ...formData, hostName: e.target.value })}
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Attendance</label>
                  <input
                    type="number"
                    value={formData.participantsCount}
                    onChange={e => setFormData({ ...formData, participantsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Theme / Topic</label>
                <input
                  type="text"
                  value={formData.themeTopic}
                  onChange={e => setFormData({ ...formData, themeTopic: e.target.value })}
                  placeholder="Unity & Oneness"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Multiple Attendees / Participants Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Multiple Attendees / Participants (Enter multiple at once)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedTargetDev(editingDev || null);
                      setIsMultiModalOpen(true);
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Open Multi-Person Form</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.participantNames}
                  onChange={e => {
                    const val = e.target.value;
                    const parsed = val.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({
                      ...prev,
                      participantNames: val,
                      participantsCount: Math.max(prev.participantsCount, parsed.length)
                    }));
                  }}
                  placeholder="Enter or paste multiple attendee names (separated by commas or new lines)&#10;e.g.:&#10;Grace Sian&#10;John Ole&#10;Daniel Nkopio"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs transition leading-relaxed shadow-sm resize-y"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {formData.participantNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length > 0 ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {formData.participantNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length} attendees entered (auto-calculates attendance totals)
                      </span>
                    ) : (
                      'Supports entering multiple attendees at once (comma or line separated)'
                    )}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Multiple entry enabled</span>
                </div>
              </div>

              {/* Devotional Notes & Description */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Description & Spiritual Reflections
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Notes on the gathering, prayers read, spiritual atmosphere, or follow-ups..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs transition leading-relaxed shadow-sm resize-y"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Save Devotional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
