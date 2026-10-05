import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Locality, Person, Activity, StudyCircle, ChildrenClass, 
  JuniorYouthGroup, DevotionalMeeting, HomeVisit, ServiceVisit, 
  NewBahai, FollowUpItem, Cycle, AuditLog 
} from '../types';
import { StorageService } from './storage';

export interface ClusterDataListeners {
  onLocalitiesChange?: (items: Locality[]) => void;
  onPeopleChange?: (items: Person[]) => void;
  onActivitiesChange?: (items: Activity[]) => void;
  onStudyCirclesChange?: (items: StudyCircle[]) => void;
  onChildrenClassesChange?: (items: ChildrenClass[]) => void;
  onJuniorYouthGroupsChange?: (items: JuniorYouthGroup[]) => void;
  onDevotionalsChange?: (items: DevotionalMeeting[]) => void;
  onHomeVisitsChange?: (items: HomeVisit[]) => void;
  onServiceVisitsChange?: (items: ServiceVisit[]) => void;
  onNewBahaisChange?: (items: NewBahai[]) => void;
  onFollowUpsChange?: (items: FollowUpItem[]) => void;
  onCyclesChange?: (items: Cycle[]) => void;
  onAuditLogsChange?: (items: AuditLog[]) => void;
  onCurrentCycleIdChange?: (id: string) => void;
  onSyncStatusChange?: (status: { isSyncing: boolean; lastSyncedAt: string | null; error: string | null }) => void;
}

// Track sync status
let currentSyncStatus = {
  isSyncing: false,
  lastSyncedAt: null as string | null,
  error: null as string | null
};

const listenersList: ((status: typeof currentSyncStatus) => void)[] = [];

export function subscribeToSyncStatus(fn: (status: typeof currentSyncStatus) => void): () => void {
  listenersList.push(fn);
  fn(currentSyncStatus);
  return () => {
    const idx = listenersList.indexOf(fn);
    if (idx !== -1) listenersList.splice(idx, 1);
  };
}

function updateSyncStatus(updates: Partial<typeof currentSyncStatus>) {
  currentSyncStatus = { ...currentSyncStatus, ...updates };
  listenersList.forEach(fn => fn(currentSyncStatus));
}

// Collections mapping
export const CLOUD_COLLECTIONS = {
  LOCALITIES: 'localities',
  PEOPLE: 'people',
  ACTIVITIES: 'activities',
  STUDY_CIRCLES: 'studyCircles',
  CHILDREN_CLASSES: 'childrenClasses',
  JUNIOR_YOUTH_GROUPS: 'juniorYouthGroups',
  DEVOTIONALS: 'devotionals',
  HOME_VISITS: 'homeVisits',
  SERVICE_VISITS: 'serviceVisits',
  NEW_BAHAIS: 'newBahais',
  FOLLOW_UPS: 'followUps',
  CYCLES: 'cycles',
  AUDIT_LOGS: 'auditLogs',
  METADATA: 'metadata'
} as const;

/**
 * Real-time subscription to all cluster collections across all logged-in users.
 * When ANY user makes a change, this listener fires on all clients automatically.
 */
