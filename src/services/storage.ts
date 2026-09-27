import { 
  Locality, Person, Activity, StudyCircle, ChildrenClass, 
  JuniorYouthGroup, DevotionalMeeting, HomeVisit, ServiceVisit, 
  NewBahai, FollowUpItem, Cycle, AuditLog, UserRole 
} from '../types';
import { 
  INITIAL_LOCALITIES, INITIAL_PEOPLE, INITIAL_ACTIVITIES, 
  INITIAL_STUDY_CIRCLES, INITIAL_CHILDREN_CLASSES, 
  INITIAL_JUNIOR_YOUTH_GROUPS, INITIAL_DEVOTIONALS, 
  INITIAL_HOME_VISITS, INITIAL_SERVICE_VISITS, 
  INITIAL_NEW_BAHAIS, INITIAL_FOLLOW_UPS, INITIAL_CYCLES, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

const KEYS = {
  LOCALITIES: 'kimana_tracker_localities_v1',
  PEOPLE: 'kimana_tracker_people_v1',
  ACTIVITIES: 'kimana_tracker_activities_v1',
  STUDY_CIRCLES: 'kimana_tracker_study_circles_v1',
  CHILDREN_CLASSES: 'kimana_tracker_children_classes_v1',
  JUNIOR_YOUTH: 'kimana_tracker_junior_youth_v1',
  DEVOTIONALS: 'kimana_tracker_devotionals_v1',
  HOME_VISITS: 'kimana_tracker_home_visits_v1',
  SERVICE_VISITS: 'kimana_tracker_service_visits_v1',
  NEW_BAHAIS: 'kimana_tracker_new_bahais_v1',
  FOLLOW_UPS: 'kimana_tracker_follow_ups_v1',
  CYCLES: 'kimana_tracker_cycles_v1',
  AUDIT_LOGS: 'kimana_tracker_audit_logs_v1',
  USER_ROLE: 'kimana_tracker_user_role_v1',
  CURRENT_CYCLE_ID: 'kimana_tracker_current_cycle_id_v1',
};

// Helper for local storage reading/writing with fallback
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${key} from storage`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage`, err);
  }
}

export class StorageService {
  // Store state getters
  static getLocalities(): Locality[] {
    return loadFromStorage<Locality[]>(KEYS.LOCALITIES, INITIAL_LOCALITIES);
  }
  static saveLocalities(items: Locality[]): void {
    saveToStorage(KEYS.LOCALITIES, items);
  }

  static getPeople(): Person[] {
    return loadFromStorage<Person[]>(KEYS.PEOPLE, INITIAL_PEOPLE);
  }
  static savePeople(items: Person[]): void {
    saveToStorage(KEYS.PEOPLE, items);
  }

  static getActivities(): Activity[] {
    return loadFromStorage<Activity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }
  static saveActivities(items: Activity[]): void {
    saveToStorage(KEYS.ACTIVITIES, items);
  }

  static getStudyCircles(): StudyCircle[] {
    return loadFromStorage<StudyCircle[]>(KEYS.STUDY_CIRCLES, INITIAL_STUDY_CIRCLES);
  }
  static saveStudyCircles(items: StudyCircle[]): void {
    saveToStorage(KEYS.STUDY_CIRCLES, items);
  }

  static getChildrenClasses(): ChildrenClass[] {
    return loadFromStorage<ChildrenClass[]>(KEYS.CHILDREN_CLASSES, INITIAL_CHILDREN_CLASSES);
  }
  static saveChildrenClasses(items: ChildrenClass[]): void {
    saveToStorage(KEYS.CHILDREN_CLASSES, items);
  }

  static getJuniorYouthGroups(): JuniorYouthGroup[] {
    return loadFromStorage<JuniorYouthGroup[]>(KEYS.JUNIOR_YOUTH, INITIAL_JUNIOR_YOUTH_GROUPS);
  }
  static saveJuniorYouthGroups(items: JuniorYouthGroup[]): void {
    saveToStorage(KEYS.JUNIOR_YOUTH, items);
  }

  static getDevotionals(): DevotionalMeeting[] {
    return loadFromStorage<DevotionalMeeting[]>(KEYS.DEVOTIONALS, INITIAL_DEVOTIONALS);
  }
  static saveDevotionals(items: DevotionalMeeting[]): void {
    saveToStorage(KEYS.DEVOTIONALS, items);
  }

  static getHomeVisits(): HomeVisit[] {
    return loadFromStorage<HomeVisit[]>(KEYS.HOME_VISITS, INITIAL_HOME_VISITS);
  }
  static saveHomeVisits(items: HomeVisit[]): void {
    saveToStorage(KEYS.HOME_VISITS, items);
  }

  static getServiceVisits(): ServiceVisit[] {
    return loadFromStorage<ServiceVisit[]>(KEYS.SERVICE_VISITS, INITIAL_SERVICE_VISITS);
  }
  static saveServiceVisits(items: ServiceVisit[]): void {
    saveToStorage(KEYS.SERVICE_VISITS, items);
  }

