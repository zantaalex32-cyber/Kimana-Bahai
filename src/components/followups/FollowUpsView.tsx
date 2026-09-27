import React, { useState } from 'react';
import { 
  ListTodo, Plus, Edit, Trash2, CheckCircle2, Clock, 
  AlertCircle, Search, Filter, Calendar, User, MapPin, Tag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FollowUpItem, FollowUpPriority, FollowUpStatus } from '../../types';

export const FollowUpsView: React.FC = () => {
  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, userRole, localities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FollowUpItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    responsiblePerson: '',
    relatedEntity: '',
    localityName: 'Kimana Town',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as FollowUpPriority,
    status: 'Pending' as FollowUpStatus,
    notes: ''
  });

  const filteredFollowUps = followUps.filter(f => {
    const matchesSearch = 
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.relatedEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.localityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || f.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      responsiblePerson: '',
      relatedEntity: '',
      localityName: localities[0]?.name || 'Kimana Town',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Pending',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FollowUpItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      responsiblePerson: item.responsiblePerson,
      relatedEntity: item.relatedEntity,
      localityName: item.localityName,
      dueDate: item.dueDate,
      priority: item.priority,
      status: item.status,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFollowUp(editingItem.id, formData);
    } else {
      addFollowUp(formData);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (item: FollowUpItem) => {
    const nextStatus: FollowUpStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
    updateFollowUp(item.id, { status: nextStatus });
  };

  const getPriorityBadge = (priority: FollowUpPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300';
      case 'Pending':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Action Items & Follow-ups</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track commitments, visits needed, and key action items across Kimana Cluster localities.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            id="add-followup-button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Action Item</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative col-span-1 sm:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search follow-ups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            id="followups-search-input"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            id="followups-status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            id="followups-priority-filter"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* List / Cards */}
      {filteredFollowUps.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ListTodo className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="font-medium text-slate-900 dark:text-white">No follow-ups found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or create a new action item.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFollowUps.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isOverdue = !isCompleted && new Date(item.dueDate) < new Date();

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted 
                    ? 'border-slate-200 dark:border-slate-800 opacity-75' 
                    : isOverdue 
                      ? 'border-red-300 dark:border-red-900/60 bg-red-50/20' 
                      : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleStatus(item)}
                    className={`mt-1 p-1 rounded-lg transition ${
                      isCompleted 
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                        : 'text-slate-400 hover:text-emerald-600 bg-slate-100 dark:bg-slate-800'
                    }`}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    id={`toggle-followup-${item.id}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-slate-900 dark:text-white text-base ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {item.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Context:</span> {item.relatedEntity}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Assigned: <strong className="text-slate-700 dark:text-slate-300">{item.responsiblePerson}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.localityName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: {item.dueDate}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {userRole !== 'Viewer' && (
                  <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Item"
                      id={`edit-followup-${item.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {(userRole === 'Cluster Coordinator' || userRole === 'Administrator') && (
                      <button
                        onClick={() => deleteFollowUp(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Delete Item"
                        id={`delete-followup-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingItem ? 'Edit Action Item' : 'New Action Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Title / Action Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visit family following Ruhi B1 finish"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Assigned Responsible Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Naserian"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Locality</label>
                  <select
                    value={formData.localityName}
                    onChange={(e) => setFormData({ ...formData, localityName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  >
                    {localities.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Related Context / Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Activity: Children's Class Teacher Training"
                  value={formData.relatedEntity}
                  onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as FollowUpPriority })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as FollowUpStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Notes / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Additional context or outcome details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Create Action Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
