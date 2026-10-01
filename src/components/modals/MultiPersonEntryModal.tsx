import React, { useState } from 'react';
import { 
  X, UserPlus, Trash2, Plus, Users, Sparkles, GraduationCap, 
  BookOpen, ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle,
  HelpCircle, Copy, FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type EntryCategory = 
  | 'children'
  | 'junioryouth'
  | 'studycircles'
  | 'friendscomingin'
  | 'friendsgoingout'
  | 'people';

interface MultiPersonEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: EntryCategory;
  targetGroupId?: string;
  targetGroupName?: string;
}

interface StagedPerson {
  tempId: string;
  fullName: string;
  age?: number | '';
  gender?: 'Female' | 'Male' | 'Other' | '';
  contact?: string;
  parentName?: string;
  parentContact?: string;
  localityId?: string;
  neighborhood?: string;
  // Specific fields
  classOrGrade?: string;
  bookOrCourse?: string;
  groupName?: string;
  date?: string;
  howReached?: string;
  introducedBy?: string;
  newLocation?: string;
  reason?: 'Relocation' | 'Pioneer' | 'University/Education' | 'Employment/Work' | 'Marriage' | 'Family Reasons' | 'Other';
  activitiesInvolved?: string[];
  status?: string;
  notes?: string;
}

