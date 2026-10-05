import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type BrowserType = 'chrome' | 'edge' | 'safari' | 'firefox' | 'android' | 'ios' | 'other';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [browserType, setBrowserType] = useState<BrowserType>('other');

  useEffect(() => {
    // 1. Detect standalone mode (already installed & running as standalone PWA)
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    // 2. Detect device & browser type
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      setBrowserType('ios');
    } else if (/android/.test(ua)) {
      setBrowserType('android');
    } else if (/edg\//.test(ua)) {
      setBrowserType('edge');
    } else if (/chrome\//.test(ua) && !/edg\//.test(ua)) {
      setBrowserType('chrome');
    } else if (/safari/.test(ua) && !/chrome\//.test(ua)) {
      setBrowserType('safari');
    } else if (/firefox/.test(ua)) {
      setBrowserType('firefox');
    } else {
      setBrowserType('other');
    }

    // 3. Listen for browser install prompt event (Chromium, Chrome, Edge, Brave, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Install prompt error:', err);
      return false;
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    browserType,
    install,
    deferredPrompt,
  };
}
