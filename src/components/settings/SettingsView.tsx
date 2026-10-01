import React, { useState } from 'react';
import { 
  Settings, Shield, Moon, Sun, Download, Upload, 
  RotateCcw, History, FileJson, Check, AlertTriangle,
  Lock, Unlock, KeyRound, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    userRole, setUserRole, theme, toggleTheme, 
    exportDataJSON, importDataJSON, resetDemoData, auditLogs,
    isSecurityUnlocked, verifyAndUnlock, lockSensitiveData,
    maskSensitiveData, setMaskSensitiveData, changeSecurityPin 
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Security PIN states
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const roles: { role: UserRole; desc: string; permissions: string[] }[] = [
    { 
      role: 'Administrator', 
      desc: 'Full control over system settings, user roles, security PIN reset, and unmasked data view.',
      permissions: ['Enter & Edit All Data', 'View Protected Contacts', 'Export/Import Backups', 'Manage System PIN']
    },
    { 
      role: 'Cluster Coordinator', 
      desc: 'Central coordination: enter activities, manage cycle goals, run formal 10-section reports.',
      permissions: ['Enter & Batch Add Data', 'Generate & Print Reports', 'Unlock Contact Details', 'Manage Groups']
    },
    { 
      role: 'Activity Coordinator', 
      desc: 'Coordinate core institute activities, manage children, junior youth, and study groups.',
      permissions: ['Batch Add Group Participants', 'Update Group Progress', 'View Local Rosters']
    },
    { 
      role: 'Tutor/Animator/Teacher', 
      desc: 'Record and update assigned classes, study circles, home visits, and group attendance.',
      permissions: ['Update Assigned Sessions', 'Record Attendance', 'Submit Follow-ups']
    },
    { 
      role: 'Viewer', 
      desc: 'Read-only access for cluster reflection meetings, community consultation, and review.',
      permissions: ['Read-only View', 'View Summary Reports', 'No Editing Permissions']
    },
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
    resetDemoData();
    setShowConfirmReset(false);
    setImportStatus('App reset to initial Kimana Cluster demo state.');
    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);
    if (newPin.length < 4) {
      setPinMessage('Error: PIN must be at least 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage('Error: PINs do not match.');
      return;
    }

    await changeSecurityPin(newPin);
    setPinMessage('Success: Master PIN updated.');
    setNewPin('');
    setConfirmPin('');
    setPinChangeOpen(false);
    setTimeout(() => setPinMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings & Access Control</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Role-based access permissions, contact data protection, theme preferences, and offline data backups.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-sm font-medium flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {pinMessage && (
        <div className="p-4 rounded-xl bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800 text-sm font-medium flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <span>{pinMessage}</span>
        </div>
      )}

      {/* Role-Based Access Control Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Access Control</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            Current: {userRole}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Select an active authorization role to simulate data entry, reporting, and review capabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {roles.map(({ role, desc, permissions }) => {
            const isSelected = userRole === role;
            return (
              <div
                key={role}
                onClick={() => setUserRole(role)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                id={`role-option-${role.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div>
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white text-sm">
                    <span>{role}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1">
                  {permissions.map((p, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensitive Contact Information Security & PIN */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sensitive Contact Privacy Protection
            </h2>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isSecurityUnlocked
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            {isSecurityUnlocked ? 'Contacts Unlocked' : 'Contacts Masked'}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Personal telephone numbers, parent contacts, and pastoral notes are shielded from unauthorized viewers.
          Default Master PIN: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">1844</code>
        </p>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Default Masking Mode
            </span>
            <p className="text-xs text-slate-500">
              When enabled, contacts show as <code>Protected (••••)</code> unless unlocked with the security PIN.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => isSecurityUnlocked ? lockSensitiveData() : verifyAndUnlock('1844')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isSecurityUnlocked
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSecurityUnlocked ? 'Lock Now' : 'Quick Unlock (1844)'}
            </button>
          </div>
        </div>

        {/* Change Master PIN Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          {!pinChangeOpen ? (
            <button
              onClick={() => setPinChangeOpen(true)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>Configure Security Master PIN</span>
            </button>
          ) : (
            <form onSubmit={handleSaveNewPin} className="space-y-3 max-w-sm pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Update Master PIN (Min. 4 characters):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  required
                  placeholder="New PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
                <input
                  type="password"
                  required
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinChangeOpen(false)}
                  className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save PIN
                </button>
              </div>
            </form>
          )}
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
          Offline Data Backup & Synchronization
        </h2>
        <p className="text-xs text-slate-500">
          All Kimana Cluster data is saved locally on your device. Export JSON backups to keep data safe or transfer to other cluster coordinators.
        </p>

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
            <span>Reset Demo Data</span>
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Demo Data?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This will overwrite all current changes and restore the initial sample dataset for Kimana Cluster.
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
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
