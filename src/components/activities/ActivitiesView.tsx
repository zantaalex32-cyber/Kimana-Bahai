import React, { useState } from 'react';
import { 
  CalendarCheck, Plus, Search, Filter, CheckCircle, 
  Clock, MapPin, Users, Edit, Trash2, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Activity, ActivityType } from '../../types';

export const ActivitiesView: React.FC = () => {
  const { activities, localities, addActivity, updateActivity, deleteActivity, userRole, currentCycleId } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Teaching Activity' as ActivityType,
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    localityId: localities[0]?.id || '',
    venue: '',
    personResponsible: '',
    expectedParticipants: 10,
    actualAttendance: 10,
    description: '',
    followUpRequired: false,
    followUpDate: '',
    followUpNotes: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled',
    notes: ''
  });

  const activityTypesList: ActivityType[] = [
    'Study Circle',
    'Children\'s Class',
    'Junior Youth Group',
    'Devotional Meeting',
    'Home Visit',
    'Teaching Activity',
    'Community Meeting',
    'Feast',
    'Training',
    'Conference',
    'Campaign',
    'Reflection Meeting',
    'Other'
  ];

  const filteredActivities = activities.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (localityFilter !== 'all' && a.localityId !== localityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    const term = searchTerm.toLowerCase();
    return a.title.toLowerCase().includes(term) || a.personResponsible.toLowerCase().includes(term) || a.venue.toLowerCase().includes(term);
  });

  const handleOpenCreate = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      type: 'Teaching Activity',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      localityId: localities[0]?.id || '',
      venue: '',
      personResponsible: '',
      expectedParticipants: 0,
      actualAttendance: 0,
      description: '',
      followUpRequired: false,
      followUpDate: '',
      followUpNotes: '',
      status: 'Scheduled',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingActivity(act);
    setFormData({
      title: act.title,
      type: act.type,
      date: act.date,
      startTime: act.startTime || '10:00',
      endTime: act.endTime || '12:00',
      localityId: act.localityId,
      venue: act.venue,
      personResponsible: act.personResponsible,
      expectedParticipants: act.expectedParticipants,
      actualAttendance: act.actualAttendance,
      description: act.description || '',
      followUpRequired: act.followUpRequired,
      followUpDate: act.followUpDate || '',
      followUpNotes: act.followUpNotes || '',
      status: act.status,
      notes: act.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';

    if (editingActivity) {
      updateActivity(editingActivity.id, {
        title: formData.title,
        type: formData.type,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        localityId: formData.localityId,
        localityName: locName,
        venue: formData.venue,
        personResponsible: formData.personResponsible,
        expectedParticipants: Number(formData.expectedParticipants),
        actualAttendance: Number(formData.actualAttendance),
        description: formData.description,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate,
        followUpNotes: formData.followUpNotes,
        status: formData.status,
        notes: formData.notes
      });
    } else {
      addActivity({
        title: formData.title,
        type: formData.type,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        localityId: formData.localityId,
        localityName: locName,
        venue: formData.venue,
        personResponsible: formData.personResponsible,
        expectedParticipants: Number(formData.expectedParticipants),
        actualAttendance: Number(formData.actualAttendance),
        description: formData.description,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate,
        followUpNotes: formData.followUpNotes,
        status: formData.status,
        cycleId: currentCycleId,
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
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            Central Activity Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record, schedule, monitor and follow up on all community-building activities in Kimana.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
            id="add-activity-button"
          >
            <Plus className="w-4 h-4" />
            Record Activity
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search activity title, venue, responsible..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Activity Types</option>
            {activityTypesList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
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

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CalendarCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="font-medium text-slate-900 dark:text-white">No activities found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || typeFilter !== 'all' || localityFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Record or schedule community activities to begin tracking.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {act.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  act.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  act.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-rose-50 text-rose-700'
                }`}>
                  {act.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">📅 {act.date} {act.startTime && `• ${act.startTime}`}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base">{act.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {act.localityName} ({act.venue})
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Attendance: {act.actualAttendance} / {act.expectedParticipants} expected
                </span>
                <span>Responsible: <strong className="text-slate-900 dark:text-white">{act.personResponsible}</strong></span>
              </div>

              {act.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {act.description}
                </p>
              )}

              {act.followUpRequired && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200/60">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Follow-up needed by {act.followUpDate || 'TBD'}: {act.followUpNotes}</span>
                </div>
              )}
            </div>

            {userRole !== 'Viewer' && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(act)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {userRole === 'Administrator' && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete activity "${act.title}"?`)) deleteActivity(act.id);
                    }}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingActivity ? 'Edit Activity Details' : 'Record / Schedule Activity'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Isinet Teaching Campaign"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Activity Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as ActivityType })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {activityTypesList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Locality</label>
                  <select
                    value={formData.localityId}
                    onChange={e => setFormData({ ...formData, localityId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {localities.length === 0 ? (
                      <option value="">No localities added yet</option>
                    ) : (
                      localities.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))
                    )}
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Kimana Center"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Person Responsible</label>
                  <input
                    type="text"
                    value={formData.personResponsible}
                    onChange={e => setFormData({ ...formData, personResponsible: e.target.value })}
                    placeholder="e.g. Facilitator or Host Name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Expected</label>
                  <input
                    type="number"
                    value={formData.expectedParticipants}
                    onChange={e => setFormData({ ...formData, expectedParticipants: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Actual Attendance</label>
                  <input
                    type="number"
                    value={formData.actualAttendance}
                    onChange={e => setFormData({ ...formData, actualAttendance: Number(e.target.value) })}
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
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Description / Goals</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-1 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={e => setFormData({ ...formData, followUpRequired: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <label htmlFor="followUpRequired" className="font-semibold text-slate-700 dark:text-slate-300">
                    Follow-up Required for this activity
                  </label>
                </div>

                {formData.followUpRequired && (
                  <div className="grid grid-cols-2 gap-3 pl-5">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Follow-up Due Date</label>
                      <input
                        type="date"
                        value={formData.followUpDate}
                        onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Follow-up Task Notes</label>
                      <input
                        type="text"
                        value={formData.followUpNotes}
                        onChange={e => setFormData({ ...formData, followUpNotes: e.target.value })}
                        placeholder="e.g. Visit interested seekers"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
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
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
