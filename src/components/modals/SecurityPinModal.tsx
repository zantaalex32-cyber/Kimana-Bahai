import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, Unlock, X, Check, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({ isOpen, onClose }) => {
  const { 
    isSecurityUnlocked, verifyAndUnlock, lockSensitiveData, 
    changeSecurityPin, userRole, maskSensitiveData, setMaskSensitiveData 
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!enteredPin) {
      setError('Please enter the security PIN.');
      return;
    }

    const ok = await verifyAndUnlock(enteredPin);
    if (ok) {
      setSuccess('Access granted. Sensitive contact information is now unlocked.');
      setTimeout(() => {
        setSuccess(null);
        setEnteredPin('');
        onClose();
      }, 1000);
    } else {
      setError('Incorrect security PIN. Default master PIN is 1844.');
    }
  };

  const handleLock = () => {
    lockSensitiveData();
    setSuccess('Contact information locked.');
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 700);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPin.length < 4) {
      setError('New PIN must be at least 4 digits/characters.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PIN confirmation does not match.');
      return;
    }

    await changeSecurityPin(newPin);
    setSuccess('Security PIN successfully updated!');
    setIsChangingPin(false);
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => {
      setSuccess(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isSecurityUnlocked 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400' 
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
            }`}>
              {isSecurityUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Contact Data Access Control
              </h3>
              <p className="text-xs text-slate-500">
                {isSecurityUnlocked ? 'Status: Unlocked' : 'Status: Masked & Protected'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        {/* Current Status info */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p>
            Sensitive fields like personal phone numbers, parent phone contacts, and private pastoral notes are shielded to protect community members.
          </p>
          <p className="text-slate-400 text-[11px]">
            Master Default PIN: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">1844</code>
          </p>
        </div>

        {!isSecurityUnlocked ? (
          <form onSubmit={handleUnlock} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Security PIN:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  placeholder="Enter PIN (e.g. 1844)"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Sensitive Contacts</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Contacts are currently fully readable.
              </span>
              <button
                onClick={handleLock}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold"
              >
                Lock Now
              </button>
            </div>

            {/* Quick Toggle for Privacy Mask */}
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-600 dark:text-slate-400">Always mask contacts by default</span>
              <button
                type="button"
                onClick={() => setMaskSensitiveData(!maskSensitiveData)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  maskSensitiveData ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    maskSensitiveData ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Change PIN toggle (Administrator/Coordinator) */}
            {(userRole === 'Administrator' || userRole === 'Cluster Coordinator') && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {!isChangingPin ? (
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Security Master PIN</span>
                  </button>
                ) : (
                  <form onSubmit={handleChangePin} className="space-y-2 mt-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Update Security PIN:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="password"
                        placeholder="New PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <input
                        type="password"
                        placeholder="Confirm PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsChangingPin(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                      >
                        Save PIN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
