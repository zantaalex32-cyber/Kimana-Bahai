import React, { useState, useEffect } from 'react';
import { 
  Search, X, Users, MapPin, CalendarCheck, BookOpen, 
  Sparkles, GraduationCap, HeartHandshake, Home, UserPlus, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, 
    people, localities, activities, studyCircles, 
    childrenClasses, juniorYouthGroups, devotionals, homeVisits, 
    newBahais, setActiveTab 
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  // Search Results Categorized
  const matchingPeople = query ? people.filter(p => p.name.toLowerCase().includes(query) || p.localityName.toLowerCase().includes(query) || p.role.toLowerCase().includes(query)) : [];
  const matchingLocalities = query ? localities.filter(l => l.name.toLowerCase().includes(query)) : [];
  const matchingActivities = query ? activities.filter(a => a.title.toLowerCase().includes(query) || a.localityName.toLowerCase().includes(query) || a.type.toLowerCase().includes(query)) : [];
  const matchingStudyCircles = query ? studyCircles.filter(s => s.groupName.toLowerCase().includes(query) || s.bookMaterial.toLowerCase().includes(query) || s.tutorName.toLowerCase().includes(query)) : [];
  const matchingChildrenClasses = query ? childrenClasses.filter(c => c.className.toLowerCase().includes(query) || c.teacherName.toLowerCase().includes(query)) : [];
  const matchingJY = query ? juniorYouthGroups.filter(j => j.groupName.toLowerCase().includes(query) || j.animatorName.toLowerCase().includes(query)) : [];
  const matchingDevotionals = query ? devotionals.filter(d => d.title.toLowerCase().includes(query) || d.hostName.toLowerCase().includes(query)) : [];
  const matchingHomeVisits = query ? homeVisits.filter(h => h.familyOrPersonVisited.toLowerCase().includes(query) || h.localityName.toLowerCase().includes(query)) : [];
  const matchingNewBahais = query ? newBahais.filter(n => n.name.toLowerCase().includes(query) || n.localityName.toLowerCase().includes(query)) : [];

  const totalResults = matchingPeople.length + matchingLocalities.length + matchingActivities.length + 
                       matchingStudyCircles.length + matchingChildrenClasses.length + matchingJY.length + 
                       matchingDevotionals.length + matchingHomeVisits.length + matchingNewBahais.length;

  const handleSelectResult = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search Kimana Cluster (e.g. John, Rombo, Ruhi, Children's Class)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            id="global-search-input"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            id="global-search-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              Type to search across all community records, activities, and localities in Kimana.
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching records found for "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Localities */}
              {matchingLocalities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Localities ({matchingLocalities.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingLocalities.map(loc => (
                      <div
                        key={loc.id}
                        onClick={() => handleSelectResult('localities')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm transition"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{loc.name}</span>
                        <span className="text-xs text-slate-500">{loc.bahaiCount} Bahá'ís</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {matchingPeople.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> People / Roster ({matchingPeople.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingPeople.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectResult('people')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
                          <span className="ml-2 text-xs text-slate-500">({p.localityName})</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Circles */}
              {matchingStudyCircles.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Study Circles ({matchingStudyCircles.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingStudyCircles.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectResult('studycircles')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{s.groupName}</span>
                          <span className="ml-2 text-xs text-slate-500">({s.bookMaterial})</span>
                        </div>
                        <span className="text-xs text-slate-500">Tutor: {s.tutorName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {matchingActivities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-purple-500" /> Activities ({matchingActivities.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingActivities.map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectResult('activities')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{a.title}</span>
                          <span className="ml-2 text-xs text-slate-500">({a.localityName})</span>
                        </div>
                        <span className="text-xs text-slate-500">{a.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Bahais */}
              {matchingNewBahais.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-pink-500" /> New Bahá'ís ({matchingNewBahais.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingNewBahais.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleSelectResult('newbahais')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm transition"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{n.name} ({n.localityName})</span>
                        <span className="text-xs text-emerald-600 font-medium">{n.followUpStatus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Press <kbd className="font-mono bg-white dark:bg-slate-900 border px-1 rounded">ESC</kbd> to exit search</span>
          <span>{totalResults} results</span>
        </div>

      </div>
    </div>
  );
};
