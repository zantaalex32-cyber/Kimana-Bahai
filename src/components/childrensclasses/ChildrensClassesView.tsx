import React, { useState } from 'react';
import { Sparkles, Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChildrenClass } from '../../types';

export const ChildrensClassesView: React.FC = () => {
  const { childrenClasses, localities, addChildrenClass, updateChildrenClass, deleteChildrenClass, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ChildrenClass | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';
    const namesArray = formData.childrenNames.split(',').map(s => s.trim()).filter(Boolean);

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

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Children's Classes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Spiritual and moral education classes for children across Kimana.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Children's Class
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cc) => (
          <div key={cc.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
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

              <div className="my-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Teacher</span>
                    <p className="font-bold text-slate-900 dark:text-white">{cc.teacherName}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Grade/Level</span>
                    <p className="font-bold text-slate-900 dark:text-white">{cc.ageGroupLevel}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Enrolled Children ({cc.childrenNames.length}):</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{cc.childrenNames.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-600 dark:text-amber-400">Avg Attendance: {cc.averageAttendance} kids</span>
              <span className="text-slate-400">{cc.numberOfSessions} sessions held</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingClass ? 'Edit Children\'s Class' : 'New Children\'s Class'}
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Avg Attendance</label>
                  <input
                    type="number"
                    value={formData.averageAttendance}
                    onChange={e => setFormData({ ...formData, averageAttendance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Children Names (Comma separated)</label>
                <input
                  type="text"
                  value={formData.childrenNames}
                  onChange={e => setFormData({ ...formData, childrenNames: e.target.value })}
                  placeholder="Joy, Kevin, Amina, Joshua"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
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
