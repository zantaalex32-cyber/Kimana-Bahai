import React, { useState } from 'react';
import { 
  ArrowDownRight, UserPlus, Users, Search, Filter, Calendar, 
  MapPin, CheckCircle2, BookOpen, HeartHandshake, Sparkles, 
  Clock, Edit, Trash2, Shield, Plus, RotateCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FriendComingIn } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const FriendsComingInView: React.FC = () => {
  const { 
    friendsComingIn, localities, addFriendComingIn, updateFriendComingIn, 
    deleteFriendComingIn, userRole, formatContact, isSecurityUnlocked,
    currentCycleId, cycles
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [howReachedFilter, setHowReachedFilter] = useState<string>('all');

  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<FriendComingIn | null>(null);

  // Single friend form data
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Female',
    contact: '',
    localityId: localities[0]?.id || '',
    neighborhood: '',
    date: new Date().toISOString().split('T')[0],
    howReached: 'Home Visit',
    introducedBy: '',
    activitiesParticipating: 'Weekly Devotionals',
    currentStatus: 'Needs Initial Visit' as FriendComingIn['currentStatus'],
    notes: ''
  });

  // Filtered dataset
  const filteredFriends = friendsComingIn.filter(f => {
    const matchesSearch = 
      f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.localityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.introducedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocality = selectedLocality === 'all' || f.localityId === selectedLocality;
    const matchesStatus = statusFilter === 'all' || f.currentStatus === statusFilter;
    const matchesReached = howReachedFilter === 'all' || f.howReached === howReachedFilter;

    return matchesSearch && matchesLocality && matchesStatus && matchesReached;
  });

  // Analytics
  const totalIncoming = friendsComingIn.length;
  const enrolledInRuhi = friendsComingIn.filter(f => f.currentStatus === 'Enrolled in Ruhi B1').length;
  const needsInitialVisit = friendsComingIn.filter(f => f.currentStatus === 'Needs Initial Visit').length;
  const wellIntegrated = friendsComingIn.filter(f => f.currentStatus === 'Well Integrated').length;

  const handleOpenCreateSingle = () => {
    setEditingFriend(null);
    setFormData({
      fullName: '',
      age: '',
      gender: 'Female',
      contact: '',
      localityId: localities[0]?.id || '',
      neighborhood: '',
      date: new Date().toISOString().split('T')[0],
      howReached: 'Home Visit',
      introducedBy: '',
      activitiesParticipating: 'Weekly Devotionals',
      currentStatus: 'Needs Initial Visit',
      notes: ''
    });
    setIsSingleModalOpen(true);
  };

  const handleOpenEdit = (f: FriendComingIn) => {
    setEditingFriend(f);
    setFormData({
      fullName: f.fullName,
      age: f.age ? String(f.age) : '',
      gender: f.gender || 'Female',
      contact: f.contact || '',
      localityId: f.localityId,
      neighborhood: f.neighborhood || '',
      date: f.date,
      howReached: f.howReached,
      introducedBy: f.introducedBy,
      activitiesParticipating: f.activitiesParticipating.join(', '),
      currentStatus: f.currentStatus,
      notes: f.notes || ''
    });
    setIsSingleModalOpen(true);
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.localityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const acts = formData.activitiesParticipating.split(',').map(s => s.trim()).filter(Boolean);

    if (editingFriend) {
      updateFriendComingIn(editingFriend.id, {
        fullName: formData.fullName,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender as any,
        contact: formData.contact,
        localityId: formData.localityId,
        localityName: locName,
        neighborhood: formData.neighborhood,
        date: formData.date,
        howReached: formData.howReached,
        introducedBy: formData.introducedBy,
        activitiesParticipating: acts,
        currentStatus: formData.currentStatus,
        notes: formData.notes
      });
    } else {
      addFriendComingIn({
        fullName: formData.fullName,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender as any,
        contact: formData.contact,
        localityId: formData.localityId,
        localityName: locName,
        neighborhood: formData.neighborhood,
        date: formData.date,
        howReached: formData.howReached,
        introducedBy: formData.introducedBy,
        activitiesParticipating: acts,
        currentStatus: formData.currentStatus,
        notes: formData.notes
      });
    }
    setIsSingleModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ArrowDownRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Friends Coming In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dedicated registry of seekers, new arrivals, and friends joining the Kimana Bahá’í community.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMultiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              id="batch-add-incoming-btn"
            >
              <Users className="w-4 h-4" />
              <span>Multi-Person Batch Entry</span>
            </button>
            <button
              onClick={handleOpenCreateSingle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              id="add-single-incoming-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Total Arrivals</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalIncoming}</div>
          <p className="text-[11px] text-slate-400 mt-1">Recorded community friends</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Needs Initial Visit</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{needsInitialVisit}</div>
          <p className="text-[11px] text-slate-400 mt-1">Pending pastoral accompaniment</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">In Study Circle</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{enrolledInRuhi}</div>
          <p className="text-[11px] text-slate-400 mt-1">Enrolled in Ruhi Book 1</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Well Integrated</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{wellIntegrated}</div>
          <p className="text-[11px] text-slate-400 mt-1">Hosting / regular participation</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, locality, introducer, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Localities</option>
              {localities.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="Needs Initial Visit">Needs Initial Visit</option>
              <option value="Enrolled in Ruhi B1">Enrolled in Ruhi B1</option>
              <option value="Attending Devotionals">Attending Devotionals</option>
              <option value="Children Class Parent">Children Class Parent</option>
              <option value="Well Integrated">Well Integrated</option>
            </select>

            <select
              value={howReachedFilter}
              onChange={(e) => setHowReachedFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Outreach Channels</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Teaching Campaign">Teaching Campaign</option>
              <option value="Family/Friend Introduction">Family/Friend</option>
              <option value="Devotional Meeting">Devotional</option>
              <option value="Youth Activity">Youth Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Friends Cards / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Showing {filteredFriends.length} friends coming into Kimana</span>
          {!isSecurityUnlocked && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              Contacts Protected
            </span>
          )}
        </div>

        {filteredFriends.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
            <ArrowDownRight className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching records found.
            </p>
            <p className="text-xs text-slate-400">
              Use "Multi-Person Batch Entry" to record newly arrived friends or seekers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div 
                key={friend.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {friend.fullName}
                        </h3>
                        {friend.age && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Age {friend.age}
                          </span>
                        )}
                        {friend.gender && (
                          <span className="text-xs text-slate-400">
                            ({friend.gender})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{friend.localityName}</span>
                        {friend.neighborhood && <span>• {friend.neighborhood}</span>}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      friend.currentStatus === 'Well Integrated'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : friend.currentStatus === 'Enrolled in Ruhi B1'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        : friend.currentStatus === 'Needs Initial Visit'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                    }`}>
                      {friend.currentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reached Via</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{friend.howReached}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Introduced By</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{friend.introducedBy || 'Direct Outreach'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date Recorded</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{friend.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{formatContact(friend.contact)}</span>
                    </div>
                  </div>

                  {friend.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{friend.notes}"
                    </p>
                  )}
                </div>

                {userRole !== 'Viewer' && (
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {/* Quick Status Transition Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 text-[11px]">Move status:</span>
                      <select
                        value={friend.currentStatus}
                        onChange={(e) => updateFriendComingIn(friend.id, { currentStatus: e.target.value as any })}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 focus:outline-none"
                      >
                        <option value="Needs Initial Visit">Needs Initial Visit</option>
                        <option value="Enrolled in Ruhi B1">Enrolled in Ruhi B1</option>
                        <option value="Attending Devotionals">Attending Devotionals</option>
                        <option value="Children Class Parent">Children Class Parent</option>
                        <option value="Well Integrated">Well Integrated</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(friend)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFriendComingIn(friend.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Multi-Person Entry Modal */}
      <MultiPersonEntryModal 
        isOpen={isMultiModalOpen}
        onClose={() => setIsMultiModalOpen(false)}
        defaultCategory="friendscomingin"
      />

      {/* Single Friend Edit/Create Modal */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingFriend ? 'Edit Incoming Friend Record' : 'Record Friend Coming In'}
            </h2>
            <form onSubmit={handleSubmitSingle} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Locality</label>
                  <select
                    value={formData.localityId}
                    onChange={(e) => setFormData({ ...formData, localityId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    {localities.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Neighborhood</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">How Reached</label>
                  <select
                    value={formData.howReached}
                    onChange={(e) => setFormData({ ...formData, howReached: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Teaching Campaign">Teaching Campaign</option>
                    <option value="Family/Friend Introduction">Family/Friend Introduction</option>
                    <option value="Devotional Meeting">Devotional Meeting</option>
                    <option value="Youth Activity">Youth Activity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Introduced By</label>
                  <input
                    type="text"
                    value={formData.introducedBy}
                    onChange={(e) => setFormData({ ...formData, introducedBy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Needs Initial Visit">Needs Initial Visit</option>
                    <option value="Enrolled in Ruhi B1">Enrolled in Ruhi B1</option>
                    <option value="Attending Devotionals">Attending Devotionals</option>
                    <option value="Children Class Parent">Children Class Parent</option>
                    <option value="Well Integrated">Well Integrated</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
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
