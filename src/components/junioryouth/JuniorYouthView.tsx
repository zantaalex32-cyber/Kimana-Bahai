import React, { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, MapPin, Users, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JuniorYouthGroup } from '../../types';

export const JuniorYouthView: React.FC = () => {
  const { juniorYouthGroups, localities, addJuniorYouthGroup, updateJuniorYouthGroup, deleteJuniorYouthGroup, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<JuniorYouthGroup | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';
    const membersArray = formData.members.split(',').map(s => s.trim()).filter(Boolean);
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

  return (
    <div className="space-y-6 pb-12">
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
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Form JY Group
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((jy) => (
          <div key={jy.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{jy.groupName}</h3>
                  <p className="text-xs text-slate-500">📍 {jy.localityName} • {jy.meetingSchedule}</p>
                </div>
                {userRole !== 'Viewer' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(jy)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    {userRole === 'Administrator' && (
                      <button onClick={() => { if (confirm(`Delete ${jy.groupName}?`)) deleteJuniorYouthGroup(jy.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold uppercase">Current Text:</span>
                  <p className="font-bold text-purple-900 dark:text-purple-200 mt-0.5">{jy.currentMaterial} ({jy.progress})</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Animator</span>
                    <p className="font-bold text-slate-900 dark:text-white">{jy.animatorName}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Avg Attendance</span>
                    <p className="font-bold text-slate-900 dark:text-white">{jy.averageAttendance} members</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Junior Youth Members ({jy.members.length}):</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{jy.members.join(', ')}</p>
                </div>

                {jy.serviceProjects.length > 0 && (
                  <div>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">Service Projects:</span>
                    <p className="text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5">{jy.serviceProjects.join(' • ')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{jy.numberOfMeetings} meetings held</span>
              <span className="font-bold text-emerald-600">Active Group</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingGroup ? 'Edit JY Group' : 'New Junior Youth Group'}
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Animator Name</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Progress / Chapter</label>
                  <input
                    type="text"
                    value={formData.progress}
                    onChange={e => setFormData({ ...formData, progress: e.target.value })}
                    placeholder="Chapter 4"
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

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Members (Comma separated)</label>
                <input
                  type="text"
                  value={formData.members}
                  onChange={e => setFormData({ ...formData, members: e.target.value })}
                  placeholder="Moses, Ruth, Timothy, Sharon"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Service Projects</label>
                <input
                  type="text"
                  value={formData.serviceProjects}
                  onChange={e => setFormData({ ...formData, serviceProjects: e.target.value })}
                  placeholder="Tree planting, clean up day"
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
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
