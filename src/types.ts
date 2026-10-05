export type UserRole = 
  | 'Administrator'
  | 'Cluster Coordinator'
  | 'Activity Coordinator'
  | 'Tutor/Animator/Teacher'
  | 'Viewer';

export type ActivityType = 
  | 'Study Circle'
  | 'Children\'s Class'
  | 'Junior Youth Group'
  | 'Devotional Meeting'
  | 'Home Visit'
  | 'Teaching Activity'
  | 'Community Meeting'
  | 'Feast'
  | 'Training'
  | 'Conference'
  | 'Campaign'
  | 'Reflection Meeting'
  | 'Other';

export type FollowUpStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type FollowUpPriority = 'High' | 'Medium' | 'Low';

export type ServiceRole = 
  | 'Coordinator'
  | 'Tutor'
  | 'Animator'
  | 'Children\'s Class Teacher'
  | 'Teacher'
  | 'Host'
  | 'Volunteer'
  | 'Participant'
  | 'Other';

export interface Locality {
  id: string;
  name: string;
  bahaiCount: number;
  householdsCount: number;
  childrenClassesCount: number;
  juniorYouthGroupsCount: number;
  studyCirclesCount: number;
  devotionalMeetingsCount: number;
  humanResources: string[]; // names or Person IDs serving here
  growthHistory: { year: number; month: string; count: number }[];
  notes?: string;
  followUpItems?: string[];
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  localityId: string;
  localityName: string;
  phone?: string;
  email?: string;
  role: ServiceRole;
  status: 'Active' | 'Inactive' | 'Moved';
  activitiesServed: string[];
  groupsServed: string[];
  isSensitive?: boolean;
  notes?: string;
  dateAdded: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  localityId: string;
  localityName: string;
  venue: string;
  personResponsible: string;
  expectedParticipants: number;
  actualAttendance: number;
  description?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  followUpStatus?: FollowUpStatus;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  cycleId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyCircle {
  id: string;
  groupName: string;
  bookMaterial: string; // e.g. "Ruhi Book 1 - Reflection on the Life of the Spirit"
  tutorName: string;
  tutorId?: string;
  localityId: string;
  localityName: string;
  meetingLocation: string;
  meetingSchedule: string; // e.g., "Saturdays 3:00 PM"
  startDate: string;
  progress: string; // e.g., "Unit 2, Section 5"
  numberOfMeetings: number;
  lastMeetingDate?: string;
  nextMeetingDate?: string;
  isActive: boolean;
  isExternal?: boolean; // Attending outside Kimana
  externalLocation?: string; // e.g., "Nairobi / Machakos"
  participants: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildrenClass {
  id: string;
  className: string;
  localityId: string;
  localityName: string;
  teacherName: string;
  teacherId?: string;
  ageGroupLevel: string; // e.g., "Grade 1 (Ages 5-7)"
  meetingSchedule: string;
  numberOfSessions: number;
  averageAttendance: number;
  childrenNames: string[];
  lastSessionDate?: string;
  nextSessionDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JuniorYouthGroup {
  id: string;
  groupName: string;
  localityId: string;
  localityName: string;
  animatorName: string;
  animatorId?: string;
  currentMaterial: string; // e.g. "Breezes of Confirmation"
  progress: string; // e.g. "Chapter 4"
  meetingSchedule: string;
  numberOfMeetings: number;
  averageAttendance: number;
  members: string[];
  serviceProjects: string[];
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DevotionalMeeting {
  id: string;
  title: string;
  hostName: string;
  localityId: string;
  localityName: string;
  date: string;
  time?: string;
  themeTopic: string;
  participantsCount: number;
  participantNames?: string[];
  description?: string;
  followUpNeeded?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeVisit {
  id: string;
  familyOrPersonVisited: string;
  localityId: string;
  localityName: string;
  visitors: string[]; // names of visitors
  date: string;
  purpose: string;
  outcome?: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  isSensitive?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceVisit {
  id: string;
  direction: 'Outbound' | 'Inbound'; // Outbound from Kimana / Inbound to Kimana
  personName: string;
  origin: string; // e.g., "Kimana - Isinet" or "Kajiado Cluster"
  destination: string; // e.g., "Rombo Locality" or "Nairobi Cluster"
  purpose: string; // e.g., "Study Circle Facilitation", "Teaching Campaign"
  activityOrGroup: string;
  responsiblePerson: string;
  startDate: string;
  endDate?: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewBahai {
  id: string;
  name: string;
  localityId: string;
  localityName: string;
  dateRegistered: string; // YYYY-MM-DD
  connectionChannel: string; // e.g., "Home Visit", "Teaching Campaign", "Devotional", "Parent of JY"
  accompanyingFriend?: string;
  followUpStatus: 'Needs Initial Visit' | 'Enrolled in Ruhi B1' | 'Attending Devotionals' | 'Well Integrated';
  activitiesParticipating: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpItem {
  id: string;
  title: string;
  responsiblePerson: string;
  relatedEntity: string; // e.g. "Activity: Kimana Youth Conference" or "Home Visit: Naserian Family"
  localityName: string;
  dueDate: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  name: string; // e.g. "Cycle 14 - Q3 2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  goals: {
    studyCirclesGoal: number;
    childrenClassesGoal: number;
    juniorYouthGroupsGoal: number;
    devotionalsGoal: number;
    newBahaisGoal: number;
  };
  reflectionDate?: string;
  reflectionNotes?: string;
  status: 'Planning' | 'Active' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface FriendComingIn {
  id: string;
  fullName: string;
  age?: number;
  gender?: 'Female' | 'Male' | 'Other';
  contact: string;
  localityId: string;
  localityName: string;
  neighborhood?: string;
  date: string; // YYYY-MM-DD
  howReached: string; // e.g. "Teaching Campaign", "Home Visit", "Family/Friend Introduction", "Devotional Meeting", "Youth Activity", "Other"
  introducedBy: string; // Person or family who introduced them
  activitiesParticipating: string[];
  currentStatus: 'Needs Initial Visit' | 'Enrolled in Ruhi B1' | 'Attending Devotionals' | 'Well Integrated' | 'Children Class Parent';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FriendGoingOut {
  id: string;
  fullName: string;
  age?: number;
  contact: string;
  previousLocalityId: string;
  previousLocalityName: string;
  previousNeighborhood?: string;
  newLocation: string; // e.g. "Nairobi Cluster", "Machakos", "Loitokitok", "Abroad"
  date: string; // YYYY-MM-DD
  reason: 'Relocation' | 'Pioneer' | 'University/Education' | 'Employment/Work' | 'Marriage' | 'Family Reasons' | 'Other';
  activitiesPreviouslyInvolved: string[]; // e.g. ["Children Class Teacher", "Ruhi Book 4 Participant"]
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantRecord {
  id: string;
  name: string;
  age?: number;
  gender?: 'Female' | 'Male' | 'Other';
  parentName?: string;
  parentContact?: string;
  contact?: string;
  neighborhood?: string;
  localityName?: string;
  classOrGrade?: string;
  bookOrCourse?: string;
  groupName?: string;
  dateJoined?: string;
  status: 'Active' | 'New' | 'Returning' | 'Inactive';
  notes?: string;
}

export interface ReportPlan {
  id: string;
  cycleId: string;
  category: 'Teaching & Expansion' | 'Institute & Study Circles' | 'Children & Junior Youth' | 'Devotional & Feasts';
  goalDescription: string;
  targetDate: string;
  responsiblePerson: string;
  status: 'Draft' | 'Approved' | 'In Action' | 'Completed';
}

export interface ReportChallenge {
  id: string;
  cycleId: string;
  area: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  proposedAction: string;
}

export interface ReportPioneer {
  id: string;
  name: string;
  type: 'Inbound Pioneer' | 'Outbound Pioneer' | 'Short-Term Travel Teacher' | 'Long-Term Pioneer';
  origin: string;
  destination: string;
  period: string;
  focusArea: string;
  contact: string;
  status: 'Active' | 'Completed' | 'Planned';
}

export type NavigationTab = 
  | 'dashboard'
  | 'localities'
  | 'people'
  | 'activities'
  | 'studycircles'
  | 'childrensclasses'
  | 'junioryouth'
  | 'devotionals'
  | 'homevisits'
  | 'friendscomingin'
  | 'friendsgoingout'
  | 'visits'
  | 'newbahais'
  | 'calendar'
  | 'followups'
  | 'reports'
  | 'cycles'
  | 'settings'
  | 'login';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  providerId?: string;
  isAnonymous?: boolean;
}

