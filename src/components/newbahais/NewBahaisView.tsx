import React, { useState } from 'react';
import { UserCheck, Plus, Edit, Trash2, MapPin, Calendar, HeartHandshake, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NewBahai } from '../../types';

export const NewBahaisView: React.FC = () => {
  const { newBahais, localities, addNewBahai, updateNewBahai, deleteNewBahai, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNewBahai, setEditingNewBahai] = useState<NewBahai | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    localityId: localities[0]?.id || '',
    dateRegistered: new Date().toISOString().split('T')[0],
    accompanyingFriend: 'Samuel Kitiyo',
    connectionChannel: 'Home Visit',
    followUpStatus: 'Needs Initial Visit' as NewBahai['followUpStatus'],
    activitiesParticipating: 'Devotionals, Study Circle',
    notes: ''
  });

  const filteredNewBahais = newBahais.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.localityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.accompanyingFriend && n.accompanyingFriend.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingNewBahai(null);
    setFormData({
      name: '',
      localityId: localities[0]?.id || '',
      dateRegistered: new Date().toISOString().split('T')[0],
      accompanyingFriend: 'Samuel Kitiyo',
      connectionChannel: 'Home Visit',
      followUpStatus: 'Needs Initial Visit',
      activitiesParticipating: 'Devotionals, Ruhi Book 1',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (nb: NewBahai) => {
    setEditingNewBahai(nb);
    setFormData({
      name: nb.name,
      localityId: nb.localityId,
      dateRegistered: nb.dateRegistered,
      accompanyingFriend: nb.accompanyingFriend || '',
      connectionChannel: nb.connectionChannel,
      followUpStatus: nb.followUpStatus,
      activitiesParticipating: nb.activitiesParticipating.join(', '),
      notes: nb.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';
    const activitiesArr = formData.activitiesParticipating.split(',').map(s => s.trim()).filter(Boolean);

    if (editingNewBahai) {
      updateNewBahai(editingNewBahai.id, {
        name: formData.name,
        localityId: formData.localityId,
        localityName: locName,
        dateRegistered: formData.dateRegistered,
        accompanyingFriend: formData.accompanyingFriend,
        connectionChannel: formData.connectionChannel,
        followUpStatus: formData.followUpStatus,
        activitiesParticipating: activitiesArr,
        notes: formData.notes
      });
    } else {
      addNewBahai({
        name: formData.name,
        localityId: formData.localityId,
        localityName: locName,
        dateRegistered: formData.dateRegistered,
        accompanyingFriend: formData.accompanyingFriend,
        connectionChannel: formData.connectionChannel,
        followUpStatus: formData.followUpStatus,
        activitiesParticipating: activitiesArr,
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
            <UserCheck className="w-6 h-6 text-emerald-600" />
            New Believers & Declarations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcoming and accompanying newly declared Bahá'ís in Kimana Cluster.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Record Declaration
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search new believers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNewBahais.map((nb) => (
          <div key={nb.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{nb.name}</h3>
                  <p className="text-xs text-slate-500">📍 {nb.localityName} • Date: {nb.dateRegistered}</p>
                </div>

                {userRole !== 'Viewer' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(nb)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    {(userRole === 'Cluster Coordinator' || userRole === 'Administrator') && (
                      <button onClick={() => { if (confirm(`Delete record?`)) deleteNewBahai(nb.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">Channel / Context:</span>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">{nb.connectionChannel}</p>
                </div>

                {nb.accompanyingFriend && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Accompanied By:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{nb.accompanyingFriend}</p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Integration Status:</span>
                  <p className="font-semibold text-emerald-600">{nb.followUpStatus}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Participating in: {nb.activitiesParticipating.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingNewBahai ? 'Edit Declaration Record' : 'Record New Bahá\'í Declaration'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Peter Kaelo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Date Registered</label>
                  <input
                    type="date"
                    value={formData.dateRegistered}
                    onChange={e => setFormData({ ...formData, dateRegistered: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Channel / Connection</label>
                  <input
                    type="text"
                    value={formData.connectionChannel}
                    onChange={e => setFormData({ ...formData, connectionChannel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Accompanying Friend</label>
                  <input
                    type="text"
                    value={formData.accompanyingFriend}
                    onChange={e => setFormData({ ...formData, accompanyingFriend: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Integration Status</label>
                <select
                  value={formData.followUpStatus}
                  onChange={e => setFormData({ ...formData, followUpStatus: e.target.value as NewBahai['followUpStatus'] })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Needs Initial Visit">Needs Initial Visit</option>
                  <option value="Enrolled in Ruhi B1">Enrolled in Ruhi B1</option>
                  <option value="Attending Devotionals">Attending Devotionals</option>
                  <option value="Well Integrated">Well Integrated</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Activities Participating (Comma separated)</label>
                <input
                  type="text"
                  value={formData.activitiesParticipating}
                  onChange={e => setFormData({ ...formData, activitiesParticipating: e.target.value })}
                  placeholder="e.g. Devotionals, Ruhi Book 1"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
