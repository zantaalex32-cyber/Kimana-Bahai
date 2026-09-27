import React, { useState } from 'react';
import { 
  RotateCw, Plus, Edit, Calendar, CheckCircle2, 
  Target, BookOpen, Sparkles, GraduationCap, HeartHandshake, UserPlus, FileText 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Cycle } from '../../types';

export const CyclesView: React.FC = () => {
  const { cycles, addCycle, updateCycle, currentCycleId, setCurrentCycleId, userRole } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    goals: {
      studyCirclesGoal: 5,
      childrenClassesGoal: 4,
      juniorYouthGroupsGoal: 4,
      devotionalsGoal: 8,
      newBahaisGoal: 10
    },
    reflectionDate: '',
    reflectionNotes: '',
    status: 'Active' as 'Planning' | 'Active' | 'Completed'
  });

  const handleOpenCreate = () => {
    setEditingCycle(null);
    setFormData({
      name: `Cycle ${cycles.length + 1} - ${new Date().getFullYear()}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCurrent: false,
      goals: {
        studyCirclesGoal: 6,
        childrenClassesGoal: 5,
        juniorYouthGroupsGoal: 4,
        devotionalsGoal: 10,
        newBahaisGoal: 12
      },
      reflectionDate: '',
      reflectionNotes: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cycle: Cycle) => {
    setEditingCycle(cycle);
    setFormData({
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      isCurrent: cycle.isCurrent,
      goals: { ...cycle.goals },
      reflectionDate: cycle.reflectionDate || '',
      reflectionNotes: cycle.reflectionNotes || '',
      status: cycle.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCycle) {
      updateCycle(editingCycle.id, formData);
    } else {
      addCycle(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Growth Cycles & Reflection Meetings</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage four-month expansion & consolidation cycles, goals, and reflection meeting outcomes for Kimana Cluster.
          </p>
        </div>

        {(userRole === 'Cluster Coordinator' || userRole === 'Administrator') && (
          <button
            onClick={handleOpenCreate}
            id="add-cycle-button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Cycle</span>
          </button>
        )}
      </div>

      {/* Cycle List */}
      <div className="space-y-4">
        {cycles.map((cycle) => {
          const isSelected = cycle.id === currentCycleId;

          return (
            <div
              key={cycle.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm ${
                cycle.isCurrent 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{cycle.name}</h2>
                    {cycle.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Current Active Cycle
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cycle.status === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      cycle.status === 'Completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {cycle.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {cycle.startDate} to {cycle.endDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!cycle.isCurrent && (
                    <button
                      onClick={() => setCurrentCycleId(cycle.id)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-xl text-xs font-semibold transition"
                    >
                      Set Active
                    </button>
                  )}

                  {(userRole === 'Cluster Coordinator' || userRole === 'Administrator') && (
                    <button
                      onClick={() => handleOpenEdit(cycle)}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Cycle Goals"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cycle Goals Grid */}
              <div className="pt-4 space-y-4">
                <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Target Goals Established for this Cycle
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <BookOpen className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">{cycle.goals.studyCirclesGoal}</span>
                    <span className="text-[11px] text-slate-500">Study Circles</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">{cycle.goals.childrenClassesGoal}</span>
                    <span className="text-[11px] text-slate-500">Children's Classes</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <GraduationCap className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">{cycle.goals.juniorYouthGroupsGoal}</span>
                    <span className="text-[11px] text-slate-500">Junior Youth Groups</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <HeartHandshake className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">{cycle.goals.devotionalsGoal}</span>
                    <span className="text-[11px] text-slate-500">Devotionals</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                    <UserPlus className="w-4 h-4 text-pink-500 mx-auto mb-1" />
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">{cycle.goals.newBahaisGoal}</span>
                    <span className="text-[11px] text-slate-500">New Declarations</span>
                  </div>
                </div>

                {cycle.reflectionNotes && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      <span>Reflection Meeting Notes ({cycle.reflectionDate})</span>
                    </div>
                    <p className="whitespace-pre-wrap">{cycle.reflectionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingCycle ? 'Edit Cycle Goals' : 'Create New Expansion Cycle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Cycle Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cycle 15 - Q4 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
                <span className="block text-xs font-bold uppercase text-slate-500">Target Goals</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500">Study Circles Goal</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.goals.studyCirclesGoal}
                      onChange={(e) => setFormData({
                        ...formData,
                        goals: { ...formData.goals, studyCirclesGoal: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500">Children's Classes Goal</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.goals.childrenClassesGoal}
                      onChange={(e) => setFormData({
                        ...formData,
                        goals: { ...formData.goals, childrenClassesGoal: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500">JY Groups Goal</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.goals.juniorYouthGroupsGoal}
                      onChange={(e) => setFormData({
                        ...formData,
                        goals: { ...formData.goals, juniorYouthGroupsGoal: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500">Devotionals Goal</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.goals.devotionalsGoal}
                      onChange={(e) => setFormData({
                        ...formData,
                        goals: { ...formData.goals, devotionalsGoal: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500">New Declarations Goal</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.goals.newBahaisGoal}
                    onChange={(e) => setFormData({
                      ...formData,
                      goals: { ...formData.goals, newBahaisGoal: Number(e.target.value) }
                    })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reflection Meeting Notes & Consultations</label>
                <textarea
                  rows={3}
                  placeholder="Summary of consultation, achievements, challenges..."
                  value={formData.reflectionNotes}
                  onChange={(e) => setFormData({ ...formData, reflectionNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
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
                  {editingCycle ? 'Save Cycle' : 'Create Cycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
