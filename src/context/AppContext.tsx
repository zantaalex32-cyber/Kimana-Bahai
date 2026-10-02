import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Locality, Person, Activity, StudyCircle, ChildrenClass, 
  JuniorYouthGroup, DevotionalMeeting, HomeVisit, ServiceVisit, 
  NewBahai, FollowUpItem, Cycle, AuditLog, UserRole, NavigationTab 
} from '../types';
import { StorageService } from '../services/storage';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  currentCycleId: string;
  setCurrentCycleId: (id: string) => void;
  dateFilter: 'all' | 'today' | 'week' | 'month' | 'cycle';
  setDateFilter: (df: 'all' | 'today' | 'week' | 'month' | 'cycle') => void;
  selectedLocalityFilter: string;
  setSelectedLocalityFilter: (locId: string) => void;

  // Data
  localities: Locality[];
  people: Person[];
  activities: Activity[];
  studyCircles: StudyCircle[];
  childrenClasses: ChildrenClass[];
  juniorYouthGroups: JuniorYouthGroup[];
  devotionals: DevotionalMeeting[];
  homeVisits: HomeVisit[];
  serviceVisits: ServiceVisit[];
  newBahais: NewBahai[];
  followUps: FollowUpItem[];
  cycles: Cycle[];
  auditLogs: AuditLog[];

  // Refresh & Handlers
  refreshData: () => void;
  
  // CRUD actions
  addLocality: (item: Omit<Locality, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLocality: (id: string, item: Partial<Locality>) => void;
  deleteLocality: (id: string) => void;

  addPerson: (item: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePerson: (id: string, item: Partial<Person>) => void;
  deletePerson: (id: string) => void;

  addActivity: (item: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActivity: (id: string, item: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  addStudyCircle: (item: Omit<StudyCircle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudyCircle: (id: string, item: Partial<StudyCircle>) => void;
  deleteStudyCircle: (id: string) => void;

  addChildrenClass: (item: Omit<ChildrenClass, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChildrenClass: (id: string, item: Partial<ChildrenClass>) => void;
  deleteChildrenClass: (id: string) => void;

  addJuniorYouthGroup: (item: Omit<JuniorYouthGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJuniorYouthGroup: (id: string, item: Partial<JuniorYouthGroup>) => void;
  deleteJuniorYouthGroup: (id: string) => void;

  addDevotional: (item: Omit<DevotionalMeeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDevotional: (id: string, item: Partial<DevotionalMeeting>) => void;
  deleteDevotional: (id: string) => void;

  addHomeVisit: (item: Omit<HomeVisit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHomeVisit: (id: string, item: Partial<HomeVisit>) => void;
  deleteHomeVisit: (id: string) => void;

  addServiceVisit: (item: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateServiceVisit: (id: string, item: Partial<ServiceVisit>) => void;
  deleteServiceVisit: (id: string) => void;

  addNewBahai: (item: Omit<NewBahai, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNewBahai: (id: string, item: Partial<NewBahai>) => void;
  deleteNewBahai: (id: string) => void;

  addFollowUp: (item: Omit<FollowUpItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFollowUp: (id: string, item: Partial<FollowUpItem>) => void;
  deleteFollowUp: (id: string) => void;

  addCycle: (item: Omit<Cycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCycle: (id: string, item: Partial<Cycle>) => void;

  resetDemoData: () => void;
  clearAllData: () => void;
  loadKimanaLocalities: () => void;
  exportDataJSON: () => string;
  importDataJSON: (json: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [userRole, setUserRoleState] = useState<UserRole>('Cluster Coordinator');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [currentCycleId, setCurrentCycleIdState] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'cycle'>('all');
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('all');

  // Entities state
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [studyCircles, setStudyCircles] = useState<StudyCircle[]>([]);
  const [childrenClasses, setChildrenClasses] = useState<ChildrenClass[]>([]);
  const [juniorYouthGroups, setJuniorYouthGroups] = useState<JuniorYouthGroup[]>([]);
  const [devotionals, setDevotionals] = useState<DevotionalMeeting[]>([]);
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>([]);
  const [serviceVisits, setServiceVisits] = useState<ServiceVisit[]>([]);
  const [newBahais, setNewBahais] = useState<NewBahai[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load state on mount
  useEffect(() => {
    setUserRoleState(StorageService.getUserRole());
    setCurrentCycleIdState(StorageService.getCurrentCycleId());
    
    // Check dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }
    
    refreshData();
  }, []);

  const refreshData = () => {
    setLocalities(StorageService.getLocalities());
    setPeople(StorageService.getPeople());
    setActivities(StorageService.getActivities());
    setStudyCircles(StorageService.getStudyCircles());
    setChildrenClasses(StorageService.getChildrenClasses());
    setJuniorYouthGroups(StorageService.getJuniorYouthGroups());
    setDevotionals(StorageService.getDevotionals());
    setHomeVisits(StorageService.getHomeVisits());
    setServiceVisits(StorageService.getServiceVisits());
    setNewBahais(StorageService.getNewBahais());
    setFollowUps(StorageService.getFollowUps());
    setCycles(StorageService.getCycles());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    StorageService.saveUserRole(role);
    StorageService.logAction(role, 'Changed Role', `Switched role to ${role}`);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const setCurrentCycleId = (id: string) => {
    setCurrentCycleIdState(id);
    StorageService.saveCurrentCycleId(id);
  };

  // Helper for generating IDs and timestamps
  const now = () => new Date().toISOString();

  // CRUD Implementations
  const addLocality = (item: Omit<Locality, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Locality = { ...item, id: 'loc-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...localities];
    setLocalities(updated);
    StorageService.saveLocalities(updated);
    StorageService.logAction(userRole, 'Added Locality', `Created locality "${newItem.name}"`);
  };

  const updateLocality = (id: string, item: Partial<Locality>) => {
    const updated = localities.map(l => l.id === id ? { ...l, ...item, updatedAt: now() } : l);
    setLocalities(updated);
    StorageService.saveLocalities(updated);
    StorageService.logAction(userRole, 'Updated Locality', `Updated locality ID ${id}`);
  };

  const deleteLocality = (id: string) => {
    const updated = localities.filter(l => l.id !== id);
    setLocalities(updated);
    StorageService.saveLocalities(updated);
    StorageService.logAction(userRole, 'Deleted Locality', `Archived/Deleted locality ID ${id}`);
  };

  const addPerson = (item: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Person = { ...item, id: 'person-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...people];
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Added Person', `Added friend "${newItem.name}"`);
  };

  const updatePerson = (id: string, item: Partial<Person>) => {
    const updated = people.map(p => p.id === id ? { ...p, ...item, updatedAt: now() } : p);
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Updated Person', `Updated person ID ${id}`);
  };

  const deletePerson = (id: string) => {
    const updated = people.filter(p => p.id !== id);
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Deleted Person', `Removed person ID ${id}`);
  };

  const addActivity = (item: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Activity = { ...item, id: 'act-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...activities];
    setActivities(updated);
    StorageService.saveActivities(updated);
    StorageService.logAction(userRole, 'Added Activity', `Created activity "${newItem.title}"`);

    // If follow-up required, auto add to follow-ups
    if (newItem.followUpRequired && newItem.followUpDate) {
      addFollowUp({
        title: `Follow up: ${newItem.title}`,
        responsiblePerson: newItem.personResponsible,
        relatedEntity: `Activity: ${newItem.title}`,
        localityName: newItem.localityName,
        dueDate: newItem.followUpDate,
        priority: 'Medium',
        status: newItem.followUpStatus || 'Pending',
        notes: newItem.followUpNotes
      });
    }
  };

  const updateActivity = (id: string, item: Partial<Activity>) => {
    const updated = activities.map(a => a.id === id ? { ...a, ...item, updatedAt: now() } : a);
    setActivities(updated);
    StorageService.saveActivities(updated);
    StorageService.logAction(userRole, 'Updated Activity', `Updated activity ID ${id}`);
  };

  const deleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    StorageService.saveActivities(updated);
    StorageService.logAction(userRole, 'Deleted Activity', `Removed activity ID ${id}`);
  };

  const addStudyCircle = (item: Omit<StudyCircle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: StudyCircle = { ...item, id: 'sc-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...studyCircles];
    setStudyCircles(updated);
    StorageService.saveStudyCircles(updated);
    StorageService.logAction(userRole, 'Added Study Circle', `Added study group "${newItem.groupName}"`);
  };

  const updateStudyCircle = (id: string, item: Partial<StudyCircle>) => {
    const updated = studyCircles.map(s => s.id === id ? { ...s, ...item, updatedAt: now() } : s);
    setStudyCircles(updated);
    StorageService.saveStudyCircles(updated);
    StorageService.logAction(userRole, 'Updated Study Circle', `Updated study circle ID ${id}`);
  };

  const deleteStudyCircle = (id: string) => {
    const updated = studyCircles.filter(s => s.id !== id);
    setStudyCircles(updated);
    StorageService.saveStudyCircles(updated);
    StorageService.logAction(userRole, 'Deleted Study Circle', `Removed study circle ID ${id}`);
  };

  const addChildrenClass = (item: Omit<ChildrenClass, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ChildrenClass = { ...item, id: 'cc-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...childrenClasses];
    setChildrenClasses(updated);
    StorageService.saveChildrenClasses(updated);
    StorageService.logAction(userRole, 'Added Children Class', `Added class "${newItem.className}"`);
  };

  const updateChildrenClass = (id: string, item: Partial<ChildrenClass>) => {
    const updated = childrenClasses.map(c => c.id === id ? { ...c, ...item, updatedAt: now() } : c);
    setChildrenClasses(updated);
    StorageService.saveChildrenClasses(updated);
    StorageService.logAction(userRole, 'Updated Children Class', `Updated children class ID ${id}`);
  };

  const deleteChildrenClass = (id: string) => {
    const updated = childrenClasses.filter(c => c.id !== id);
    setChildrenClasses(updated);
    StorageService.saveChildrenClasses(updated);
    StorageService.logAction(userRole, 'Deleted Children Class', `Removed class ID ${id}`);
  };

  const addJuniorYouthGroup = (item: Omit<JuniorYouthGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: JuniorYouthGroup = { ...item, id: 'jy-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...juniorYouthGroups];
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Added JY Group', `Added group "${newItem.groupName}"`);
  };

  const updateJuniorYouthGroup = (id: string, item: Partial<JuniorYouthGroup>) => {
    const updated = juniorYouthGroups.map(j => j.id === id ? { ...j, ...item, updatedAt: now() } : j);
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Updated JY Group', `Updated group ID ${id}`);
  };

  const deleteJuniorYouthGroup = (id: string) => {
    const updated = juniorYouthGroups.filter(j => j.id !== id);
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Deleted JY Group', `Removed group ID ${id}`);
  };

  const addDevotional = (item: Omit<DevotionalMeeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: DevotionalMeeting = { ...item, id: 'dev-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...devotionals];
    setDevotionals(updated);
    StorageService.saveDevotionals(updated);
    StorageService.logAction(userRole, 'Added Devotional', `Recorded devotional "${newItem.title}"`);
  };

  const updateDevotional = (id: string, item: Partial<DevotionalMeeting>) => {
    const updated = devotionals.map(d => d.id === id ? { ...d, ...item, updatedAt: now() } : d);
    setDevotionals(updated);
    StorageService.saveDevotionals(updated);
    StorageService.logAction(userRole, 'Updated Devotional', `Updated devotional ID ${id}`);
  };

  const deleteDevotional = (id: string) => {
    const updated = devotionals.filter(d => d.id !== id);
    setDevotionals(updated);
    StorageService.saveDevotionals(updated);
    StorageService.logAction(userRole, 'Deleted Devotional', `Removed devotional ID ${id}`);
  };

  const addHomeVisit = (item: Omit<HomeVisit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: HomeVisit = { ...item, id: 'hv-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...homeVisits];
    setHomeVisits(updated);
    StorageService.saveHomeVisits(updated);
    StorageService.logAction(userRole, 'Added Home Visit', `Recorded visit to "${newItem.familyOrPersonVisited}"`);

    if (newItem.followUpNeeded && newItem.followUpDate) {
      addFollowUp({
        title: `Home Visit Follow-up: ${newItem.familyOrPersonVisited}`,
        responsiblePerson: newItem.visitors[0] || 'Coordinator',
        relatedEntity: `Home Visit: ${newItem.familyOrPersonVisited}`,
        localityName: newItem.localityName,
        dueDate: newItem.followUpDate,
        priority: 'Medium',
        status: 'Pending',
        notes: newItem.notes
      });
    }
  };

  const updateHomeVisit = (id: string, item: Partial<HomeVisit>) => {
    const updated = homeVisits.map(h => h.id === id ? { ...h, ...item, updatedAt: now() } : h);
    setHomeVisits(updated);
    StorageService.saveHomeVisits(updated);
    StorageService.logAction(userRole, 'Updated Home Visit', `Updated home visit ID ${id}`);
  };

  const deleteHomeVisit = (id: string) => {
    const updated = homeVisits.filter(h => h.id !== id);
    setHomeVisits(updated);
    StorageService.saveHomeVisits(updated);
    StorageService.logAction(userRole, 'Deleted Home Visit', `Removed home visit ID ${id}`);
  };

  const addServiceVisit = (item: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ServiceVisit = { ...item, id: 'vis-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...serviceVisits];
    setServiceVisits(updated);
    StorageService.saveServiceVisits(updated);
    StorageService.logAction(userRole, 'Added Service Visit', `Recorded travel/visit for "${newItem.personName}"`);
  };

  const updateServiceVisit = (id: string, item: Partial<ServiceVisit>) => {
    const updated = serviceVisits.map(v => v.id === id ? { ...v, ...item, updatedAt: now() } : v);
    setServiceVisits(updated);
    StorageService.saveServiceVisits(updated);
    StorageService.logAction(userRole, 'Updated Service Visit', `Updated visit ID ${id}`);
  };

  const deleteServiceVisit = (id: string) => {
    const updated = serviceVisits.filter(v => v.id !== id);
    setServiceVisits(updated);
    StorageService.saveServiceVisits(updated);
    StorageService.logAction(userRole, 'Deleted Service Visit', `Removed visit ID ${id}`);
  };

  const addNewBahai = (item: Omit<NewBahai, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: NewBahai = { ...item, id: 'nb-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...newBahais];
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Added New Bahá’í', `Recorded declaration for "${newItem.name}"`);

    // Update locality population count
    const targetLoc = localities.find(l => l.id === newItem.localityId);
    if (targetLoc) {
      updateLocality(targetLoc.id, { bahaiCount: targetLoc.bahaiCount + 1 });
    }
  };

  const updateNewBahai = (id: string, item: Partial<NewBahai>) => {
    const updated = newBahais.map(n => n.id === id ? { ...n, ...item, updatedAt: now() } : n);
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Updated New Bahá’í', `Updated record ID ${id}`);
  };

  const deleteNewBahai = (id: string) => {
    const updated = newBahais.filter(n => n.id !== id);
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Deleted New Bahá’í Record', `Removed record ID ${id}`);
  };

  const addFollowUp = (item: Omit<FollowUpItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: FollowUpItem = { ...item, id: 'fu-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...followUps];
    setFollowUps(updated);
    StorageService.saveFollowUps(updated);
  };

  const updateFollowUp = (id: string, item: Partial<FollowUpItem>) => {
    const updated = followUps.map(f => f.id === id ? { ...f, ...item, updatedAt: now() } : f);
    setFollowUps(updated);
    StorageService.saveFollowUps(updated);
  };

  const deleteFollowUp = (id: string) => {
    const updated = followUps.filter(f => f.id !== id);
    setFollowUps(updated);
    StorageService.saveFollowUps(updated);
  };

  const addCycle = (item: Omit<Cycle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Cycle = { ...item, id: 'cycle-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...cycles];
    setCycles(updated);
    StorageService.saveCycles(updated);
  };

  const updateCycle = (id: string, item: Partial<Cycle>) => {
    const updated = cycles.map(c => c.id === id ? { ...c, ...item, updatedAt: now() } : c);
    setCycles(updated);
    StorageService.saveCycles(updated);
  };

  const clearAllData = () => {
    StorageService.clearAllData();
    refreshData();
    StorageService.logAction(userRole, 'Clear All Data', 'Erased all test and stored records to clean slate');
  };

  const resetDemoData = () => {
    clearAllData();
  };

  const loadKimanaLocalities = () => {
    StorageService.loadCleanKimanaLocalities();
    refreshData();
    StorageService.logAction(userRole, 'Initialized Localities', 'Loaded official Kimana Cluster localities with clean zero data');
  };

  const exportDataJSON = () => {
    return StorageService.exportFullBackup();
  };

  const importDataJSON = (json: string) => {
    const success = StorageService.importFullBackup(json);
    if (success) refreshData();
    return success;
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      userRole, setUserRole,
      theme, setTheme, toggleTheme,
      searchQuery, setSearchQuery,
      isSearchOpen, setIsSearchOpen,
      currentCycleId, setCurrentCycleId,
      dateFilter, setDateFilter,
      selectedLocalityFilter, setSelectedLocalityFilter,
      localities, people, activities, studyCircles,
      childrenClasses, juniorYouthGroups, devotionals,
      homeVisits, serviceVisits, newBahais, followUps,
      cycles, auditLogs,
      refreshData,
      addLocality, updateLocality, deleteLocality,
      addPerson, updatePerson, deletePerson,
      addActivity, updateActivity, deleteActivity,
      addStudyCircle, updateStudyCircle, deleteStudyCircle,
      addChildrenClass, updateChildrenClass, deleteChildrenClass,
      addJuniorYouthGroup, updateJuniorYouthGroup, deleteJuniorYouthGroup,
      addDevotional, updateDevotional, deleteDevotional,
      addHomeVisit, updateHomeVisit, deleteHomeVisit,
      addServiceVisit, updateServiceVisit, deleteServiceVisit,
      addNewBahai, updateNewBahai, deleteNewBahai,
      addFollowUp, updateFollowUp, deleteFollowUp,
      addCycle, updateCycle,
      resetDemoData, clearAllData, loadKimanaLocalities, exportDataJSON, importDataJSON
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