export function subscribeToCloudClusterData(callbacks: ClusterDataListeners): () => void {
  const unsubscribers: Unsubscribe[] = [];

  updateSyncStatus({ isSyncing: true, error: null });

  // Helper for subscribing to a specific collection doc in /clusterData/{collectionName}
  const listenToCollection = <T>(
    collectionKey: string, 
    onUpdate?: (items: T[]) => void, 
    localSave?: (items: T[]) => void
  ) => {
    try {
      const docRef = doc(db, 'clusterData', collectionKey);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && Array.isArray(data.items)) {
            const items = data.items as T[];
            if (localSave) {
              localSave(items);
            }
            if (onUpdate) {
              onUpdate(items);
            }
            updateSyncStatus({
              isSyncing: false,
              lastSyncedAt: data.updatedAt || new Date().toISOString(),
              error: null
            });
          }
        } else {
          // Document does not exist yet in cloud.
          updateSyncStatus({ isSyncing: false });
        }
      }, (err) => {
        console.warn(`Firestore listener error on clusterData/${collectionKey}:`, err);
        updateSyncStatus({ isSyncing: false, error: err.message });
      });

      unsubscribers.push(unsub);
    } catch (e: any) {
      console.warn(`Failed to set up listener for clusterData/${collectionKey}:`, e);
      updateSyncStatus({ isSyncing: false, error: e.message });
    }
  };

  // 1. Localities
  listenToCollection<Locality>(
    CLOUD_COLLECTIONS.LOCALITIES,
    callbacks.onLocalitiesChange,
    (items) => StorageService.saveLocalities(items)
  );

  // 2. People
  listenToCollection<Person>(
    CLOUD_COLLECTIONS.PEOPLE,
    callbacks.onPeopleChange,
    (items) => StorageService.savePeople(items)
  );

  // 3. Activities
  listenToCollection<Activity>(
    CLOUD_COLLECTIONS.ACTIVITIES,
    callbacks.onActivitiesChange,
    (items) => StorageService.saveActivities(items)
  );

  // 4. Study Circles
  listenToCollection<StudyCircle>(
    CLOUD_COLLECTIONS.STUDY_CIRCLES,
    callbacks.onStudyCirclesChange,
    (items) => StorageService.saveStudyCircles(items)
  );

  // 5. Children Classes
  listenToCollection<ChildrenClass>(
    CLOUD_COLLECTIONS.CHILDREN_CLASSES,
    callbacks.onChildrenClassesChange,
    (items) => StorageService.saveChildrenClasses(items)
  );

  // 6. Junior Youth Groups
  listenToCollection<JuniorYouthGroup>(
    CLOUD_COLLECTIONS.JUNIOR_YOUTH_GROUPS,
    callbacks.onJuniorYouthGroupsChange,
    (items) => StorageService.saveJuniorYouthGroups(items)
  );

  // 7. Devotionals
  listenToCollection<DevotionalMeeting>(
    CLOUD_COLLECTIONS.DEVOTIONALS,
    callbacks.onDevotionalsChange,
    (items) => StorageService.saveDevotionals(items)
  );

  // 8. Home Visits
  listenToCollection<HomeVisit>(
    CLOUD_COLLECTIONS.HOME_VISITS,
    callbacks.onHomeVisitsChange,
    (items) => StorageService.saveHomeVisits(items)
  );

  // 9. Service Visits
  listenToCollection<ServiceVisit>(
    CLOUD_COLLECTIONS.SERVICE_VISITS,
    callbacks.onServiceVisitsChange,
    (items) => StorageService.saveServiceVisits(items)
  );

  // 10. New Bahá'ís
  listenToCollection<NewBahai>(
    CLOUD_COLLECTIONS.NEW_BAHAIS,
    callbacks.onNewBahaisChange,
    (items) => StorageService.saveNewBahais(items)
  );

  // 11. Follow Ups
  listenToCollection<FollowUpItem>(
    CLOUD_COLLECTIONS.FOLLOW_UPS,
    callbacks.onFollowUpsChange,
    (items) => StorageService.saveFollowUps(items)
  );

  // 12. Cycles
  listenToCollection<Cycle>(
    CLOUD_COLLECTIONS.CYCLES,
    callbacks.onCyclesChange,
    (items) => StorageService.saveCycles(items)
  );

  // 13. Audit Logs
  listenToCollection<AuditLog>(
    CLOUD_COLLECTIONS.AUDIT_LOGS,
    callbacks.onAuditLogsChange,
    (items) => StorageService.saveAuditLogs(items)
  );

  // 14. Metadata (Current Cycle ID)
  try {
    const metaRef = doc(db, 'clusterData', CLOUD_COLLECTIONS.METADATA);
    const unsubMeta = onSnapshot(metaRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.currentCycleId) {
          StorageService.saveCurrentCycleId(data.currentCycleId);
          if (callbacks.onCurrentCycleIdChange) {
            callbacks.onCurrentCycleIdChange(data.currentCycleId);
          }
        }
      }
    }, (err) => {
      console.warn('Metadata listener error:', err);
    });
    unsubscribers.push(unsubMeta);
  } catch (err) {
    console.warn('Metadata subscription error:', err);
  }

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}

/**
 * Push an updated collection to Cloud Firestore.
 * This triggers onSnapshot on all other logged-in user devices immediately!
 */
export async function pushClusterCollectionToCloud<T>(
  collectionKey: string,
  items: T[],
  userEmail?: string | null
): Promise<void> {
  const timestamp = new Date().toISOString();
  updateSyncStatus({ isSyncing: true, error: null });

  try {
    const docRef = doc(db, 'clusterData', collectionKey);
    await setDoc(docRef, {
      items,
      updatedAt: timestamp,
      updatedBy: userEmail || 'anonymous'
    }, { merge: true });

    updateSyncStatus({
      isSyncing: false,
      lastSyncedAt: timestamp,
      error: null
    });
  } catch (error: any) {
    console.warn(`Failed to push clusterData/${collectionKey} to Firestore:`, error);
    // Don't throw fatal error if offline - local storage already holds changes
    updateSyncStatus({
      isSyncing: false,
      error: error.message || 'Offline mode: changes saved locally'
    });
  }
}

/**
 * Push metadata (e.g. current active cycle) to Cloud Firestore
 */
export async function pushMetadataToCloud(metadata: { currentCycleId?: string; [key: string]: any }, userEmail?: string | null): Promise<void> {
  const timestamp = new Date().toISOString();
  try {
    const docRef = doc(db, 'clusterData', CLOUD_COLLECTIONS.METADATA);
    await setDoc(docRef, {
      ...metadata,
      updatedAt: timestamp,
      updatedBy: userEmail || 'anonymous'
    }, { merge: true });
  } catch (error) {
    console.warn('Failed to push metadata to cloud:', error);
  }
}

/**
 * Fetch a single collection once from Cloud Firestore
 */
export async function fetchClusterCollectionFromCloud<T>(collectionKey: string): Promise<T[] | null> {
  try {
    const docRef = doc(db, 'clusterData', collectionKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.items)) {
        return data.items as T[];
      }
    }
    return null;
  } catch (err) {
    console.warn(`Error fetching ${collectionKey} from cloud:`, err);
    return null;
  }
}
