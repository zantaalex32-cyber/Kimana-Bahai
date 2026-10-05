import React from 'react';
import { 
  Download, X, CheckCircle2, Smartphone, Monitor, Share2, 
  PlusSquare, ArrowDownToLine, WifiOff, Zap, Shield, Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { AppLogo } from './AppLogo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, browserType, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        id="install-modal-backdrop"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-8">
        
        {/* Header with App Logo Banner */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <AppLogo size="md" showText={false} />
            <div>
              <h3 className="text-lg font-bold tracking-tight">Download & Install App</h3>
              <p className="text-xs text-slate-300">Kimana Cluster Tracker • Progressive Web App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
            id="close-install-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Status banner */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  Already Downloaded & Installed!
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
                  You are currently running the app in standalone mode. It is installed on your device with offline support.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Direct 1-Click Install Button if browser supports beforeinstallprompt */}
              {isInstallable && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Instant 1-Click Installation Ready</span>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    id="pwa-modal-install-btn"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download App to Device</span>
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Installs directly to your desktop or mobile home screen with zero storage overhead.
                  </p>
                </div>
              )}

              {/* Browser-Specific Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  How to Download from Your Browser
                </h4>

                {/* iOS Safari Guide */}
                {(isIOS || browserType === 'safari') && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Apple Safari (iPhone / iPad / Mac)</span>
                    </div>
                    <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                      <li>
                        Tap the <strong className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white"><Share2 className="w-3.5 h-3.5 inline text-blue-500" /> Share button</strong> in the Safari toolbar (bottom on iPhone, top on iPad/Mac).
                      </li>
                      <li>
                        Scroll down and tap <strong className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white"><PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" /> Add to Home Screen</strong> (or <em>"Add to Dock"</em> on Mac).
                      </li>
                      <li>
                        Tap <strong>Add</strong> in the top right. The Kimana Cluster Tracker icon will appear on your device's home screen!
                      </li>
                    </ol>
                  </div>
                )}

                {/* Google Chrome & Edge Guide */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <Monitor className="w-4 h-4 text-emerald-600" />
                    <span>Google Chrome & Microsoft Edge (Computer / Android)</span>
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                    <li>
                      Look at the right side of the browser address bar (URL bar) for the <strong className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white"><ArrowDownToLine className="w-3.5 h-3.5 inline text-emerald-600" /> Install / Download icon</strong>.
                    </li>
                    <li>
                      Or click the <strong>3 vertical dots (⋮)</strong> menu in the top-right corner of Chrome or Edge.
                    </li>
                    <li>
                      Select <strong>"Install Kimana Cluster Tracker"</strong> (or <em>"Add to Home screen"</em> / <em>"Install App"</em>).
                    </li>
                  </ol>
                </div>
              </div>
            </>
          )}

          {/* Benefits of Downloading */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Why download this app?
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Works Offline</span>
                  <span className="text-[10px] text-slate-500">Record visits & activities without internet.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Instant Loading</span>
                  <span className="text-[10px] text-slate-500">Fast performance with zero waiting time.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Secure & Private</span>
                  <span className="text-[10px] text-slate-500">Encrypted PIN lock and local storage.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Kimana Cluster PWA</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
