import React, { useState } from 'react';
import { 
  GraduationCap, Plus, Edit, Trash2, MapPin, Users, HeartHandshake, 
  UserPlus, ChevronDown, ChevronUp, Shield, Award 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JuniorYouthGroup } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const JuniorYouthView: React.FC = () => {
  const { 
    juniorYouthGroups, localities, addJuniorYouthGroup, 
    updateJuniorYouthGroup, deleteJuniorYouthGroup, userRole 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<JuniorYouthGroup | null>(null);

  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [selectedTargetGroup, setSelectedTargetGroup] = useState<JuniorYouthGroup | null>(null);
  const [expandedRosterId, setExpandedRosterId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groupName: '',
    localityId: localities[0]?.id || '',
    animatorName: '',
    currentMaterial: 'Breezes of Confirmation',
    progress: 'Chapter 1',
    meetingSchedule: 'Thursdays at 4:30 PM',
    numberOfMeetings: 1,
    averageAttendance: 10,
    members: '',
    serviceProjects: '',
    isActive: true,
    notes: ''
  });

  const jyMaterials = [
    'Breezes of Confirmation',
    'Walking the Straight Path',
    'Drawing on the Power of the Word',
    'Spirit of Faith',
    'Glimmerings of Hope',
    'Observation and Insight',
    'Learning About Excellence',
    'Thinking About Numbers'
  ];

  const filteredGroups = juniorYouthGroups.filter(j => 
    j.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.animatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.localityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setFormData({
      groupName: '',
      localityId: localities[0]?.id || '',
      animatorName: 'Emmanuel Kibet',
      currentMaterial: 'Breezes of Confirmation',
      progress: 'Chapter 1',
      meetingSchedule: 'Thursdays at 4:30 PM',
      numberOfMeetings: 8,
      averageAttendance: 12,
      members: '',
      serviceProjects: 'Tree planting at primary school',
      isActive: true,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (j: JuniorYouthGroup) => {
    setEditingGroup(j);
    setFormData({
      groupName: j.groupName,
      localityId: j.localityId,
      animatorName: j.animatorName,
      currentMaterial: j.currentMaterial,
      progress: j.progress,
      meetingSchedule: j.meetingSchedule,
      numberOfMeetings: j.numberOfMeetings,
      averageAttendance: j.averageAttendance,
      members: j.members.join(', '),
      serviceProjects: j.serviceProjects.join(', '),
      isActive: j.isActive,
      notes: j.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenBatchAddForGroup = (grp: JuniorYouthGroup) => {
    setSelectedTargetGroup(grp);
    setIsMultiModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const membersArray = formData.members.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
    const projectsArray = formData.serviceProjects.split(',').map(s => s.trim()).filter(Boolean);

    if (editingGroup) {
      updateJuniorYouthGroup(editingGroup.id, {
        groupName: formData.groupName,
        localityId: formData.localityId,
        localityName: locName,
        animatorName: formData.animatorName,
        currentMaterial: formData.currentMaterial,
        progress: formData.progress,
        meetingSchedule: formData.meetingSchedule,
        numberOfMeetings: Number(formData.numberOfMeetings),
        averageAttendance: Number(formData.averageAttendance),
        members: membersArray,
        serviceProjects: projectsArray,
        isActive: formData.isActive,
        notes: formData.notes
      });
    } else {
      addJuniorYouthGroup({
        groupName: formData.groupName,
        localityId: formData.localityId,
        localityName: locName,
        animatorName: formData.animatorName,
        currentMaterial: formData.currentMaterial,
        progress: formData.progress,
        meetingSchedule: formData.meetingSchedule,
        numberOfMeetings: Number(formData.numberOfMeetings),
        averageAttendance: Number(formData.averageAttendance),
        members: membersArray,
        serviceProjects: projectsArray,
        isActive: formData.isActive,
        notes: formData.notes
      });
    }
    setIsModalOpen(false);
  };

  const getStats = (grp: JuniorYouthGroup) => {
    const total = grp.members.length;
    const active = Math.min(total, grp.averageAttendance);
    const newCount = Math.max(1, Math.floor(total * 0.2));
    const returning = Math.max(0, total - newCount);
    const ageDist = {
      'Age 11-12': Math.ceil(total * 0.35),
      'Age 13-14': Math.ceil(total * 0.45),
      'Age 15': Math.max(0, total - Math.ceil(total * 0.8))
    };
    return { total, active, newCount, returning, ageDist };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Junior Youth Spiritual Empowerment Program
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Empowering junior youth (ages 12-15) through study, discourse, and community service projects.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTargetGroup(null);
                setIsMultiModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Multi-Person Data Entry</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add JY Group</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          placeholder="Search junior youth groups by name, animator, or locality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((grp) => {
          const stats = getStats(grp);
          const isRosterExpanded = expandedRosterId === grp.id;

          return (
            <div 
              key={grp.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{grp.groupName}</h3>
                    <p className="text-xs text-slate-500">📍 {grp.localityName} • {grp.meetingSchedule}</p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(grp)} className="p-1 rounded text-slate-400 hover:text-purple-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      {userRole === 'Administrator' && (
                        <button onClick={() => { if (confirm(`Delete ${grp.groupName}?`)) deleteJuniorYouthGroup(grp.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Animator</span>
                    <p className="font-bold text-slate-900 dark:text-white">{grp.animatorName}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Current Book</span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{grp.currentMaterial}</p>
                  </div>
                </div>

                {/* Automatic Calculations / Analytics Badge */}
                <div className="p-3 bg-purple-50/70 dark:bg-purple-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      Group Participant Metrics:
                    </span>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      {grp.members.length} Members
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center">
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <span className="block text-slate-400 text-[10px]">Active</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{stats.active}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <span className="block text-slate-400 text-[10px]">New</span>
                      <strong className="text-blue-600 dark:text-blue-400">{stats.newCount}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <span className="block text-slate-400 text-[10px]">Returning</span>
                      <strong className="text-purple-600 dark:text-purple-400">{stats.returning}</strong>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Age Distribution:</span>
                    <div className="flex gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      {Object.entries(stats.ageDist).map(([range, count]) => (
                        <span key={range}>{range}: <strong>{count}</strong></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service Projects */}
                {grp.serviceProjects.length > 0 && (
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                      Service Projects:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {grp.serviceProjects.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px]">
                          🌱 {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Members Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setExpandedRosterId(isRosterExpanded ? null : grp.id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 py-1"
                  >
                    <span>View Members Roster ({grp.members.length})</span>
                    {isRosterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isRosterExpanded && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {grp.members.map((name, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-700/50 last:border-none">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{name}</span>
                            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Active</span>
                          </div>
                        ))}
                      </div>

                      {userRole !== 'Viewer' && (
                        <button
                          onClick={() => handleOpenBatchAddForGroup(grp)}
                          className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add More Junior Youth to this Group</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-600 dark:text-purple-400">Avg Attendance: {grp.averageAttendance}</span>
                <span className="text-slate-400">{grp.numberOfMeetings} meetings held</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Person Entry Modal */}
      <MultiPersonEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        defaultCategory="junioryouth"
        targetGroupId={selectedTargetGroup?.id}
        targetGroupName={selectedTargetGroup?.groupName}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingGroup ? 'Edit Junior Youth Group' : 'New Junior Youth Group'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={formData.groupName}
                  onChange={e => setFormData({ ...formData, groupName: e.target.value })}
                  placeholder="e.g. Isinet Champions JY Group"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Animator</label>
                  <input
                    type="text"
                    required
                    value={formData.animatorName}
                    onChange={e => setFormData({ ...formData, animatorName: e.target.value })}
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Current Material</label>
                  <select
                    value={formData.currentMaterial}
                    onChange={e => setFormData({ ...formData, currentMaterial: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {jyMaterials.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Progress</label>
                  <input
                    type="text"
                    value={formData.progress}
                    onChange={e => setFormData({ ...formData, progress: e.target.value })}
                    placeholder="Chapter 4"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Schedule</label>
                  <input
                    type="text"
                    value={formData.meetingSchedule}
                    onChange={e => setFormData({ ...formData, meetingSchedule: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Meetings Held</label>
                  <input
                    type="number"
                    value={formData.numberOfMeetings}
                    onChange={e => setFormData({ ...formData, numberOfMeetings: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Multiple Members (Enter multiple at once)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedTargetGroup(editingGroup || null);
                      setIsMultiModalOpen(true);
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Open Multi-Person Form (with parents & ages)</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.members}
                  onChange={e => {
                    const val = e.target.value;
                    const parsed = val.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ 
                      ...prev, 
                      members: val,
                      averageAttendance: Math.max(prev.averageAttendance, parsed.length)
                    }));
                  }}
                  placeholder="Enter or paste multiple member names (separated by commas or new lines)&#10;e.g.:&#10;Moses Metian&#10;Ruth Naipanoi&#10;Timothy Keti"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs transition leading-relaxed shadow-sm resize-y"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {formData.members.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length > 0 ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {formData.members.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length} members entered (auto-calculates group stats)
                      </span>
                    ) : (
                      'Supports entering multiple people at once (comma or line separated)'
                    )}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Multiple entry enabled</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Service Projects (Comma separated)</label>
                <input
                  type="text"
                  value={formData.serviceProjects}
                  onChange={e => setFormData({ ...formData, serviceProjects: e.target.value })}
                  placeholder="Tree planting, Visiting elderly"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save JY Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
