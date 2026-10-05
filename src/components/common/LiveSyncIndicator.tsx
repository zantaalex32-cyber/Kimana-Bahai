import React, { useEffect, useState } from 'react';
import { Cloud, CloudCheck, RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { subscribeToSyncStatus } from '../../services/cloudSync';
import { useApp } from '../../context/AppContext';

interface LiveSyncIndicatorProps {
  compact?: boolean;
  className?: string;
}

export const LiveSyncIndicator: React.FC<LiveSyncIndicatorProps> = ({ 
  compact = false,
  className = '' 
}) => {
  const { refreshData } = useApp();
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncedAt: null as string | null,
    error: null as string | null
  });
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSyncStatus((status) => {
      setSyncStatus(status);
    });
    return () => unsub();
  }, []);

  const handleManualRefresh = () => {
    setIsManualRefreshing(true);
    refreshData();
    setTimeout(() => setIsManualRefreshing(false), 800);
  };

  const formatLastSync = (isoString: string | null) => {
    if (!isoString) return 'Connecting...';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (compact) {
    return (
      <div 
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
          syncStatus.error 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300'
            : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
        } ${className}`}
        title={`Cloud Live Sync: Changes sync instantly across all logged-in devices. Last synced: ${formatLastSync(syncStatus.lastSyncedAt)}`}
      >
        <span className="relative flex h-2 w-2">
          {syncStatus.isSyncing || isManualRefreshing ? (
            <span className="animate-spin rounded-full h-2 w-2 border border-emerald-600 border-t-transparent" />
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          )}
        </span>
        <span className="hidden sm:inline">
          {syncStatus.isSyncing || isManualRefreshing ? 'Syncing...' : 'Live Sync'}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 text-xs ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`p-2 rounded-xl shrink-0 ${
          syncStatus.error 
            ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
        }`}>
          {syncStatus.isSyncing || isManualRefreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          ) : syncStatus.error ? (
            <AlertCircle className="w-4 h-4 text-amber-600" />
          ) : (
            <Cloud className="w-4 h-4 text-emerald-600" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <span>{syncStatus.error ? 'Offline / Local Sync' : 'Live Multi-User Cloud Sync'}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {syncStatus.error 
              ? 'Changes cached locally on device' 
              : `Last synced: ${formatLastSync(syncStatus.lastSyncedAt)} • Instant updates`}
          </p>
        </div>
      </div>

      <button
        onClick={handleManualRefresh}
        title="Check for updates from cloud"
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        aria-label="Refresh cloud data"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
