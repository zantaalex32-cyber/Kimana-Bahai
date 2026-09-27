import React, { useState } from 'react';
import { Home, Plus, Edit, Trash2, MapPin, Shield, Lock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HomeVisit } from '../../types';

export const HomeVisitsView: React.FC = () => {
  const { homeVisits, localities, addHomeVisit, updateHomeVisit, deleteHomeVisit, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<HomeVisit | null>(null);

  const [formData, setFormData] = useState({
    familyOrPersonVisited: '',
    localityId: localities[0]?.id || '',
    visitors: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    outcome: '',
    followUpNeeded: false,
    followUpDate: '',
    isSensitive: false,
    notes: ''
  });

  const filteredVisits = homeVisits.filter(h => 
    h.familyOrPersonVisited.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.localityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingVisit(null);
    setFormData({
      familyOrPersonVisited: '',
      localityId: localities[0]?.id || '',
      visitors: 'Samuel Kitiyo, Grace Sian',
      date: new Date().toISOString().split('T')[0],
      purpose: 'Spiritual encouragement & introduction to core activities',
      outcome: 'Warm reception. Invited family to weekly devotional.',
      followUpNeeded: false,
      followUpDate: '',
      isSensitive: false,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hv: HomeVisit) => {
    setEditingVisit(hv);
    setFormData({
      familyOrPersonVisited: hv.familyOrPersonVisited,
      localityId: hv.localityId,
      visitors: hv.visitors.join(', '),
      date: hv.date,
      purpose: hv.purpose,
      outcome: hv.outcome || '',
      followUpNeeded: hv.followUpNeeded,
      followUpDate: hv.followUpDate || '',
      isSensitive: !!hv.isSensitive,
      notes: hv.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';
    const visitorsArray = formData.visitors.split(',').map(s => s.trim()).filter(Boolean);

    if (editingVisit) {
      updateHomeVisit(editingVisit.id, {
        familyOrPersonVisited: formData.familyOrPersonVisited,
        localityId: formData.localityId,
        localityName: locName,
        visitors: visitorsArray,
        date: formData.date,
        purpose: formData.purpose,
        outcome: formData.outcome,
        followUpNeeded: formData.followUpNeeded,
        followUpDate: formData.followUpDate,
        isSensitive: formData.isSensitive,
        notes: formData.notes
      });
    } else {
      addHomeVisit({
        familyOrPersonVisited: formData.familyOrPersonVisited,
        localityId: formData.localityId,
        localityName: locName,
        visitors: visitorsArray,
        date: formData.date,
        purpose: formData.purpose,
        outcome: formData.outcome,
        followUpNeeded: formData.followUpNeeded,
        followUpDate: formData.followUpDate,
        isSensitive: formData.isSensitive,
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
            <Home className="w-6 h-6 text-cyan-600" />
            Home Visits Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Strengthening bonds of friendship, spiritual reflection, and family engagement across Kimana households.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Record Home Visit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisits.map((hv) => (
          <div key={hv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{hv.familyOrPersonVisited}</h3>
                    {hv.isSensitive && (
                      <span className="p-1 rounded bg-amber-100 text-amber-800" title="Protected information">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">📍 {hv.localityName} • Date: {hv.date}</p>
                </div>
                {userRole !== 'Viewer' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(hv)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    {userRole === 'Administrator' && (
                      <button onClick={() => { if (confirm(`Delete visit record?`)) deleteHomeVisit(hv.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Visitors / Friends:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{hv.visitors.join(', ')}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Purpose:</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{hv.purpose}</p>
                </div>

                {hv.outcome && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Outcome / Summary:</span>
                    <p className="text-slate-600 dark:text-slate-300">{hv.outcome}</p>
                  </div>
                )}

                {hv.followUpNeeded && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Follow-up needed by {hv.followUpDate || 'TBD'}</span>
                  </div>
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
              {editingVisit ? 'Edit Home Visit' : 'Record Home Visit'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Family / Person Visited</label>
                <input
                  type="text"
                  required
                  value={formData.familyOrPersonVisited}
                  onChange={e => setFormData({ ...formData, familyOrPersonVisited: e.target.value })}
                  placeholder="e.g. Ole Naiputari Family"
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Visitors / Friends Making Visit</label>
                <input
                  type="text"
                  required
                  value={formData.visitors}
                  onChange={e => setFormData({ ...formData, visitors: e.target.value })}
                  placeholder="Daniel, Grace, Samuel"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Spiritual prayers & invitation to devotional"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Outcome / Notes</label>
                <textarea
                  value={formData.outcome}
                  onChange={e => setFormData({ ...formData, outcome: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="followUpNeeded"
                    checked={formData.followUpNeeded}
                    onChange={e => setFormData({ ...formData, followUpNeeded: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <label htmlFor="followUpNeeded" className="font-semibold text-slate-700 dark:text-slate-300">
                    Follow-up Needed
                  </label>
                </div>

                {formData.followUpNeeded && (
                  <div className="pl-5">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Follow-up Due Date</label>
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                )}
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
                  Save Home Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
