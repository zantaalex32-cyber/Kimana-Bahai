import React, { useState } from 'react';
import { 
  Settings, Shield, Moon, Sun, Download, Upload, 
  RotateCcw, History, FileJson, Check, AlertTriangle,
  Lock, Info, Smartphone, Monitor, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { isSystemAdminEmail, ADMIN_EMAIL } from '../../services/firebase';
import { InstallAppButton } from '../common/InstallAppButton';
import { LiveSyncIndicator } from '../common/LiveSyncIndicator';

export const SettingsView: React.FC = () => {
  const { 
    userRole, setUserRole, theme, toggleTheme, 
    exportDataJSON, importDataJSON, clearAllData, auditLogs,
    currentUser, setActiveTab
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  const isGuest = !!currentUser?.isAnonymous;
  const isSysAdmin = isSystemAdminEmail(currentUser?.email);

  const roles: { role: UserRole; desc: string }[] = [
    { role: 'Cluster Coordinator', desc: 'Full access to view, edit, add, delete and manage cycles & settings.' },
    { role: 'Administrator', desc: 'System management, role management, and full data access.' },
    { role: 'Activity Coordinator', desc: 'Can manage core activities, people rosters, and local records.' },
    { role: 'Tutor/Animator/Teacher', desc: 'Can record and update assigned groups, study circles, and home visits.' },
    { role: 'Viewer', desc: 'Read-only access for cluster consultation and reporting review.' },
  ];

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kimana-cluster-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Data successfully imported and updated!');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('Failed to import: Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    clearAllData();
    setShowConfirmReset(false);
    setImportStatus('All data and test records have been completely cleared.');
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings & Data Management</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure active user role, theme preferences, local data backup, and system audit logs.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-sm font-medium flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Role Selection with Guest and Admin Enforcement */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Access Role & Permissions</h2>
          </div>
          {isGuest && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
              <Lock className="w-3.5 h-3.5" />
              Guest Locked to Viewer
            </span>
          )}
        </div>

        {isGuest ? (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Guest Access Restricted</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                You are currently browsing as a Guest. Guest mode only allows read-only Viewer access and cannot change roles. 
                To switch roles or access Coordinator tools, please sign in.
              </p>
              <button
                onClick={() => setActiveTab('login')}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Sign In to Change Role ➔
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Select your service role to test permission levels and access restrictions throughout Kimana Cluster Tracker. (Administrator role is strictly reserved for {ADMIN_EMAIL}).
          </p>
        )}

        {roleMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{roleMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {roles.map(({ role, desc }) => {
            const isSelected = userRole === role;
            const isAdminRole = role === 'Administrator';
            const isRoleDisabled = (isGuest && role !== 'Viewer') || (isAdminRole && !isSysAdmin);

            const handleCardClick = () => {
              if (isGuest && role !== 'Viewer') {
                setRoleMessage('Guest access is restricted to Viewer and cannot change roles. Please sign in to switch roles.');
                setTimeout(() => setRoleMessage(null), 5000);
                return;
              }
              if (isAdminRole && !isSysAdmin) {
                setRoleMessage(`Security Notice: Only ${ADMIN_EMAIL} is authorized to select the System Administrator role.`);
                setTimeout(() => setRoleMessage(null), 5000);
                return;
              }
              setUserRole(role);
              setRoleMessage(null);
            };

            return (
              <div
                key={role}
                onClick={handleCardClick}
                className={`p-4 rounded-xl border transition ${
                  isRoleDisabled
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60'
                    : isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 cursor-pointer shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
                }`}
                id={`role-option-${role.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white text-sm">
                  <span className="flex items-center gap-1.5">
                    <span>{role}</span>
                    {isRoleDisabled && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  {isAdminRole && !isSysAdmin && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Restricted to {ADMIN_EMAIL.split('@')[0]}
                    </span>
                  )}
                  {isGuest && role !== 'Viewer' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Guest Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download & Install Application (PWA) Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Download & Install Application (PWA)</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Installable from Browser
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Install Kimana Cluster Tracker directly to your computer desktop, Android phone, or iPhone. It launches full-screen like a native app and works offline with local cached data when in the field.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Install on Home Screen / Desktop</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-click install in Google Chrome & Edge, or Add to Home Screen in Safari.
            </p>
          </div>
          <InstallAppButton variant="compact" label="Download App Now" />
        </div>
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-slate-600" />}
            Interface Visual Theme
          </h2>
          <p className="text-xs text-slate-500 mt-1">Switch between eye-safe Dark mode and Light mode.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition"
          id="toggle-theme-settings"
        >
          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      {/* Backup & Data Sync */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileJson className="w-5 h-5 text-emerald-600" />
          Cloud Real-Time Sync & Data Backup
        </h2>
        <p className="text-xs text-slate-500">
          All data in Kimana Cluster Tracker is synchronized live across all logged-in devices using Cloud Firestore. You can also export offline JSON backups for archival storage.
        </p>

        {/* Live Cloud Sync Status Widget */}
        <LiveSyncIndicator />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition shadow-sm"
            id="export-data-button"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-sm transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Backup JSON</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileImport} 
              className="hidden" 
              id="import-file-input"
            />
          </label>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl font-medium text-sm transition border border-rose-200 dark:border-rose-900"
            id="reset-demo-button"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Data (Clean Slate)</span>
          </button>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Audit Log History
          </h2>
          <span className="text-xs font-medium text-slate-500">{auditLogs.length} Entries</span>
        </div>

        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No logs recorded yet.</p>
          ) : (
            auditLogs.slice(0, 30).map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{log.action}: </span>
                  <span className="text-slate-600 dark:text-slate-400">{log.details}</span>
                  <span className="ml-2 text-[10px] text-emerald-600 font-semibold">({log.userRole})</span>
                </div>
                <span className="text-slate-400 whitespace-nowrap text-[10px] font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear All Data?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This will permanently delete all stored activities, friends, study circles, classes, visits, follow-up items, and test records. The application will be reset to a clean, empty state.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
