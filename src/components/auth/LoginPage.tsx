import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, ArrowRight, LogOut, 
  Sparkles, Users, BookOpen, BarChart3, AlertCircle, Info, Lock, 
  KeyRound, Mail, Eye, EyeOff, UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppLogo } from '../common/AppLogo';
import { UserRole } from '../../types';
import { ADMIN_EMAIL, isSystemAdminEmail } from '../../services/firebase';

export const LoginPage: React.FC = () => {
  const { 
    currentUser, 
    loginWithGoogle, 
    loginWithPassword,
    saveUserPassword,
    loginAsGuest,
    logout, 
    userRole, 
    setUserRole, 
    setActiveTab,
    setHasEnteredApp
  } = useApp();

  // Auth Modes & State
  const [authMethod, setAuthMethod] = useState<'google' | 'password'>('google');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Role selection state (defaults to Administrator if zantatech9@gmail.com)
  const isCurrentUserAdmin = isSystemAdminEmail(currentUser?.email);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    isCurrentUserAdmin ? 'Administrator' : (userRole || 'Cluster Coordinator')
  );

  // Post-login password setup state (for Google users wanting to set a password)
  const [postLoginPassword, setPostLoginPassword] = useState('');
  const [postLoginSuccess, setPostLoginSuccess] = useState(false);

  const availableRoles: { 
    role: UserRole; 
    title: string; 
    badge: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    adminOnly?: boolean;
  }[] = [
    {
      role: 'Cluster Coordinator',
      title: 'Cluster Coordinator',
      badge: 'Coordination',
      description: 'Oversees expansion, consolidation cycles, reflection meetings, and cluster milestones.',
      icon: Users
    },
    {
      role: 'Administrator',
      title: 'System Administrator',
      badge: 'Full Access',
      description: 'Manages localities, human resources, audit history, system settings, and exports. (Restricted to zantatech9@gmail.com)',
      icon: Shield,
      adminOnly: true
    },
    {
      role: 'Activity Coordinator',
      title: 'Activity Coordinator',
      badge: 'Institutes',
      description: 'Coordinates core activities: Children\'s Classes, Junior Youth, Study Circles, and Devotionals.',
      icon: Sparkles
    },
    {
      role: 'Tutor/Animator/Teacher',
      title: 'Tutor / Animator / Teacher',
      badge: 'Field Service',
      description: 'Conducts study circles, animates junior youth groups, and teaches children\'s classes.',
      icon: BookOpen
    },
    {
      role: 'Viewer',
      title: 'Community Viewer',
      badge: 'Read-Only',
      description: 'View cluster growth dashboards, activity summaries, and statistical reports.',
      icon: BarChart3
    }
  ];

  // Google Login Handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('The Google sign-in popup was blocked by your browser. Please allow popups or use Email & Password below.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in window was closed before completion. Please try again.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in with Google. You can also sign in or set a password using the Email option.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Login / Setup Handler
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!passwordInput || passwordInput.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (isSettingNewPassword && passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      await loginWithPassword(emailInput.trim(), passwordInput, isSettingNewPassword);
      setSuccessMessage(isSettingNewPassword ? 'Password set successfully! Choose your role below.' : 'Signed in successfully!');
    } catch (err: any) {
      console.error('Password sign-in error:', err);
      setErrorMessage(err.message || 'Failed to sign in. Check your credentials or toggle "Set / Create Password".');
    } finally {
      setLoading(false);
    }
  };

  // Set password post-login (e.g. for Google users)
  const handleSetPostLoginPassword = async () => {
    if (!postLoginPassword || postLoginPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      await saveUserPassword(postLoginPassword);
      setPostLoginSuccess(true);
      setErrorMessage(null);
      setTimeout(() => setPostLoginSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestQuickAccess = () => {
    loginAsGuest();
  };

  const handleConfirmRoleAndEnter = () => {
    // Security verification
    if (selectedRole === 'Administrator' && !isSystemAdminEmail(currentUser?.email)) {
      setErrorMessage(`Only ${ADMIN_EMAIL} is authorized to hold the System Administrator role.`);
      return;
    }
    setUserRole(selectedRole);
    setHasEnteredApp(true);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Top Header Banner with Logo */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white text-center flex flex-col items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <AppLogo size="xl" showText={false} className="mb-4" />
          
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kimana Cluster Tracker
            </h1>
          </div>
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            Bahá'í Community • Kajiado South, Kenya
          </span>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {currentUser 
              ? 'Login successful! Please choose your service role to enter the tracker.' 
              : 'Sign in to access community growth tracking and institute coordination for the Kimana Cluster.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 2: USER IS LOGGED IN -> CHOOSE ROLE AFTER LOGIN SUCCESS */}
          {currentUser ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Logged in User Identity Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                      {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white truncate text-sm">
                        {currentUser.displayName || 'Authorized User'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email || 'Guest User (Read-Only)'}
                    </p>
                    {isSystemAdminEmail(currentUser.email) && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                        <Shield className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                        Verified System Administrator
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out or switch account"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Switch</span>
                </button>
              </div>

              {/* Set Account Password Option */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    Account Password Setup
                  </span>
                  {postLoginSuccess && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Set/update account password"
                    value={postLoginPassword}
                    onChange={(e) => setPostLoginPassword(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSetPostLoginPassword}
                    disabled={loading || !postLoginPassword}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    Set Password
                  </button>
                </div>
              </div>

              {/* Role Selection Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Choose Your Service Role</span>
                  </h2>
                  {currentUser.isAnonymous && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Guest Locked to Viewer
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.isAnonymous 
                    ? 'Guest sessions are restricted to read-only Viewer access and cannot change roles. Sign in to access Coordinator or Administrator roles.' 
                    : 'Select your role for this session. (Administrator role is strictly reserved for zantatech9@gmail.com).'}
                </p>
              </div>

              {/* Available Role Options with Strict Admin & Guest Enforcement */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {availableRoles.map(item => {
                  const Icon = item.icon;
                  const isGuest = !!currentUser.isAnonymous;
                  const isAdminRole = item.role === 'Administrator';
                  const isUserAuthorizedAdmin = isSystemAdminEmail(currentUser?.email);
                  
                  // Role is locked if:
                  // 1) Guest and not Viewer
                  // 2) Administrator and email is not zantatech9@gmail.com
                  const isRoleLocked = (isGuest && item.role !== 'Viewer') || (isAdminRole && !isUserAuthorizedAdmin);
                  const isSelected = (isGuest ? 'Viewer' : selectedRole) === item.role;

                  return (
                    <div
                      key={item.role}
                      onClick={() => {
                        if (!isRoleLocked) {
                          setSelectedRole(item.role);
                          setErrorMessage(null);
                        } else if (isAdminRole && !isUserAuthorizedAdmin) {
                          setErrorMessage(`Security Notice: Only ${ADMIN_EMAIL} is authorized to sign in as the System Administrator.`);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-xs transition flex items-start gap-3 ${
                        isRoleLocked 
                          ? 'opacity-45 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60' 
                          : isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-sm cursor-pointer'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 cursor-pointer'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {isRoleLocked && (
                              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected
                              ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                              : isRoleLocked
                              ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {isAdminRole && !isUserAuthorizedAdmin 
                              ? 'Restricted to zantatech9' 
                              : isGuest && item.role !== 'Viewer'
                              ? 'Guest Locked'
                              : item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {isSelected && !isRoleLocked && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-1 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Enter Button */}
              <button
                onClick={handleConfirmRoleAndEnter}
                id="confirm-role-button"
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition active:scale-[0.99] cursor-pointer"
              >
                <span>{currentUser.isAnonymous ? 'Enter Tracker as Guest Viewer' : 'Confirm Role & Enter Tracker'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            /* STEP 1: WELCOME & LOGIN (GOOGLE OR EMAIL/PASSWORD WITH PASSWORD SETUP) */
            <div className="space-y-6">
              
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Welcome to the Kimana Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authenticate with Google or enter your email and set a password.
                </p>
              </div>

              {/* Auth Method Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('google'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-xl transition cursor-pointer ${
                    authMethod === 'google'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Google Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('password'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMethod === 'password'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Notice</p>
                    <p className="mt-0.5 text-rose-700 dark:text-rose-400">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Google Sign-In Method */}
              {authMethod === 'google' && (
                <div className="space-y-4 pt-1">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    id="google-signin-button"
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-white font-bold text-sm shadow-sm hover:shadow-md transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                    ) : (
                      /* Official Google 4-Color 'G' Logo */
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>{loading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    You can set an account password right after signing in.
                  </p>
                </div>
              )}

              {/* Email & Password Sign-In / Password Setup Method */}
              {authMethod === 'password' && (
                <form onSubmit={handleEmailPasswordSignIn} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. zantatech9@gmail.com or name@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isSettingNewPassword ? 'Set New Password' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingNewPassword(!isSettingNewPassword);
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        {isSettingNewPassword ? 'I already have a password' : '+ Set / Create a password'}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={isSettingNewPassword ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isSettingNewPassword && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter password to confirm"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Setting a password saves credentials for this email.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>{isSettingNewPassword ? 'Set Password & Continue' : 'Sign In with Password'}</span>
                  </button>
                </form>
              )}

              {/* Instant Access Option */}
              <div className="pt-2 text-center">
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGuestQuickAccess}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Continue as Guest (Read-Only Viewer)</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Only allows guest view. Role cannot be changed without signing in.
                </p>
              </div>

              {/* Informative Security Notes */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Governance & Administrator Policy</span>
                </p>
                <p>
                  Only <span className="font-bold text-slate-800 dark:text-slate-200">zantatech9@gmail.com</span> is authorized for System Administrator access. You can set or manage your account password during sign-in.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Kimana Cluster • Kenya</span>
          {currentUser && (
            <button 
              onClick={handleConfirmRoleAndEnter} 
              className="text-emerald-600 hover:underline font-medium"
            >
              Enter Dashboard ➔
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
