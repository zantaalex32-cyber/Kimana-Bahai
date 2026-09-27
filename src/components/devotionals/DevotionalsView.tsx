import React, { useState } from 'react';
import { HeartHandshake, Plus, Edit, Trash2, MapPin, Users, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DevotionalMeeting } from '../../types';

export const DevotionalsView: React.FC = () => {
  const { devotionals, localities, addDevotional, updateDevotional, deleteDevotional, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<DevotionalMeeting | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    localityId: localities[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    themeTopic: 'Unity & Oneness of Humanity',
    participantsCount: 10,
    description: '',
    notes: ''
  });

  const filteredDevotionals = devotionals.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.themeTopic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingDev(null);
    setFormData({
      title: 'Weekly Devotional Meeting',
      hostName: 'Grace Sian',
      localityId: localities[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      themeTopic: 'Unity & Prayer',
      participantsCount: 12,
      description: 'Devotional prayers and spiritual reflections.',
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
      description: d.description || '',
      notes: d.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';

    if (editingDev) {
      updateDevotional(editingDev.id, {
        title: formData.title,
        hostName: formData.hostName,
        localityId: formData.localityId,
        localityName: locName,
        date: formData.date,
        time: formData.time,
        themeTopic: formData.themeTopic,
        participantsCount: Number(formData.participantsCount),
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
        participantsCount: Number(formData.participantsCount),
        description: formData.description,
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
            <HeartHandshake className="w-6 h-6 text-rose-500" />
            Devotional Meetings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gatherings for prayer, meditation, and spiritual fellowship held in homes across Kimana.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Record Devotional
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevotionals.map((dev) => (
          <div key={dev.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{dev.title}</h3>
                  <p className="text-xs text-slate-500">📍 {dev.localityName} • Host: {dev.hostName}</p>
                </div>
                {userRole !== 'Viewer' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(dev)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    {userRole === 'Administrator' && (
                      <button onClick={() => { if (confirm(`Delete devotional?`)) deleteDevotional(dev.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
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
                  <span className="font-bold text-slate-900 dark:text-white">{dev.participantsCount} participants</span>
                </div>

                {dev.description && (
                  <p className="text-slate-500 pt-1">{dev.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
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
