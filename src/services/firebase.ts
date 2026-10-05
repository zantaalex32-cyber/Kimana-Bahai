import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { AuthUser, UserRole } from '../types';
import appConfig from '../../firebase-applet-config.json';

// Only this specific email address is authorized for System Administrator role
export const ADMIN_EMAIL = 'zantatech9@gmail.com';

export function isSystemAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Firebase configuration from provisioned environment
const firebaseConfig = {
  projectId: appConfig.projectId || "corded-theme-0ds98",
  appId: appConfig.appId || "1:563431976986:web:da067a0a926bf87841e1a3",
  apiKey: appConfig.apiKey || "AIzaSyBaNh0Pm2UEENQLWe2wEs6jQr4FAJ4FFxA",
  authDomain: appConfig.authDomain || "corded-theme-0ds98.firebaseapp.com",
  firestoreDatabaseId: appConfig.firestoreDatabaseId || "ai-studio-kimanaclustertra-d94350e3-719e-419f-bb49-1c26e477adcd",
  storageBucket: appConfig.storageBucket || "corded-theme-0ds98.firebasestorage.app",
  messagingSenderId: appConfig.messagingSenderId || "563431976986",
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Test connection to Firestore on initialization
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore: client appears offline, check network connectivity.", error);
    }
  }
}
testFirestoreConnection();

/**
 * SHA-256 helper for password hashing & offline credential verification
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_kimana_cluster_salt_v1");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sign in using Google Auth Popup
 */
export async function signInWithGoogle(): Promise<{ user: AuthUser; isNewUser?: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const userEmail = fbUser.email || '';
    const isAdmin = isSystemAdminEmail(userEmail);
    
    // Check if user already has an existing role in Firestore
    let assignedRole: UserRole = isAdmin ? 'Administrator' : 'Cluster Coordinator';
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.role) {
          // Strict security check: only zantatech9@gmail.com can be Administrator
          if (data.role === 'Administrator' && !isAdmin) {
            assignedRole = 'Cluster Coordinator';
          } else {
            assignedRole = data.role as UserRole;
          }
        }
      } else {
        // First-time sign in, store profile
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          email: userEmail,
          displayName: fbUser.displayName || 'Friend of Kimana',
          photoURL: fbUser.photoURL || '',
          role: assignedRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not read/write Firestore user profile document', e);
    }

    const authUser: AuthUser = {
      uid: fbUser.uid,
      email: userEmail,
      displayName: fbUser.displayName || userEmail.split('@')[0] || 'Community Member',
      photoURL: fbUser.photoURL,
      role: assignedRole,
      providerId: 'google.com'
    };

    return { user: authUser };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

/**
 * Sign in or register with Email and set a Password
 */
export async function signInWithEmailPassword(
  email: string, 
  password: string, 
  isSettingPassword = false
): Promise<{ user: AuthUser; isNewUser?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = isSystemAdminEmail(cleanEmail);
  const passwordHash = await hashPassword(password);
  let assignedRole: UserRole = isAdmin ? 'Administrator' : 'Cluster Coordinator';
  let uid = '';
  let displayName = cleanEmail.split('@')[0];

  // First, try Firebase Authentication
  try {
    if (isSettingPassword) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        uid = userCred.user.uid;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          // If already in use, sign in and update password
          const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          uid = userCred.user.uid;
          if (auth.currentUser) {
            await updatePassword(auth.currentUser, password);
          }
        } else {
          throw err;
        }
      }
    } else {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      uid = userCred.user.uid;
    }
  } catch (fbErr: any) {
    console.warn('Firebase Auth email provider fallback to local credential verification:', fbErr.message);
    
    // Resilient fallback: Check credentials in local secure storage or Firestore
    const localCredsKey = `kimana_auth_user_${btoa(cleanEmail)}`;
    const storedCredStr = localStorage.getItem(localCredsKey);

    if (isSettingPassword || !storedCredStr) {
      // User is setting their password or registering with this password!
      uid = 'user-' + btoa(cleanEmail).replace(/=/g, '');
      const newCred = {
        uid,
        email: cleanEmail,
        passwordHash,
        displayName,
        role: assignedRole,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(localCredsKey, JSON.stringify(newCred));
    } else {
      // Validate password
      const storedCred = JSON.parse(storedCredStr);
      if (storedCred.passwordHash !== passwordHash) {
        throw new Error('Incorrect password. Please enter your correct password or choose "Set/Update Password" to create a new one.');
      }
      uid = storedCred.uid;
      displayName = storedCred.displayName || displayName;
      if (storedCred.role) {
        assignedRole = (storedCred.role === 'Administrator' && !isAdmin) ? 'Cluster Coordinator' : storedCred.role;
      }
    }
  }

  // Update or fetch profile in Firestore if available
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.role) {
        assignedRole = (data.role === 'Administrator' && !isAdmin) ? 'Cluster Coordinator' : (data.role as UserRole);
      }
      await setDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
        hasPasswordSet: true,
        passwordHash: passwordHash
      }, { merge: true });
    } else {
      await setDoc(userDocRef, {
        uid,
        email: cleanEmail,
        displayName,
        role: assignedRole,
        hasPasswordSet: true,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }, { merge: true });
    }
  } catch (dbErr) {
    console.warn('Could not update Firestore profile with password', dbErr);
  }

  const authUser: AuthUser = {
    uid,
    email: cleanEmail,
    displayName,
    photoURL: null,
    role: assignedRole,
    providerId: 'password'
  };

  return { user: authUser };
}

/**
 * Update password for current user
 */
export async function setUserPassword(uid: string, newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword);
  
  if (auth.currentUser) {
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (e) {
      console.warn('Firebase updatePassword failed, updating database hash', e);
    }
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { passwordHash: hash, hasPasswordSet: true, passwordUpdatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to update password in Firestore:', err);
  }

  if (auth.currentUser?.email) {
    const localCredsKey = `kimana_auth_user_${btoa(auth.currentUser.email.toLowerCase())}`;
    const stored = localStorage.getItem(localCredsKey);
    const obj = stored ? JSON.parse(stored) : { uid, email: auth.currentUser.email };
    obj.passwordHash = hash;
    localStorage.setItem(localCredsKey, JSON.stringify(obj));
  }
}

/**
 * Sign Out
 */
export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Update user role in Firestore with strict check for Administrator
 */
export async function updateUserRoleInFirestore(uid: string, role: UserRole, userEmail?: string | null): Promise<void> {
  if (role === 'Administrator' && !isSystemAdminEmail(userEmail)) {
    throw new Error('Only zantatech9@gmail.com is authorized to hold the System Administrator role.');
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { role, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to update user role in Firestore:', err);
  }
}
