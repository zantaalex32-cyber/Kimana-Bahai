import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, Filter, Shield, Edit, Trash2, 
  Phone, Mail, Lock, Eye, EyeOff, MapPin, CheckCircle, Tag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Person, ServiceRole } from '../../types';

export const PeopleView: React.FC = () => {
  const { people, localities, addPerson, updatePerson, deletePerson, userRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showContactDetails, setShowContactDetails] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    localityId: localities[0]?.id || '',
    phone: '',
    email: '',
    role: 'Participant' as ServiceRole,
    status: 'Active' as 'Active' | 'Inactive' | 'Moved',
    activitiesServed: '',
    groupsServed: '',
    isSensitive: false,
    notes: ''
  });

  const rolesList: ServiceRole[] = [
    'Coordinator',
    'Tutor',
    'Animator',
    'Children\'s Class Teacher',
    'Teacher',
    'Host',
    'Volunteer',
    'Participant',
    'Other'
  ];

  const filteredPeople = people.filter(p => {
    if (localityFilter !== 'all' && p.localityId !== localityFilter) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.localityName.toLowerCase().includes(term);
  });

  const handleOpenCreate = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      localityId: localities[0]?.id || '',
      phone: '',
      email: '',
      role: 'Volunteer',
      status: 'Active',
      activitiesServed: '',
      groupsServed: '',
      isSensitive: false,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Person) => {
    setEditingPerson(p);
    setFormData({
      name: p.name,
      localityId: p.localityId,
      phone: p.phone || '',
      email: p.email || '',
      role: p.role,
      status: p.status,
      activitiesServed: p.activitiesServed.join(', '),
      groupsServed: p.groupsServed.join(', '),
      isSensitive: !!p.isSensitive,
      notes: p.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId);
    const locName = loc ? loc.name : 'Kimana Town';

    const actsArray = formData.activitiesServed.split(',').map(s => s.trim()).filter(Boolean);
    const groupsArray = formData.groupsServed.split(',').map(s => s.trim()).filter(Boolean);

    if (editingPerson) {
      updatePerson(editingPerson.id, {
        name: formData.name,
        localityId: formData.localityId,
        localityName: locName,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        activitiesServed: actsArray,
        groupsServed: groupsArray,
        isSensitive: formData.isSensitive,
        notes: formData.notes
      });
    } else {
      addPerson({
        name: formData.name,
        localityId: formData.localityId,
        localityName: locName,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        activitiesServed: actsArray,
        groupsServed: groupsArray,
        isSensitive: formData.isSensitive,
        notes: formData.notes,
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
  };

  // Privacy protection: Mask phone/email for non-coordinators unless unmasked by coordinator
  const canSeePrivateDetails = userRole === 'Administrator' || userRole === 'Cluster Coordinator' || showContactDetails;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Friends & Serving Believers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Administrative roster for coordinators, tutors, animators, teachers, and active community friends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContactDetails(!showContactDetails)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Toggle privacy masking"
          >
            {showContactDetails ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
            <span>{showContactDetails ? 'Hide Contact Info' : 'Show Contact Info'}</span>
          </button>

          {userRole !== 'Viewer' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              Add Friend
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or locality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Service Roles</option>
            {rolesList.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Friends Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h3>
                    {p.isSensitive && (
                      <span className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700" title="Sensitive Contact Info Protected">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" /> {p.localityName}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {p.role}
                </span>
              </div>

              {/* Contact Info (Protected/Masked) */}
              <div className="py-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {canSeePrivateDetails 
                      ? (p.phone || 'No phone recorded')
                      : '•••• ••••••• (Protected)'}
                  </span>
                </div>
                {p.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {canSeePrivateDetails 
                        ? p.email
                        : '••••@••••.com'}
                    </span>
                  </div>
                )}
              </div>

              {/* Groups & Activities Served */}
              {p.groupsServed.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Groups:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{p.groupsServed.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded font-bold ${
                p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {p.status}
              </span>

              {userRole !== 'Viewer' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {userRole === 'Administrator' && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${p.name}?`)) deletePerson(p.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Person Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingPerson ? 'Edit Friend Details' : 'Add New Friend / Serving Believer'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Samuel Kitiyo"
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
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Primary Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as ServiceRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7..."
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Moved">Moved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Assigned Groups (Comma separated)</label>
                <input
                  type="text"
                  value={formData.groupsServed}
                  onChange={e => setFormData({ ...formData, groupsServed: e.target.value })}
                  placeholder="e.g. Isinet Book 2 Study Circle, Sunday Devotional"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isSensitive"
                  checked={formData.isSensitive}
                  onChange={e => setFormData({ ...formData, isSensitive: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isSensitive" className="text-slate-700 dark:text-slate-300 font-medium">
                  Mark contact details as sensitive (requires coordinator view)
                </label>
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
                  Save Friend Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