export const MultiPersonEntryModal: React.FC<MultiPersonEntryModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'children',
  targetGroupId,
  targetGroupName
}) => {
  const { 
    localities, childrenClasses, juniorYouthGroups, studyCircles,
    batchAddFriendsComingIn, batchAddFriendsGoingOut, batchAddPeople,
    batchAddParticipantsToGroup, userRole
  } = useApp();

  const [category, setCategory] = useState<EntryCategory>(defaultCategory);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(targetGroupId || '');
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>(localities[0]?.id || '');
  
  // Staged people queue
  const [stagedPeople, setStagedPeople] = useState<StagedPerson[]>([]);
  
  // Form fields for currently edited person
  const [currentPerson, setCurrentPerson] = useState<StagedPerson>({
    tempId: 'temp-1',
    fullName: '',
    age: '',
    gender: 'Female',
    contact: '',
    parentName: '',
    parentContact: '',
    neighborhood: '',
    classOrGrade: 'Grade 1 (Ages 5-7)',
    bookOrCourse: 'Ruhi Book 1 - Reflection on the Life of the Spirit',
    groupName: '',
    date: new Date().toISOString().split('T')[0],
    howReached: 'Home Visit',
    introducedBy: '',
    newLocation: 'Nairobi Cluster',
    reason: 'Relocation',
    status: 'Active',
    notes: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [quickPasteOpen, setQuickPasteOpen] = useState(false);
  const [quickPasteText, setQuickPasteText] = useState('');

  if (!isOpen) return null;

  const currentLocality = localities.find(l => l.id === selectedLocalityId) || localities[0];

  const handleAddAnotherPerson = () => {
    if (!currentPerson.fullName.trim()) {
      setValidationError('Please enter a full name for this person.');
      return;
    }

    setValidationError(null);
    const newPerson: StagedPerson = {
      ...currentPerson,
      tempId: 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      localityId: selectedLocalityId
    };

    setStagedPeople(prev => [...prev, newPerson]);

    // Reset current form for the next person, retaining default locality/group/date
    setCurrentPerson(prev => ({
      tempId: 'temp-' + Date.now(),
      fullName: '',
      age: '',
      gender: prev.gender || 'Female',
      contact: '',
      parentName: '',
      parentContact: '',
      neighborhood: prev.neighborhood || '',
      classOrGrade: prev.classOrGrade,
      bookOrCourse: prev.bookOrCourse,
      groupName: prev.groupName,
      date: prev.date,
      howReached: prev.howReached,
      introducedBy: prev.introducedBy,
      newLocation: prev.newLocation,
      reason: prev.reason,
      status: prev.status,
      notes: ''
    }));
  };

  const handleRemoveStaged = (tempId: string) => {
    setStagedPeople(prev => prev.filter(p => p.tempId !== tempId));
  };

  const handleQuickPaste = () => {
    if (!quickPasteText.trim()) return;
    const lines = quickPasteText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: StagedPerson[] = lines.map((line, idx) => {
      // Split by comma if available: Name, Age, Contact
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0] || '';
      const age = parts[1] && !isNaN(Number(parts[1])) ? Number(parts[1]) : '';
      const contact = parts[2] || '';
      return {
        tempId: 'paste-' + Date.now() + '-' + idx,
        fullName: name,
        age: age,
        gender: 'Female',
        contact: contact,
        parentName: '',
        parentContact: '',
        localityId: selectedLocalityId,
        neighborhood: '',
        classOrGrade: 'Grade 1 (Ages 5-7)',
        bookOrCourse: 'Ruhi Book 1',
        date: new Date().toISOString().split('T')[0],
        howReached: 'Home Visit',
        introducedBy: '',
        newLocation: '',
        reason: 'Relocation',
        status: 'Active',
        notes: 'Bulk imported entry'
      };
    }).filter(p => p.fullName.length > 0);

    setStagedPeople(prev => [...prev, ...parsed]);
    setQuickPasteText('');
    setQuickPasteOpen(false);
  };

  const handleSaveAll = () => {
    // If user filled in the single form and forgot to click "Add Person", prompt or include them
    let queue = [...stagedPeople];
    if (currentPerson.fullName.trim()) {
      queue.push({
        ...currentPerson,
        tempId: 'temp-final',
        localityId: selectedLocalityId
      });
    }

    if (queue.length === 0) {
      setValidationError('Please add at least one person before saving.');
      return;
    }

    const locName = currentLocality?.name || 'Kimana Town';

    if (category === 'children') {
      const names = queue.map(p => p.fullName);
      if (selectedGroupId) {
        batchAddParticipantsToGroup('children', selectedGroupId, names);
      }
      // Also register in People collection
      batchAddPeople(queue.map(p => ({
        name: p.fullName,
        localityId: selectedLocalityId,
        localityName: locName,
        phone: p.contact || p.parentContact || '',
        role: 'Participant',
        status: 'Active',
        activitiesServed: ["Children's Classes"],
        groupsServed: [selectedGroupId ? (childrenClasses.find(c => c.id === selectedGroupId)?.className || "Children's Class") : "Children's Class"],
        notes: `Age: ${p.age || 'N/A'}. Parent: ${p.parentName || 'N/A'} (${p.parentContact || 'N/A'}). ${p.notes || ''}`,
        dateAdded: p.date || new Date().toISOString().split('T')[0]
      })));
    } else if (category === 'junioryouth') {
      const names = queue.map(p => p.fullName);
      if (selectedGroupId) {
        batchAddParticipantsToGroup('junioryouth', selectedGroupId, names);
      }
      batchAddPeople(queue.map(p => ({
        name: p.fullName,
        localityId: selectedLocalityId,
        localityName: locName,
        phone: p.contact || p.parentContact || '',
        role: 'Participant',
        status: 'Active',
        activitiesServed: ['Junior Youth Program'],
        groupsServed: [selectedGroupId ? (juniorYouthGroups.find(j => j.id === selectedGroupId)?.groupName || 'Junior Youth') : 'Junior Youth Group'],
        notes: `Age: ${p.age || 'N/A'}. Parent: ${p.parentName || 'N/A'}. ${p.notes || ''}`,
        dateAdded: p.date || new Date().toISOString().split('T')[0]
      })));
    } else if (category === 'studycircles') {
      const names = queue.map(p => p.fullName);
      if (selectedGroupId) {
        batchAddParticipantsToGroup('studycircles', selectedGroupId, names);
      }
      batchAddPeople(queue.map(p => ({
        name: p.fullName,
        localityId: selectedLocalityId,
        localityName: locName,
        phone: p.contact || '',
        role: 'Participant',
        status: 'Active',
        activitiesServed: ['Study Circles'],
        groupsServed: [selectedGroupId ? (studyCircles.find(s => s.id === selectedGroupId)?.groupName || 'Study Circle') : 'Study Circle'],
        notes: `Course: ${p.bookOrCourse || 'Ruhi Institute'}. Age: ${p.age || 'N/A'}. ${p.notes || ''}`,
        dateAdded: p.date || new Date().toISOString().split('T')[0]
      })));
    } else if (category === 'friendscomingin') {
      batchAddFriendsComingIn(queue.map(p => ({
        fullName: p.fullName,
        age: p.age ? Number(p.age) : undefined,
        gender: (p.gender as any) || 'Female',
        contact: p.contact || '',
        localityId: selectedLocalityId,
        localityName: locName,
        neighborhood: p.neighborhood || '',
        date: p.date || new Date().toISOString().split('T')[0],
        howReached: p.howReached || 'Home Visit',
        introducedBy: p.introducedBy || 'Community Friends',
        activitiesParticipating: p.status === 'Enrolled in Ruhi B1' ? ['Ruhi Book 1 Study Circle'] : ['Weekly Devotionals'],
        currentStatus: (p.status as any) || 'Needs Initial Visit',
        notes: p.notes || ''
      })));
      // Also register in People
      batchAddPeople(queue.map(p => ({
        name: p.fullName,
        localityId: selectedLocalityId,
        localityName: locName,
        phone: p.contact || '',
        role: 'Participant',
        status: 'Active',
        activitiesServed: ['Community Friends'],
        groupsServed: [],
        notes: `Reached via ${p.howReached || 'Home Visit'}. Introduced by: ${p.introducedBy || 'Friends'}. ${p.notes || ''}`,
        dateAdded: p.date || new Date().toISOString().split('T')[0]
      })));
    } else if (category === 'friendsgoingout') {
      batchAddFriendsGoingOut(queue.map(p => ({
        fullName: p.fullName,
        age: p.age ? Number(p.age) : undefined,
        contact: p.contact || '',
        previousLocalityId: selectedLocalityId,
        previousLocalityName: locName,
        previousNeighborhood: p.neighborhood || '',
        newLocation: p.newLocation || 'Nairobi Cluster',
        date: p.date || new Date().toISOString().split('T')[0],
        reason: (p.reason as any) || 'Relocation',
        activitiesPreviouslyInvolved: p.status ? [p.status] : ['Community Participant'],
        notes: p.notes || ''
      })));
    } else {
      batchAddPeople(queue.map(p => ({
        name: p.fullName,
        localityId: selectedLocalityId,
        localityName: locName,
        phone: p.contact || '',
        role: 'Participant',
        status: 'Active',
        activitiesServed: ['Community Activities'],
        groupsServed: [],
        notes: p.notes || '',
        dateAdded: p.date || new Date().toISOString().split('T')[0]
      })));
    }

    setSuccessMessage(`Successfully saved ${queue.length} people!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Multi-Person Batch Data Entry
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium">
                  {stagedPeople.length} Added in Queue
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter multiple participants or friends at once without navigating away.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-2">
          {[
            { id: 'children', label: "Children's Class", icon: Sparkles },
            { id: 'junioryouth', label: 'Junior Youth', icon: GraduationCap },
            { id: 'studycircles', label: 'Study Circle', icon: BookOpen },
            { id: 'friendscomingin', label: 'Friends Coming In', icon: ArrowDownRight },
            { id: 'friendsgoingout', label: 'Friends Going Out', icon: ArrowUpRight },
            { id: 'people', label: 'Community Participants', icon: Users },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id as EntryCategory);
                  setValidationError(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Context Selectors (Locality & Target Group) */}
        <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Locality / Neighborhood:
            </label>
            <select
              value={selectedLocalityId}
              onChange={(e) => setSelectedLocalityId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {localities.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.bahaiCount} Bahá’ís)
                </option>
              ))}
            </select>
          </div>

          {(category === 'children' || category === 'junioryouth' || category === 'studycircles') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Group / Roster (Optional):
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">General Locality Roster (New Group)</option>
                {category === 'children' && childrenClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.className} - {c.teacherName} ({c.localityName})
                  </option>
                ))}
                {category === 'junioryouth' && juniorYouthGroups.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.groupName} - {j.animatorName} ({j.localityName})
                  </option>
                ))}
                {category === 'studycircles' && studyCircles.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.groupName} - {s.tutorName} ({s.bookMaterial})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Person Input Card (Dynamic per category) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enter Person Details</span>
                <span className="text-xs font-normal text-slate-400">
                  (Category: {category === 'children' ? "Children's Class" : category === 'junioryouth' ? 'Junior Youth' : category === 'studycircles' ? 'Study Circle' : category === 'friendscomingin' ? 'Friends Coming In' : category === 'friendsgoingout' ? 'Friends Going Out' : 'Community'})
                </span>
              </h3>

              <button
                type="button"
                onClick={() => setQuickPasteOpen(!quickPasteOpen)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {quickPasteOpen ? 'Hide Bulk Paste' : 'Bulk Paste Names'}
              </button>
            </div>

            {quickPasteOpen && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paste multiple names below (one per line, or formatted as <code>Name, Age, Contact</code>):
                </p>
                <textarea
                  rows={3}
                  value={quickPasteText}
                  onChange={(e) => setQuickPasteText(e.target.value)}
                  placeholder="Faith Naiputari, 9, 0712345678&#10;Kevin Mwangi, 10&#10;Joy Sian, 8"
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleQuickPaste}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                  >
                    Import Lines into Queue
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Full Name (All) */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joy Naserian"
                  value={currentPerson.fullName}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Age (All) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="e.g. 9"
                  value={currentPerson.age || ''}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, age: e.target.value ? Number(e.target.value) : '' })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Gender (Where applicable) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={currentPerson.gender || 'Female'}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, gender: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Children specific fields */}
              {category === 'children' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mama Sian"
                      value={currentPerson.parentName || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, parentName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent / Guardian Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345678"
                      value={currentPerson.parentContact || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, parentContact: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Class / Grade Level
                    </label>
                    <select
                      value={currentPerson.classOrGrade || 'Grade 1 (Ages 5-7)'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, classOrGrade: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Grade 1 (Ages 5-7)">Grade 1 (Ages 5-7)</option>
                      <option value="Grade 2 (Ages 8-10)">Grade 2 (Ages 8-10)</option>
                      <option value="Grade 3 (Ages 10-11)">Grade 3 (Ages 10-11)</option>
                      <option value="Pre-School">Pre-School</option>
                    </select>
                  </div>
                </>
              )}

              {/* Junior Youth specific fields */}
              {category === 'junioryouth' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ole Naiputari"
                      value={currentPerson.parentName || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, parentName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact (Phone)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +254 722 000111"
                      value={currentPerson.contact || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, contact: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Participation Status
                    </label>
                    <select
                      value={currentPerson.status || 'Active'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, status: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Active">Active</option>
                      <option value="New">New</option>
                      <option value="Returning">Returning</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* Study Circle Members specific fields */}
              {category === 'studycircles' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Information (Phone)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345678"
                      value={currentPerson.contact || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, contact: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Book / Course Material
                    </label>
                    <select
                      value={currentPerson.bookOrCourse || 'Ruhi Book 1'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, bookOrCourse: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Ruhi Book 1 - Reflections on the Life of the Spirit">Ruhi Book 1</option>
                      <option value="Ruhi Book 2 - Arising to Serve">Ruhi Book 2</option>
                      <option value="Ruhi Book 3 - Teaching Children's Classes, Grade 1">Ruhi Book 3</option>
                      <option value="Ruhi Book 4 - The Twin Manifestations">Ruhi Book 4</option>
                      <option value="Ruhi Book 5 - Releasing the Powers of Junior Youth">Ruhi Book 5</option>
                      <option value="Ruhi Book 6 - Teaching the Cause">Ruhi Book 6</option>
                      <option value="Ruhi Book 7 - Walking Together on a Path of Service">Ruhi Book 7</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Neighborhood
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Isinet Primary Area"
                      value={currentPerson.neighborhood || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, neighborhood: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* Friends Coming In specific fields */}
              {category === 'friendscomingin' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Information (Phone)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +254 733 445566"
                      value={currentPerson.contact || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, contact: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      How They Were Reached
                    </label>
                    <select
                      value={currentPerson.howReached || 'Home Visit'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, howReached: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Home Visit">Home Visit</option>
                      <option value="Teaching Campaign">Teaching Campaign</option>
                      <option value="Family/Friend Introduction">Family / Friend Introduction</option>
                      <option value="Devotional Meeting">Devotional Meeting</option>
                      <option value="Youth Activity">Youth / Junior Youth Activity</option>
                      <option value="Community Conversation">Community Conversation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Introduced By (Person / Family)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grace Sian or Ole Naiputari"
                      value={currentPerson.introducedBy || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, introducedBy: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Integration Status
                    </label>
                    <select
                      value={currentPerson.status || 'Needs Initial Visit'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, status: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Needs Initial Visit">Needs Initial Visit</option>
                      <option value="Enrolled in Ruhi B1">Enrolled in Ruhi B1</option>
                      <option value="Attending Devotionals">Attending Devotionals</option>
                      <option value="Children Class Parent">Children Class Parent</option>
                      <option value="Well Integrated">Well Integrated</option>
                    </select>
                  </div>
                </>
              )}

              {/* Friends Going Out specific fields */}
              {category === 'friendsgoingout' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Information (Phone)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345678"
                      value={currentPerson.contact || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, contact: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Destination Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nairobi Cluster / Loitokitok"
                      value={currentPerson.newLocation || ''}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, newLocation: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reason for Movement
                    </label>
                    <select
                      value={currentPerson.reason || 'Relocation'}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, reason: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Relocation">Relocation</option>
                      <option value="Pioneer">Pioneer / Travel Teaching</option>
                      <option value="University/Education">University / School</option>
                      <option value="Employment/Work">Employment / Job Transfer</option>
                      <option value="Marriage">Marriage</option>
                      <option value="Family Reasons">Family Reasons</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* General participants contact */}
              {category === 'people' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +254 712 345678"
                    value={currentPerson.contact || ''}
                    onChange={(e) => setCurrentPerson({ ...currentPerson, contact: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Notes (All) */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes
                </label>
                <input
                  type="text"
                  placeholder="Additional pastoral notes or details..."
                  value={currentPerson.notes || ''}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons to Add to Queue */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Click <strong>"Add Another Person"</strong> to add more people to the queue.
              </span>
              <button
                type="button"
                onClick={handleAddAnotherPerson}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Person to Queue</span>
              </button>
            </div>
          </div>

          {/* Staged Review Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Review Staged People in this Batch ({stagedPeople.length})</span>
              </h3>
              {stagedPeople.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStagedPeople([])}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear Queue
                </button>
              )}
            </div>

            {stagedPeople.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                No people in the queue yet. Fill the form above and click "Add Person to Queue" or use "Bulk Paste Names".
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Age</th>
                        <th className="py-2.5 px-3">Contact / Parent</th>
                        <th className="py-2.5 px-3">Key Details</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stagedPeople.map((person, index) => (
                        <tr key={person.tempId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-slate-400 font-mono">{index + 1}</td>
                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                            {person.fullName}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                            {person.age || '—'}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                            {person.contact || person.parentContact || person.parentName || '—'}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                            {category === 'children' && (person.classOrGrade || 'Grade 1')}
                            {category === 'junioryouth' && (person.status || 'Active')}
                            {category === 'studycircles' && (person.bookOrCourse || 'Ruhi Book 1')}
                            {category === 'friendscomingin' && `${person.howReached} • ${person.status}`}
                            {category === 'friendsgoingout' && `To: ${person.newLocation} (${person.reason})`}
                            {category === 'people' && (person.notes || 'Community Member')}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveStaged(person.tempId)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total to save: <strong className="text-slate-900 dark:text-white font-bold">{stagedPeople.length + (currentPerson.fullName.trim() ? 1 : 0)}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Entire Group</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
