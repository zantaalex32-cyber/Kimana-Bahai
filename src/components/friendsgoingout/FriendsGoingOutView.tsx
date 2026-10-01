import React, { useState } from 'react';
import { 
  ArrowUpRight, Users, Plus, Search, MapPin, 
  Briefcase, GraduationCap, Compass, Heart, Edit, 
  Trash2, Shield, Calendar, History, Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FriendGoingOut } from '../../types';
import { MultiPersonEntryModal } from '../modals/MultiPersonEntryModal';

export const FriendsGoingOutView: React.FC = () => {
  const { 
    friendsGoingOut, localities, addFriendGoingOut, updateFriendGoingOut, 
    deleteFriendGoingOut, userRole, formatContact, isSecurityUnlocked 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');

  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<FriendGoingOut | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    contact: '',
    previousLocalityId: localities[0]?.id || '',
    previousNeighborhood: '',
    newLocation: '',
    date: new Date().toISOString().split('T')[0],
    reason: 'Relocation' as FriendGoingOut['reason'],
    activitiesPreviouslyInvolved: 'Community Member, Weekly Devotionals',
    notes: ''
  });

  const filteredFriends = friendsGoingOut.filter(f => {
    const matchesSearch = 
      f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.newLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.previousLocalityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocality = selectedLocality === 'all' || f.previousLocalityId === selectedLocality;
    const matchesReason = reasonFilter === 'all' || f.reason === reasonFilter;

    return matchesSearch && matchesLocality && matchesReason;
  });

  // KPI Metrics
  const totalOutbound = friendsGoingOut.length;
  const pioneersCount = friendsGoingOut.filter(f => f.reason === 'Pioneer').length;
  const educationCount = friendsGoingOut.filter(f => f.reason === 'University/Education').length;
  const workCount = friendsGoingOut.filter(f => f.reason === 'Employment/Work').length;

  const handleOpenCreateSingle = () => {
    setEditingFriend(null);
    setFormData({
      fullName: '',
      age: '',
      contact: '',
      previousLocalityId: localities[0]?.id || '',
      previousNeighborhood: '',
      newLocation: '',
      date: new Date().toISOString().split('T')[0],
      reason: 'Relocation',
      activitiesPreviouslyInvolved: 'Junior Youth Animator, Study Circle Participant',
      notes: ''
    });
    setIsSingleModalOpen(true);
  };

  const handleOpenEdit = (f: FriendGoingOut) => {
    setEditingFriend(f);
    setFormData({
      fullName: f.fullName,
      age: f.age ? String(f.age) : '',
      contact: f.contact || '',
      previousLocalityId: f.previousLocalityId,
      previousNeighborhood: f.previousNeighborhood || '',
      newLocation: f.newLocation,
      date: f.date,
      reason: f.reason,
      activitiesPreviouslyInvolved: f.activitiesPreviouslyInvolved.join(', '),
      notes: f.notes || ''
    });
    setIsSingleModalOpen(true);
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = localities.find(l => l.id === formData.previousLocalityId) || localities[0];
    const locName = loc ? loc.name : 'Kimana Town';
    const acts = formData.activitiesPreviouslyInvolved.split(',').map(s => s.trim()).filter(Boolean);

    if (editingFriend) {
      updateFriendGoingOut(editingFriend.id, {
        fullName: formData.fullName,
        age: formData.age ? Number(formData.age) : undefined,
        contact: formData.contact,
        previousLocalityId: formData.previousLocalityId,
        previousLocalityName: locName,
        previousNeighborhood: formData.previousNeighborhood,
        newLocation: formData.newLocation,
        date: formData.date,
        reason: formData.reason,
        activitiesPreviouslyInvolved: acts,
        notes: formData.notes
      });
    } else {
      addFriendGoingOut({
        fullName: formData.fullName,
        age: formData.age ? Number(formData.age) : undefined,
        contact: formData.contact,
        previousLocalityId: formData.previousLocalityId,
        previousLocalityName: locName,
        previousNeighborhood: formData.previousNeighborhood,
        newLocation: formData.newLocation,
        date: formData.date,
        reason: formData.reason,
        activitiesPreviouslyInvolved: acts,
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
            <ArrowUpRight className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Friends Going Out
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Historical records of friends moving, pioneering, or studying outside Kimana (retaining their full history).
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMultiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              id="batch-add-outgoing-btn"
            >
              <Users className="w-4 h-4" />
              <span>Multi-Person Batch Entry</span>
            </button>
            <button
              onClick={handleOpenCreateSingle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              id="add-single-outgoing-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Record Outbound Friend</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Total Outbound</span>
            <History className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalOutbound}</div>
          <p className="text-[11px] text-slate-400 mt-1">Preserved historical moves</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Pioneering</span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{pioneersCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Teaching & pioneering service</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Higher Studies</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{educationCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">University & college</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">Work / Transfer</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{workCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Employment relocations</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, new location, former locality, or notes..."
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
              <option value="all">All Previous Localities</option>
              {localities.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Movement Reasons</option>
              <option value="Relocation">Relocation</option>
              <option value="Pioneer">Pioneer / Travel Service</option>
              <option value="University/Education">University / School</option>
              <option value="Employment/Work">Employment / Job</option>
              <option value="Marriage">Marriage</option>
              <option value="Family Reasons">Family Reasons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Friends Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Showing {filteredFriends.length} outbound friends</span>
          {!isSecurityUnlocked && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              Contacts Protected
            </span>
          )}
        </div>

        {filteredFriends.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
            <ArrowUpRight className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching outbound records found.
            </p>
            <p className="text-xs text-slate-400">
              Use "Record Outbound Friend" to preserve history when someone relocates or pioneers.
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
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Originated from: <strong>{friend.previousLocalityName}</strong></span>
                        {friend.previousNeighborhood && <span>({friend.previousNeighborhood})</span>}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      friend.reason === 'Pioneer'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : friend.reason === 'University/Education'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        : friend.reason === 'Employment/Work'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}>
                      {friend.reason}
                    </span>
                  </div>

                  <div className="bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-semibold">
                      <Compass className="w-4 h-4 text-amber-600" />
                      <span>New Destination: {friend.newLocation}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Date of Movement: {friend.date}
                    </p>
                  </div>

                  {friend.activitiesPreviouslyInvolved.length > 0 && (
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                        Historical Service in Kimana:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {friend.activitiesPreviouslyInvolved.map((act, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 pt-1">
                    <span>Contact: </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {formatContact(friend.contact)}
                    </span>
                  </div>

                  {friend.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{friend.notes}"
                    </p>
                  )}
                </div>

                {userRole !== 'Viewer' && (
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(friend)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit record"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteFriendGoingOut(friend.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
        defaultCategory="friendsgoingout"
      />

      {/* Single Outbound Record Modal */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingFriend ? 'Edit Outbound Record' : 'Record Friend Moving Outside Kimana'}
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Former Locality</label>
                  <select
                    value={formData.previousLocalityId}
                    onChange={(e) => setFormData({ ...formData, previousLocalityId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    {localities.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Former Neighborhood</label>
                  <input
                    type="text"
                    value={formData.previousNeighborhood}
                    onChange={(e) => setFormData({ ...formData, previousNeighborhood: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Destination Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi Cluster (Westlands), Loitokitok, Abroad"
                    value={formData.newLocation}
                    onChange={(e) => setFormData({ ...formData, newLocation: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Move</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Relocation">Relocation</option>
                    <option value="Pioneer">Pioneer / Travel Teaching</option>
                    <option value="University/Education">University / School</option>
                    <option value="Employment/Work">Employment / Work</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Family Reasons">Family Reasons</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Activities Previously Involved In (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.activitiesPreviouslyInvolved}
                    onChange={(e) => setFormData({ ...formData, activitiesPreviouslyInvolved: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
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
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md"
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
