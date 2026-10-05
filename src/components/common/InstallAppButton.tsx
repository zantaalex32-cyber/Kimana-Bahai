import React, { useState } from 'react';
import { Download, CheckCircle2, ArrowDownToLine } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallAppModal } from './InstallAppModal';

interface InstallAppButtonProps {
  variant?: 'header' | 'sidebar' | 'banner' | 'compact' | 'pill';
  className?: string;
  label?: string;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  variant = 'compact',
  className = '',
  label = 'Download App'
}) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        // If native prompt was dismissed or failed, show guidance modal
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  // If already installed and variant is header, we can show a subtle indicator or hide it
  if (isInstalled && variant === 'header') {
    return null;
  }

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleClick}
          title="Download & Install App to Device for Offline Access"
          id="header-install-app-btn"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-500/30 transition text-xs font-semibold cursor-pointer active:scale-95 ${className}`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">{label}</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-500/20 text-slate-800 dark:text-slate-200 space-y-2 ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Offline App</span>
            </span>
            {isInstalled ? (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Installed
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                PWA
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
            {isInstalled 
              ? 'Running installed standalone PWA.'
              : 'Install on your phone or PC to work offline without internet.'}
          </p>
          <button
            onClick={handleClick}
            id="sidebar-download-app-btn"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalled ? 'App Installed Info' : 'Download / Install'}</span>
          </button>
        </div>
      )}

      {variant === 'pill' && (
        <button
          onClick={handleClick}
          id="pill-download-app-btn"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition active:scale-95 cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={handleClick}
          id="compact-download-app-btn"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{label}</span>
        </button>
      )}

      {/* Guide & Prompt Modal */}
      <InstallAppModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
