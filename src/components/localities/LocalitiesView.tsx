import React, { useState } from 'react';
import { 
  MapPin, Plus, Edit, Trash2, Users, BookOpen, 
  Sparkles, GraduationCap, HeartHandshake, Home, CheckCircle, Search 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Locality } from '../../types';

export const LocalitiesView: React.FC = () => {
  const { localities, addLocality, updateLocality, deleteLocality, userRole, loadKimanaLocalities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocality, setEditingLocality] = useState<Locality | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: '',
    notes: ''
  });

  const filteredLocalities = localities.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.humanResources.some(hr => hr.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingLocality(null);
    setFormData({
      name: '',
      bahaiCount: 0,
      householdsCount: 0,
      childrenClassesCount: 0,
      juniorYouthGroupsCount: 0,
      studyCirclesCount: 0,
      devotionalMeetingsCount: 0,
      humanResources: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: Locality) => {
    setEditingLocality(loc);
    setFormData({
      name: loc.name,
      bahaiCount: loc.bahaiCount,
      householdsCount: loc.householdsCount,
      childrenClassesCount: loc.childrenClassesCount,
      juniorYouthGroupsCount: loc.juniorYouthGroupsCount,
      studyCirclesCount: loc.studyCirclesCount,
      devotionalMeetingsCount: loc.devotionalMeetingsCount,
      humanResources: loc.humanResources.join(', '),
      notes: loc.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hrArray = formData.humanResources.split(',').map(s => s.trim()).filter(Boolean);

    if (editingLocality) {
      updateLocality(editingLocality.id, {
        name: formData.name,
        bahaiCount: Number(formData.bahaiCount),
        householdsCount: Number(formData.householdsCount),
        childrenClassesCount: Number(formData.childrenClassesCount),
        juniorYouthGroupsCount: Number(formData.juniorYouthGroupsCount),
        studyCirclesCount: Number(formData.studyCirclesCount),
        devotionalMeetingsCount: Number(formData.devotionalMeetingsCount),
        humanResources: hrArray,
        notes: formData.notes
      });
    } else {
      addLocality({
        name: formData.name,
        bahaiCount: Number(formData.bahaiCount),
        householdsCount: Number(formData.householdsCount),
        childrenClassesCount: Number(formData.childrenClassesCount),
        juniorYouthGroupsCount: Number(formData.juniorYouthGroupsCount),
        studyCirclesCount: Number(formData.studyCirclesCount),
        devotionalMeetingsCount: Number(formData.devotionalMeetingsCount),
        humanResources: hrArray,
        growthHistory: [{ year: 2026, month: 'Aug', count: Number(formData.bahaiCount) }],
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
            <MapPin className="w-6 h-6 text-emerald-600" />
            Localities & Communities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Profiles, population, and active human resources across Kimana Cluster.
          </p>
        </div>

        {userRole !== 'Viewer' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
            id="add-locality-button"
          >
            <Plus className="w-4 h-4" />
            Add Locality
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search localities or serving friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          id="search-localities-input"
        />
      </div>

      {/* Grid of Localities */}
      {filteredLocalities.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchTerm ? 'No matching localities found' : 'No Localities Registered'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {searchTerm
                ? 'Try adjusting your search keyword.'
                : 'All test data has been removed. You can create a new custom locality or initialize the official Kimana Cluster localities with zero data.'}
            </p>
          </div>
          {!searchTerm && userRole !== 'Viewer' && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Locality
              </button>
              <button
                onClick={loadKimanaLocalities}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
              >
                Initialize Kimana Cluster Localities (Clean)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocalities.map((loc) => (
            <div
              key={loc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              id={`locality-card-${loc.id}`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{loc.name}</h3>
                      <p className="text-xs text-slate-500">Kimana Cluster</p>
                    </div>
                  </div>

                  {userRole !== 'Viewer' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(loc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Locality"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {userRole === 'Administrator' && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${loc.name}?`)) {
                              deleteLocality(loc.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Locality"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 font-medium">Bahá'í Population</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{loc.bahaiCount} friends</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 font-medium">Households</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{loc.householdsCount} families</p>
                  </div>
                </div>

                {/* Activities Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Children's Classes</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loc.childrenClassesCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Junior Youth Groups</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loc.juniorYouthGroupsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-blue-500" /> Study Circles</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loc.studyCirclesCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="flex items-center gap-1.5"><HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Devotional Meetings</span>
                    <span className="font-bold text-slate-900 dark:text-white">{loc.devotionalMeetingsCount}</span>
                  </div>
                </div>

                {/* Serving Friends */}
                {loc.humanResources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Serving Friends:
                    </span>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                      {loc.humanResources.join(' • ')}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedLocality(loc)}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
              >
                View Locality Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingLocality ? 'Edit Locality Profile' : 'Add New Locality'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Locality Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rombo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Bahá'í Count</label>
                  <input
                    type="number"
                    value={formData.bahaiCount}
                    onChange={e => setFormData({ ...formData, bahaiCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Households</label>
                  <input
                    type="number"
                    value={formData.householdsCount}
                    onChange={e => setFormData({ ...formData, householdsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Children Classes</label>
                  <input
                    type="number"
                    value={formData.childrenClassesCount}
                    onChange={e => setFormData({ ...formData, childrenClassesCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">JY Groups</label>
                  <input
                    type="number"
                    value={formData.juniorYouthGroupsCount}
                    onChange={e => setFormData({ ...formData, juniorYouthGroupsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Study Circles</label>
                  <input
                    type="number"
                    value={formData.studyCirclesCount}
                    onChange={e => setFormData({ ...formData, studyCirclesCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Devotional Meetings</label>
                  <input
                    type="number"
                    value={formData.devotionalMeetingsCount}
                    onChange={e => setFormData({ ...formData, devotionalMeetingsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Serving Friends (Comma separated)</label>
                <input
                  type="text"
                  value={formData.humanResources}
                  onChange={e => setFormData({ ...formData, humanResources: e.target.value })}
                  placeholder="e.g. Local teachers, animators, tutors"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
                  Save Locality
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locality Profile Detail Modal */}
      {selectedLocality && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLocality.name} Profile</h2>
                <p className="text-xs text-slate-500">Kimana Cluster Locality Summary</p>
              </div>
              <button
                onClick={() => setSelectedLocality(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Bahá'ís</span>
                  <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">{selectedLocality.bahaiCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">Households</span>
                  <p className="text-lg font-extrabold text-blue-900 dark:text-blue-200">{selectedLocality.householdsCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">CC & JY</span>
                  <p className="text-lg font-extrabold text-amber-900 dark:text-amber-200">{selectedLocality.childrenClassesCount + selectedLocality.juniorYouthGroupsCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">SC & Devotionals</span>
                  <p className="text-lg font-extrabold text-purple-900 dark:text-purple-200">{selectedLocality.studyCirclesCount + selectedLocality.devotionalMeetingsCount}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Human Resources Serving Here:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLocality.humanResources.map((hr, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {hr}
                    </span>
                  ))}
                </div>
              </div>

              {selectedLocality.notes && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Notes & Context:</h4>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                    {selectedLocality.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
