import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Locality, Person, Activity, StudyCircle, ChildrenClass, 
  JuniorYouthGroup, DevotionalMeeting, HomeVisit, ServiceVisit, 
  NewBahai, FollowUpItem, Cycle, AuditLog, UserRole, NavigationTab,
  FriendComingIn, FriendGoingOut, ReportPlan, ReportChallenge, ReportPioneer,
  ParticipantRecord
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

  // Security & Sensitive Data Access Control
  isSecurityUnlocked: boolean;
  verifyAndUnlock: (pin: string) => Promise<boolean>;
  lockSensitiveData: () => void;
  maskSensitiveData: boolean;
  setMaskSensitiveData: (mask: boolean) => void;
  changeSecurityPin: (newPin: string) => Promise<void>;
  formatContact: (contact?: string) => string;

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
  friendsComingIn: FriendComingIn[];
  friendsGoingOut: FriendGoingOut[];
  reportPlans: ReportPlan[];
  reportChallenges: ReportChallenge[];
  reportPioneers: ReportPioneer[];
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
  batchAddPeople: (items: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
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

  batchAddParticipantsToGroup: (
    type: 'children' | 'junioryouth' | 'studycircles' | 'devotionals',
    groupId: string,
    newNames: string[]
  ) => void;

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

  // Dedicated Friends Coming In
  addFriendComingIn: (item: Omit<FriendComingIn, 'id' | 'createdAt' | 'updatedAt'>) => void;
  batchAddFriendsComingIn: (items: Omit<FriendComingIn, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateFriendComingIn: (id: string, item: Partial<FriendComingIn>) => void;
  deleteFriendComingIn: (id: string) => void;

  // Dedicated Friends Going Out
  addFriendGoingOut: (item: Omit<FriendGoingOut, 'id' | 'createdAt' | 'updatedAt'>) => void;
  batchAddFriendsGoingOut: (items: Omit<FriendGoingOut, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateFriendGoingOut: (id: string, item: Partial<FriendGoingOut>) => void;
  deleteFriendGoingOut: (id: string) => void;

  // Formal Report Sections
  addReportPlan: (item: Omit<ReportPlan, 'id'>) => void;
  updateReportPlan: (id: string, item: Partial<ReportPlan>) => void;
  deleteReportPlan: (id: string) => void;

  addReportChallenge: (item: Omit<ReportChallenge, 'id'>) => void;
  updateReportChallenge: (id: string, item: Partial<ReportChallenge>) => void;
  deleteReportChallenge: (id: string) => void;

  addReportPioneer: (item: Omit<ReportPioneer, 'id'>) => void;
  updateReportPioneer: (id: string, item: Partial<ReportPioneer>) => void;
  deleteReportPioneer: (id: string) => void;

  addFollowUp: (item: Omit<FollowUpItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFollowUp: (id: string, item: Partial<FollowUpItem>) => void;
  deleteFollowUp: (id: string) => void;

  addCycle: (item: Omit<Cycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCycle: (id: string, item: Partial<Cycle>) => void;

  resetDemoData: () => void;
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
  
  const [currentCycleId, setCurrentCycleIdState] = useState<string>('cycle-14');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'cycle'>('all');
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('all');

  // Security state
  const [isSecurityUnlocked, setIsSecurityUnlocked] = useState<boolean>(true); // default unlocked for coordinator session
  const [maskSensitiveData, setMaskSensitiveDataState] = useState<boolean>(true);

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
  const [friendsComingIn, setFriendsComingIn] = useState<FriendComingIn[]>([]);
  const [friendsGoingOut, setFriendsGoingOut] = useState<FriendGoingOut[]>([]);
  const [reportPlans, setReportPlans] = useState<ReportPlan[]>([]);
  const [reportChallenges, setReportChallenges] = useState<ReportChallenge[]>([]);
  const [reportPioneers, setReportPioneers] = useState<ReportPioneer[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load state on mount
  useEffect(() => {
    setUserRoleState(StorageService.getUserRole());
    setCurrentCycleIdState(StorageService.getCurrentCycleId());
    setMaskSensitiveDataState(StorageService.getMaskSensitiveData());
    
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
    setFriendsComingIn(StorageService.getFriendsComingIn());
    setFriendsGoingOut(StorageService.getFriendsGoingOut());
    setReportPlans(StorageService.getReportPlans());
    setReportChallenges(StorageService.getReportChallenges());
    setReportPioneers(StorageService.getReportPioneers());
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

  // Security Unlock & Contact Privacy
  const verifyAndUnlock = async (pin: string): Promise<boolean> => {
    const isValid = await StorageService.verifyPin(pin);
    if (isValid) {
      setIsSecurityUnlocked(true);
      StorageService.logAction(userRole, 'Security Authentication', 'Unlocked sensitive contact data view');
    }
    return isValid;
  };

  const lockSensitiveData = () => {
    setIsSecurityUnlocked(false);
  };

  const setMaskSensitiveData = (mask: boolean) => {
    setMaskSensitiveDataState(mask);
    StorageService.setMaskSensitiveData(mask);
  };

  const changeSecurityPin = async (newPin: string): Promise<void> => {
    await StorageService.setSecurityPin(newPin);
    StorageService.logAction(userRole, 'Security Setting', 'Updated cluster administrator security PIN');
  };

  const formatContact = (contact?: string): string => {
    if (!contact) return '—';
    // If not masking, or user role is Admin/Coordinator and isUnlocked
    if (!maskSensitiveData || isSecurityUnlocked || userRole === 'Administrator') {
      return contact;
    }
    // Return masked contact
    if (contact.length <= 6) return '••••••';
    const first3 = contact.slice(0, 4);
    const last3 = contact.slice(-3);
    return `${first3}••••${last3}`;
  };

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
    StorageService.logAction(userRole, 'Added Person', `Added individual "${newItem.name}"`);
  };

  const batchAddPeople = (items: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newItems: Person[] = items.map((item, idx) => ({
      ...item,
      id: 'person-' + Date.now() + '-' + idx,
      createdAt: now(),
      updatedAt: now()
    }));
    const updated = [...newItems, ...people];
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Batch Added People', `Added ${newItems.length} people simultaneously`);
  };

  const updatePerson = (id: string, item: Partial<Person>) => {
    const updated = people.map(p => p.id === id ? { ...p, ...item, updatedAt: now() } : p);
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Updated Person', `Updated individual record ID ${id}`);
  };

  const deletePerson = (id: string) => {
    const updated = people.filter(p => p.id !== id);
    setPeople(updated);
    StorageService.savePeople(updated);
    StorageService.logAction(userRole, 'Deleted Person', `Removed individual record ID ${id}`);
  };

  const addActivity = (item: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Activity = { ...item, id: 'act-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...activities];
    setActivities(updated);
    StorageService.saveActivities(updated);
    StorageService.logAction(userRole, 'Created Activity', `Created ${newItem.type}: "${newItem.title}"`);
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
    StorageService.logAction(userRole, 'Deleted Activity', `Deleted activity ID ${id}`);
  };

  const addStudyCircle = (item: Omit<StudyCircle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: StudyCircle = { ...item, id: 'sc-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...studyCircles];
    setStudyCircles(updated);
    StorageService.saveStudyCircles(updated);
    StorageService.logAction(userRole, 'Added Study Circle', `Started study group "${newItem.groupName}"`);
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
    StorageService.logAction(userRole, 'Added Children Class', `Created children's class "${newItem.className}"`);
  };

  const updateChildrenClass = (id: string, item: Partial<ChildrenClass>) => {
    const updated = childrenClasses.map(c => c.id === id ? { ...c, ...item, updatedAt: now() } : c);
    setChildrenClasses(updated);
    StorageService.saveChildrenClasses(updated);
    StorageService.logAction(userRole, 'Updated Children Class', `Updated children's class ID ${id}`);
  };

  const deleteChildrenClass = (id: string) => {
    const updated = childrenClasses.filter(c => c.id !== id);
    setChildrenClasses(updated);
    StorageService.saveChildrenClasses(updated);
    StorageService.logAction(userRole, 'Deleted Children Class', `Removed children's class ID ${id}`);
  };

  const addJuniorYouthGroup = (item: Omit<JuniorYouthGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: JuniorYouthGroup = { ...item, id: 'jy-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...juniorYouthGroups];
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Added Junior Youth Group', `Created JY group "${newItem.groupName}"`);
  };

  const updateJuniorYouthGroup = (id: string, item: Partial<JuniorYouthGroup>) => {
    const updated = juniorYouthGroups.map(j => j.id === id ? { ...j, ...item, updatedAt: now() } : j);
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Updated Junior Youth Group', `Updated JY group ID ${id}`);
  };

  const deleteJuniorYouthGroup = (id: string) => {
    const updated = juniorYouthGroups.filter(j => j.id !== id);
    setJuniorYouthGroups(updated);
    StorageService.saveJuniorYouthGroups(updated);
    StorageService.logAction(userRole, 'Deleted Junior Youth Group', `Removed JY group ID ${id}`);
  };

  const batchAddParticipantsToGroup = (
    type: 'children' | 'junioryouth' | 'studycircles' | 'devotionals',
    groupId: string,
    newNames: string[]
  ) => {
    if (type === 'children') {
      const cls = childrenClasses.find(c => c.id === groupId);
      if (cls) {
        const merged = Array.from(new Set([...cls.childrenNames, ...newNames]));
        updateChildrenClass(groupId, {
          childrenNames: merged,
          averageAttendance: Math.max(cls.averageAttendance, merged.length)
        });
      }
    } else if (type === 'junioryouth') {
      const grp = juniorYouthGroups.find(j => j.id === groupId);
      if (grp) {
        const merged = Array.from(new Set([...grp.members, ...newNames]));
        updateJuniorYouthGroup(groupId, {
          members: merged,
          averageAttendance: Math.max(grp.averageAttendance, merged.length)
        });
      }
    } else if (type === 'studycircles') {
      const sc = studyCircles.find(s => s.id === groupId);
      if (sc) {
        const merged = Array.from(new Set([...sc.participants, ...newNames]));
        updateStudyCircle(groupId, { participants: merged });
      }
    } else if (type === 'devotionals') {
      const dev = devotionals.find(d => d.id === groupId);
      if (dev) {
        const existing = dev.participantNames || [];
        const merged = Array.from(new Set([...existing, ...newNames]));
        updateDevotional(groupId, {
          participantNames: merged,
          participantsCount: Math.max(dev.participantsCount, merged.length)
        });
      }
    }
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
    StorageService.logAction(userRole, 'Added Service Visit', `Recorded travel/service visit for ${newItem.personName}`);
  };

  const updateServiceVisit = (id: string, item: Partial<ServiceVisit>) => {
    const updated = serviceVisits.map(s => s.id === id ? { ...s, ...item, updatedAt: now() } : s);
    setServiceVisits(updated);
    StorageService.saveServiceVisits(updated);
    StorageService.logAction(userRole, 'Updated Service Visit', `Updated visit ID ${id}`);
  };

  const deleteServiceVisit = (id: string) => {
    const updated = serviceVisits.filter(s => s.id !== id);
    setServiceVisits(updated);
    StorageService.saveServiceVisits(updated);
    StorageService.logAction(userRole, 'Deleted Service Visit', `Removed visit ID ${id}`);
  };

  const addNewBahai = (item: Omit<NewBahai, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: NewBahai = { ...item, id: 'nb-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...newBahais];
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Added New Bahá’í', `Recorded declaration of ${newItem.name}`);
  };

  const updateNewBahai = (id: string, item: Partial<NewBahai>) => {
    const updated = newBahais.map(n => n.id === id ? { ...n, ...item, updatedAt: now() } : n);
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Updated New Bahá’í', `Updated record for ${id}`);
  };

  const deleteNewBahai = (id: string) => {
    const updated = newBahais.filter(n => n.id !== id);
    setNewBahais(updated);
    StorageService.saveNewBahais(updated);
    StorageService.logAction(userRole, 'Deleted New Bahá’í', `Removed record ID ${id}`);
  };

  // Dedicated Friends Coming In
  const addFriendComingIn = (item: Omit<FriendComingIn, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: FriendComingIn = { ...item, id: 'fci-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...friendsComingIn];
    setFriendsComingIn(updated);
    StorageService.saveFriendsComingIn(updated);
    StorageService.logAction(userRole, 'Added Friend Coming In', `Recorded new arrival: ${newItem.fullName}`);
  };

  const batchAddFriendsComingIn = (items: Omit<FriendComingIn, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newItems: FriendComingIn[] = items.map((item, idx) => ({
      ...item,
      id: 'fci-' + Date.now() + '-' + idx,
      createdAt: now(),
      updatedAt: now()
    }));
    const updated = [...newItems, ...friendsComingIn];
    setFriendsComingIn(updated);
    StorageService.saveFriendsComingIn(updated);
    StorageService.logAction(userRole, 'Batch Added Friends Coming In', `Recorded ${newItems.length} friends coming into community`);
  };

  const updateFriendComingIn = (id: string, item: Partial<FriendComingIn>) => {
    const updated = friendsComingIn.map(f => f.id === id ? { ...f, ...item, updatedAt: now() } : f);
    setFriendsComingIn(updated);
    StorageService.saveFriendsComingIn(updated);
    StorageService.logAction(userRole, 'Updated Friend Coming In', `Updated arrival record ID ${id}`);
  };

  const deleteFriendComingIn = (id: string) => {
    const updated = friendsComingIn.filter(f => f.id !== id);
    setFriendsComingIn(updated);
    StorageService.saveFriendsComingIn(updated);
    StorageService.logAction(userRole, 'Deleted Friend Coming In', `Deleted arrival record ID ${id}`);
  };

  // Dedicated Friends Going Out
  const addFriendGoingOut = (item: Omit<FriendGoingOut, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: FriendGoingOut = { ...item, id: 'fgo-' + Date.now(), createdAt: now(), updatedAt: now() };
    const updated = [newItem, ...friendsGoingOut];
    setFriendsGoingOut(updated);
    StorageService.saveFriendsGoingOut(updated);
    StorageService.logAction(userRole, 'Added Friend Going Out', `Recorded outbound friend: ${newItem.fullName}`);
  };

  const batchAddFriendsGoingOut = (items: Omit<FriendGoingOut, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newItems: FriendGoingOut[] = items.map((item, idx) => ({
      ...item,
      id: 'fgo-' + Date.now() + '-' + idx,
      createdAt: now(),
      updatedAt: now()
    }));
    const updated = [...newItems, ...friendsGoingOut];
    setFriendsGoingOut(updated);
    StorageService.saveFriendsGoingOut(updated);
    StorageService.logAction(userRole, 'Batch Added Friends Going Out', `Recorded ${newItems.length} outbound friends`);
  };

  const updateFriendGoingOut = (id: string, item: Partial<FriendGoingOut>) => {
    const updated = friendsGoingOut.map(f => f.id === id ? { ...f, ...item, updatedAt: now() } : f);
    setFriendsGoingOut(updated);
    StorageService.saveFriendsGoingOut(updated);
    StorageService.logAction(userRole, 'Updated Friend Going Out', `Updated outbound record ID ${id}`);
  };

  const deleteFriendGoingOut = (id: string) => {
    const updated = friendsGoingOut.filter(f => f.id !== id);
    setFriendsGoingOut(updated);
    StorageService.saveFriendsGoingOut(updated);
    StorageService.logAction(userRole, 'Deleted Friend Going Out', `Deleted outbound record ID ${id}`);
  };

  // Formal Report Sections
  const addReportPlan = (item: Omit<ReportPlan, 'id'>) => {
    const newItem: ReportPlan = { ...item, id: 'plan-' + Date.now() };
    const updated = [newItem, ...reportPlans];
    setReportPlans(updated);
    StorageService.saveReportPlans(updated);
  };

  const updateReportPlan = (id: string, item: Partial<ReportPlan>) => {
    const updated = reportPlans.map(p => p.id === id ? { ...p, ...item } : p);
    setReportPlans(updated);
    StorageService.saveReportPlans(updated);
  };

  const deleteReportPlan = (id: string) => {
    const updated = reportPlans.filter(p => p.id !== id);
    setReportPlans(updated);
    StorageService.saveReportPlans(updated);
  };

  const addReportChallenge = (item: Omit<ReportChallenge, 'id'>) => {
    const newItem: ReportChallenge = { ...item, id: 'ch-' + Date.now() };
    const updated = [newItem, ...reportChallenges];
    setReportChallenges(updated);
    StorageService.saveReportChallenges(updated);
  };

  const updateReportChallenge = (id: string, item: Partial<ReportChallenge>) => {
    const updated = reportChallenges.map(c => c.id === id ? { ...c, ...item } : c);
    setReportChallenges(updated);
    StorageService.saveReportChallenges(updated);
  };

  const deleteReportChallenge = (id: string) => {
    const updated = reportChallenges.filter(c => c.id !== id);
    setReportChallenges(updated);
    StorageService.saveReportChallenges(updated);
  };

  const addReportPioneer = (item: Omit<ReportPioneer, 'id'>) => {
    const newItem: ReportPioneer = { ...item, id: 'pion-' + Date.now() };
    const updated = [newItem, ...reportPioneers];
    setReportPioneers(updated);
    StorageService.saveReportPioneers(updated);
  };

  const updateReportPioneer = (id: string, item: Partial<ReportPioneer>) => {
    const updated = reportPioneers.map(p => p.id === id ? { ...p, ...item } : p);
    setReportPioneers(updated);
    StorageService.saveReportPioneers(updated);
  };

  const deleteReportPioneer = (id: string) => {
    const updated = reportPioneers.filter(p => p.id !== id);
    setReportPioneers(updated);
    StorageService.saveReportPioneers(updated);
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

  const resetDemoData = () => {
    StorageService.resetDemoData();
    refreshData();
    StorageService.logAction(userRole, 'Reset Demo Data', 'Restored original Kimana Cluster sample dataset');
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
      isSecurityUnlocked, verifyAndUnlock, lockSensitiveData,
      maskSensitiveData, setMaskSensitiveData, changeSecurityPin, formatContact,
      localities, people, activities, studyCircles,
      childrenClasses, juniorYouthGroups, devotionals,
      homeVisits, serviceVisits, newBahais,
      friendsComingIn, friendsGoingOut,
      reportPlans, reportChallenges, reportPioneers,
      followUps, cycles, auditLogs,
      refreshData,
      addLocality, updateLocality, deleteLocality,
      addPerson, batchAddPeople, updatePerson, deletePerson,
      addActivity, updateActivity, deleteActivity,
      addStudyCircle, updateStudyCircle, deleteStudyCircle,
      addChildrenClass, updateChildrenClass, deleteChildrenClass,
      addJuniorYouthGroup, updateJuniorYouthGroup, deleteJuniorYouthGroup,
      batchAddParticipantsToGroup,
      addDevotional, updateDevotional, deleteDevotional,
      addHomeVisit, updateHomeVisit, deleteHomeVisit,
      addServiceVisit, updateServiceVisit, deleteServiceVisit,
      addNewBahai, updateNewBahai, deleteNewBahai,
      addFriendComingIn, batchAddFriendsComingIn, updateFriendComingIn, deleteFriendComingIn,
      addFriendGoingOut, batchAddFriendsGoingOut, updateFriendGoingOut, deleteFriendGoingOut,
      addReportPlan, updateReportPlan, deleteReportPlan,
      addReportChallenge, updateReportChallenge, deleteReportChallenge,
      addReportPioneer, updateReportPioneer, deleteReportPioneer,
      addFollowUp, updateFollowUp, deleteFollowUp,
      addCycle, updateCycle,
      resetDemoData, exportDataJSON, importDataJSON
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
