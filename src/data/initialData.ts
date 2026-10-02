import { 
  Locality, Person, Activity, StudyCircle, ChildrenClass, 
  JuniorYouthGroup, DevotionalMeeting, HomeVisit, ServiceVisit, 
  NewBahai, FollowUpItem, Cycle, AuditLog 
} from '../types';

// Clean initial data - all test and demo records removed
export const INITIAL_LOCALITIES: Locality[] = [];

export const INITIAL_PEOPLE: Person[] = [];

export const INITIAL_ACTIVITIES: Activity[] = [];

export const INITIAL_STUDY_CIRCLES: StudyCircle[] = [];

export const INITIAL_CHILDREN_CLASSES: ChildrenClass[] = [];

export const INITIAL_JUNIOR_YOUTH_GROUPS: JuniorYouthGroup[] = [];

export const INITIAL_DEVOTIONALS: DevotionalMeeting[] = [];

export const INITIAL_HOME_VISITS: HomeVisit[] = [];

export const INITIAL_SERVICE_VISITS: ServiceVisit[] = [];

export const INITIAL_NEW_BAHAIS: NewBahai[] = [];

export const INITIAL_FOLLOW_UPS: FollowUpItem[] = [];

export const INITIAL_CYCLES: Cycle[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

// Clean standard cluster localities with zero data (available for 1-click addition if desired)
export const DEFAULT_KIMANA_LOCALITIES: Omit<Locality, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Kimana Town',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  },
  {
    name: 'Isinet',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  },
  {
    name: 'Rombo',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  },
  {
    name: 'Entonet',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  },
  {
    name: 'Kuku',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  },
  {
    name: 'Namelok',
    bahaiCount: 0,
    householdsCount: 0,
    childrenClassesCount: 0,
    juniorYouthGroupsCount: 0,
    studyCirclesCount: 0,
    devotionalMeetingsCount: 0,
    humanResources: [],
    growthHistory: [],
    notes: '',
    followUpItems: []
  }
];
