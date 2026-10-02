import React, { useState } from 'react';
import { PlaneTakeoff, Plus, Edit, Trash2, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceVisit } from '../../types';

export const VisitsView: React.FC = () => {
  const { serviceVisits, addServiceVisit, updateServiceVisit, deleteServiceVisit, userRole } = useApp();
  const [directionFilter, setDirectionFilter] = useState<'all' | 'Outbound' | 'Inbound'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<ServiceVisit | null>(null);

  const [formData, setFormData] = useState({
    direction: 'Outbound' as 'Outbound' | 'Inbound',
    personName: '',
    origin: 'Kimana Town',
    destination: '',
    purpose: '',
    activityOrGroup: '',
    responsiblePerson: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Planned' as 'Planned' | 'In Progress' | 'Completed' | 'Cancelled',
    notes: ''
  });

  const filteredVisits = serviceVisits.filter(v => {
    if (directionFilter !== 'all' && v.direction !== directionFilter) return false;
    return true;
  });

  const handleOpenCreate = (dir: 'Outbound' | 'Inbound' = 'Outbound') => {
    setEditingVisit(null);
    setFormData({
      direction: dir,
      personName: '',
      origin: dir === 'Outbound' ? 'Kimana Town' : '',
      destination: dir === 'Outbound' ? '' : 'Kimana Town',
      purpose: '',
      activityOrGroup: '',
      responsiblePerson: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'Planned',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: ServiceVisit) => {
    setEditingVisit(v);
    setFormData({
      direction: v.direction,
      personName: v.personName,
      origin: v.origin,
      destination: v.destination,
      purpose: v.purpose,
      activityOrGroup: v.activityOrGroup,
      responsiblePerson: v.responsiblePerson,
      startDate: v.startDate,
      endDate: v.endDate || '',
      status: v.status,
      notes: v.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVisit) {
      updateServiceVisit(editingVisit.id, {
        direction: formData.direction,
        personName: formData.personName,
        origin: formData.origin,
        destination: formData.destination,
        purpose: formData.purpose,
        activityOrGroup: formData.activityOrGroup,
        responsiblePerson: formData.responsiblePerson,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        notes: formData.notes
      });
    } else {
      addServiceVisit({
        direction: formData.direction,
        personName: formData.personName,
        origin: formData.origin,
        destination: formData.destination,
        purpose: formData.purpose,
        activityOrGroup: formData.activityOrGroup,
        responsiblePerson: formData.responsiblePerson,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
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
            <PlaneTakeoff className="w-6 h-6 text-orange-500" />
            Service & Inter-Community Visits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record friends travelling outside Kimana or visiting Kimana from other communities for study circles and service.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenCreate('Outbound')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Friend Travelling Out
            </button>
            <button
              onClick={() => handleOpenCreate('Inbound')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Visitor Coming In
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setDirectionFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            directionFilter === 'all' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Movements
        </button>
        <button
          onClick={() => setDirectionFilter('Outbound')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            directionFilter === 'Outbound' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Outbound Travelling (From Kimana)
        </button>
        <button
          onClick={() => setDirectionFilter('Inbound')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            directionFilter === 'Inbound' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inbound Visitors (To Kimana)
        </button>
      </div>

      {/* Visits List */}
      {filteredVisits.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <PlaneTakeoff className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="font-medium text-slate-900 dark:text-white">No visits or travel records found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {directionFilter !== 'all' ? 'Try switching the direction filter.' : 'Record outbound travelling teachers or inbound visiting friends.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((v) => (
          <div key={v.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    v.direction === 'Outbound' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {v.direction}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{v.personName}</h3>
                </div>

                {userRole !== 'Viewer' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(v)} className="p-1 rounded text-slate-400 hover:text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    {userRole === 'Administrator' && (
                      <button onClick={() => { if (confirm(`Delete visit record?`)) deleteServiceVisit(v.id); }} className="p-1 rounded text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Route:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {v.origin} ➔ {v.destination}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Purpose & Activity:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{v.purpose}</p>
                  <p className="text-slate-500">{v.activityOrGroup}</p>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>📅 Date: {v.startDate}</span>
                  <span>Contact: {v.responsiblePerson}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className={`px-2 py-0.5 rounded ${
                v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                v.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingVisit ? 'Edit Visit Record' : 'Record Inter-Community Visit'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Direction</label>
                  <select
                    value={formData.direction}
                    onChange={e => setFormData({ ...formData, direction: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Outbound">Outbound (From Kimana)</option>
                    <option value="Inbound">Inbound (To Kimana)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Friend / Visitor Name</label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={e => setFormData({ ...formData, personName: e.target.value })}
                    placeholder="e.g. John Kaelo"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Origin Community</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Kimana Town"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Destination Community</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Rombo Locality / Nairobi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Facilitate Study Circle / Campaign"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Activity / Group Joining</label>
                  <input
                    type="text"
                    value={formData.activityOrGroup}
                    onChange={e => setFormData({ ...formData, activityOrGroup: e.target.value })}
                    placeholder="Ruhi Book 2 Group"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Local Contact Person</label>
                  <input
                    type="text"
                    value={formData.responsiblePerson}
                    onChange={e => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
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
                  Save Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