  static getNewBahais(): NewBahai[] {
    return loadFromStorage<NewBahai[]>(KEYS.NEW_BAHAIS, INITIAL_NEW_BAHAIS);
  }
  static saveNewBahais(items: NewBahai[]): void {
    saveToStorage(KEYS.NEW_BAHAIS, items);
  }

  static getFollowUps(): FollowUpItem[] {
    return loadFromStorage<FollowUpItem[]>(KEYS.FOLLOW_UPS, INITIAL_FOLLOW_UPS);
  }
  static saveFollowUps(items: FollowUpItem[]): void {
    saveToStorage(KEYS.FOLLOW_UPS, items);
  }

  static getCycles(): Cycle[] {
    return loadFromStorage<Cycle[]>(KEYS.CYCLES, INITIAL_CYCLES);
  }
  static saveCycles(items: Cycle[]): void {
    saveToStorage(KEYS.CYCLES, items);
  }

  static getAuditLogs(): AuditLog[] {
    return loadFromStorage<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
  static saveAuditLogs(items: AuditLog[]): void {
    saveToStorage(KEYS.AUDIT_LOGS, items);
  }

  static logAction(userRole: UserRole, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userRole,
      action,
      details
    };
    this.saveAuditLogs([newLog, ...logs].slice(0, 100)); // keep last 100
  }

  static getUserRole(): UserRole {
    return loadFromStorage<UserRole>(KEYS.USER_ROLE, 'Cluster Coordinator');
  }
  static saveUserRole(role: UserRole): void {
    saveToStorage(KEYS.USER_ROLE, role);
  }

  static getCurrentCycleId(): string {
    return loadFromStorage<string>(KEYS.CURRENT_CYCLE_ID, 'cycle-14');
  }
  static saveCurrentCycleId(cycleId: string): void {
    saveToStorage(KEYS.CURRENT_CYCLE_ID, cycleId);
  }

  // Reset demo data
  static resetDemoData(): void {
    saveToStorage(KEYS.LOCALITIES, INITIAL_LOCALITIES);
    saveToStorage(KEYS.PEOPLE, INITIAL_PEOPLE);
    saveToStorage(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    saveToStorage(KEYS.STUDY_CIRCLES, INITIAL_STUDY_CIRCLES);
    saveToStorage(KEYS.CHILDREN_CLASSES, INITIAL_CHILDREN_CLASSES);
    saveToStorage(KEYS.JUNIOR_YOUTH, INITIAL_JUNIOR_YOUTH_GROUPS);
    saveToStorage(KEYS.DEVOTIONALS, INITIAL_DEVOTIONALS);
    saveToStorage(KEYS.HOME_VISITS, INITIAL_HOME_VISITS);
    saveToStorage(KEYS.SERVICE_VISITS, INITIAL_SERVICE_VISITS);
    saveToStorage(KEYS.NEW_BAHAIS, INITIAL_NEW_BAHAIS);
    saveToStorage(KEYS.FOLLOW_UPS, INITIAL_FOLLOW_UPS);
    saveToStorage(KEYS.CYCLES, INITIAL_CYCLES);
    saveToStorage(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    saveToStorage(KEYS.CURRENT_CYCLE_ID, 'cycle-14');
  }

  // Backup & restore whole DB as JSON
  static exportFullBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      cluster: 'Kimana Cluster',
      localities: this.getLocalities(),
      people: this.getPeople(),
      activities: this.getActivities(),
      studyCircles: this.getStudyCircles(),
      childrenClasses: this.getChildrenClasses(),
      juniorYouthGroups: this.getJuniorYouthGroups(),
      devotionals: this.getDevotionals(),
      homeVisits: this.getHomeVisits(),
      serviceVisits: this.getServiceVisits(),
      newBahais: this.getNewBahais(),
      followUps: this.getFollowUps(),
      cycles: this.getCycles(),
      auditLogs: this.getAuditLogs()
    };
    return JSON.stringify(data, null, 2);
  }

  static importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.localities || !parsed.activities) return false;

      if (parsed.localities) this.saveLocalities(parsed.localities);
      if (parsed.people) this.savePeople(parsed.people);
      if (parsed.activities) this.saveActivities(parsed.activities);
      if (parsed.studyCircles) this.saveStudyCircles(parsed.studyCircles);
      if (parsed.childrenClasses) this.saveChildrenClasses(parsed.childrenClasses);
      if (parsed.juniorYouthGroups) this.saveJuniorYouthGroups(parsed.juniorYouthGroups);
      if (parsed.devotionals) this.saveDevotionals(parsed.devotionals);
      if (parsed.homeVisits) this.saveHomeVisits(parsed.homeVisits);
      if (parsed.serviceVisits) this.saveServiceVisits(parsed.serviceVisits);
      if (parsed.newBahais) this.saveNewBahais(parsed.newBahais);
      if (parsed.followUps) this.saveFollowUps(parsed.followUps);
      if (parsed.cycles) this.saveCycles(parsed.cycles);
      if (parsed.auditLogs) this.saveAuditLogs(parsed.auditLogs);
      return true;
    } catch (err) {
      console.error('Failed to import JSON backup', err);
      return false;
    }
  }
}
