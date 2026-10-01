import React, { useState } from 'react';
import { 
  Sparkles, Plus, Edit, Trash2, MapPin, Users, UserPlus, 
  ChevronDown, ChevronUp, Shield, Calendar, Award, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChildrenClass } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const ChildrensClassesView: React.FC = () => {
  const { 
    childrenClasses, localities, addChildrenClass, updateChildrenClass, 
    deleteChildrenClass, userRole, formatContact, isSecurityUnlocked 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ChildrenClass | null>(null);
  
  // Multi-person entry modal state
  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [selectedTargetClass, setSelectedTargetClass] = useState<ChildrenClass | null>(null);

  // Expanded roster accordion per class ID
  const [expandedRosterId, setExpandedRosterId] = useState<string | null>(null);

  // Multi-person inline entry state for class form
  const [useMultiPersonList, setUseMultiPersonList] = useState(true);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildParent, setNewChildParent] = useState('');

  const [formData, setFormData] = useState({
    className: '',
    localityId: localities[0]?.id || '',
    teacherName: '',
    ageGroupLevel: 'Grade 1 (Ages 5-7)',
    meetingSchedule: 'Sundays at 10:00 AM',
    numberOfSessions: 1,
    averageAttendance: 10,
    childrenNames: '',
    isActive: true,
    notes: ''
  });

  const filteredClasses = childrenClasses.filter(c => 
    c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.localityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      className: '',
      localityId: localities[0]?.id || '',
      teacherName: 'Faith Naipanoi',
      ageGroupLevel: 'Grade 1 (Ages 5-7)',
      meetingSchedule: 'Sundays at 10:00 AM',
      numberOfSessions: 10,
      averageAttendance: 12,
      childrenNames: '',
      isActive: true,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cc: ChildrenClass) => {
    setEditingClass(cc);
    setFormData({
      className: cc.className,
      localityId: cc.localityId,
      teacherName: cc.teacherName,
      ageGroupLevel: cc.ageGroupLevel,
      meetingSchedule: cc.meetingSchedule,
      numberOfSessions: cc.numberOfSessions,
      averageAttendance: cc.averageAttendance,
      childrenNames: cc.childrenNames.join(', '),
      isActive: cc.isActive,
      notes: cc.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenBatchAddForClass = (cc: ChildrenClass) => {
    setSelectedTargetClass(cc);
    setIsMultiModalOpen(true);
  };

  const currentChildrenList = formData.childrenNames
    ? formData.childrenNames.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleAddChildToForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newChildName.trim()) return;
    
    const formatted = newChildAge.trim() 
      ? `${newChildName.trim()} (Age ${newChildAge.trim()}${newChildParent.trim() ? `, Parent: ${newChildParent.trim()}` : ''})`
      : newChildParent.trim()
      ? `${newChildName.trim()} (Parent: ${newChildParent.trim()})`
      : newChildName.trim();

    const updated = [...currentChildrenList, formatted];
    setFormData(prev => ({
      ...prev,
      childrenNames: updated.join(', '),
      averageAttendance: Math.max(prev.averageAttendance, updated.length)
    }));
    setNewChildName('');
    setNewChildAge('');
    setNewChildParent('');
  };

  const handleRemoveChildFromForm = (indexToRemove: number) => {
    const updated = currentChildrenList.filter((_, i) => i !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      childrenNames: updated.join(', ')
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const namesArray = formData.childrenNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);

    if (editingClass) {
      updateChildrenClass(editingClass.id, {
        className: formData.className,
        localityId: formData.localityId,
        localityName: locName,
        teacherName: formData.teacherName,
        ageGroupLevel: formData.ageGroupLevel,
        meetingSchedule: formData.meetingSchedule,
        numberOfSessions: Number(formData.numberOfSessions),
        averageAttendance: Number(formData.averageAttendance),
        childrenNames: namesArray,
        isActive: formData.isActive,
        notes: formData.notes
      });
    } else {
      addChildrenClass({
        className: formData.className,
        localityId: formData.localityId,
        localityName: locName,
        teacherName: formData.teacherName,
        ageGroupLevel: formData.ageGroupLevel,
        meetingSchedule: formData.meetingSchedule,
        numberOfSessions: Number(formData.numberOfSessions),
        averageAttendance: Number(formData.averageAttendance),
        childrenNames: namesArray,
        isActive: formData.isActive,
        notes: formData.notes
      });
    }
    setIsModalOpen(false);
  };

  // Helper to compute simulated participant stats
  const getParticipantStats = (cc: ChildrenClass) => {
    const total = cc.childrenNames.length;
    const active = Math.min(total, cc.averageAttendance);
    const newCount = Math.max(1, Math.floor(total * 0.25));
    const returning = Math.max(0, total - newCount);
    
    // Age distribution approximation based on grade level
    const isGrade1 = cc.ageGroupLevel.includes('Grade 1') || cc.ageGroupLevel.includes('5-7');
    const ageDist = isGrade1 
      ? { 'Ages 5-6': Math.ceil(total * 0.45), 'Ages 7': Math.ceil(total * 0.35), 'Ages 8+': Math.max(0, total - Math.ceil(total * 0.8)) }
      : { 'Ages 7-8': Math.ceil(total * 0.4), 'Ages 9-10': Math.ceil(total * 0.5), 'Ages 11+': Math.max(0, total - Math.ceil(total * 0.9)) };

    return { total, active, newCount, returning, ageDist };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Children's Classes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Spiritual and moral education classes for children across Kimana with group roster management.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTargetClass(null);
                setIsMultiModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Multi-Person Data Entry</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          placeholder="Search classes by name, teacher, or locality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cc) => {
          const stats = getParticipantStats(cc);
          const isRosterExpanded = expandedRosterId === cc.id;

          return (
            <div 
              key={cc.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{cc.className}</h3>
                    <p className="text-xs text-slate-500">📍 {cc.localityName} • {cc.meetingSchedule}</p>
                  </div>
                  {userRole !== 'Viewer' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(cc)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      {userRole === 'Administrator' && (
                        <button onClick={() => { if (confirm(`Delete ${cc.className}?`)) deleteChildrenClass(cc.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Teacher</span>
                    <p className="font-bold text-slate-900 dark:text-white">{cc.teacherName}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Grade/Level</span>
                    <p className="font-bold text-slate-900 dark:text-white">{cc.ageGroupLevel}</p>
                  </div>
                </div>

                {/* Automatic Calculations / Analytics Badge */}
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Roster Calculations:
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      {cc.childrenNames.length} Total Children
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center">
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <span className="block text-slate-400 text-[10px]">Active</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{stats.active}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <span className="block text-slate-400 text-[10px]">New</span>
                      <strong className="text-blue-600 dark:text-blue-400">{stats.newCount}</strong>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <span className="block text-slate-400 text-[10px]">Returning</span>
                      <strong className="text-purple-600 dark:text-purple-400">{stats.returning}</strong>
                    </div>
                  </div>

                  {/* Age Distribution Breakdown */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Age Distribution:</span>
                    <div className="flex gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      {Object.entries(stats.ageDist).map(([range, count]) => (
                        <span key={range}>{range}: <strong>{count}</strong></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enrolled Children Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setExpandedRosterId(isRosterExpanded ? null : cc.id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 py-1"
                  >
                    <span>View Participants Roster ({cc.childrenNames.length})</span>
                    {isRosterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isRosterExpanded && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {cc.childrenNames.map((name, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-700/50 last:border-none">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{name}</span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
                          </div>
                        ))}
                      </div>

                      {userRole !== 'Viewer' && (
                        <button
                          onClick={() => handleOpenBatchAddForClass(cc)}
                          className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add More Children to this Class</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400">Avg Attendance: {cc.averageAttendance} kids</span>
                <span className="text-slate-400">{cc.numberOfSessions} sessions held</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Person Entry Modal */}
      <MultiPersonEntryModal
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        defaultCategory="children"
        targetGroupId={selectedTargetClass?.id}
        targetGroupName={selectedTargetClass?.className}
      />

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingClass ? "Edit Children's Class" : "New Children's Class"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value })}
                  placeholder="e.g. Isinet Virtues Class"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Teacher</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Grade / Age Level</label>
                  <input
                    type="text"
                    value={formData.ageGroupLevel}
                    onChange={e => setFormData({ ...formData, ageGroupLevel: e.target.value })}
                    placeholder="Grade 1 (Ages 5-7)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Schedule</label>
                  <input
                    type="text"
                    value={formData.meetingSchedule}
                    onChange={e => setFormData({ ...formData, meetingSchedule: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Sessions Held</label>
                  <input
                    type="number"
                    value={formData.numberOfSessions}
                    onChange={e => setFormData({ ...formData, numberOfSessions: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Average Attendance</label>
                  <input
                    type="number"
                    value={formData.averageAttendance}
                    onChange={e => setFormData({ ...formData, averageAttendance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Multiple Enrolled Children (Enter multiple at once)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedTargetClass(editingClass || null);
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
                  value={formData.childrenNames}
                  onChange={e => {
                    const val = e.target.value;
                    const parsed = val.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ 
                      ...prev, 
                      childrenNames: val,
                      averageAttendance: Math.max(prev.averageAttendance, parsed.length)
                    }));
                  }}
                  placeholder="Enter or paste multiple children names (separated by commas or new lines)&#10;e.g.:&#10;Joy Naserian&#10;Faith Chebet&#10;Peter Kiprotich"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs transition leading-relaxed shadow-sm resize-y"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {formData.childrenNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length > 0 ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {formData.childrenNames.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean).length} children entered (auto-calculates attendance totals)
                      </span>
                    ) : (
                      'Supports entering multiple people at once (comma or line separated)'
                    )}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Multiple entry enabled</span>
                </div>
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
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
