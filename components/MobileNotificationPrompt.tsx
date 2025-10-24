'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function MobileNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(iOS);
    setIsStandalone(standalone);

    // Show prompt if on mobile and not installed
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && !standalone && !localStorage.getItem('pwa-prompt-dismissed')) {
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-4 bg-white border-2 border-blue-600 rounded-lg shadow-lg p-4 z-50">
      <button 
        onClick={dismissPrompt}
        className="absolute top-2 right-2"
      >
        <X className="size-4" />
      </button>

      <h3 className="font-bold text-lg mb-2">
        📱 Get Notifications on Mobile
      </h3>

      {isIOS ? (
        <div className="text-sm space-y-2">
          <p>To receive notifications on iOS:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Tap the Share button <span className="font-mono">⎙</span></li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the top right</li>
            <li>Open the app from your home screen</li>
          </ol>
          <p className="text-xs text-gray-600 mt-2">
            Note: iOS Safari doesn't support web push notifications in the browser.
          </p>
        </div>
      ) : (
        <div className="text-sm space-y-2">
          <p>To receive notifications on Android:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Tap the menu (⋮) in your browser</li>
            <li>Select "Add to Home screen" or "Install app"</li>
            <li>Tap "Add" or "Install"</li>
            <li>Open the app from your home screen</li>
          </ol>
        </div>
      )}

      <Button 
        onClick={dismissPrompt}
        className="w-full mt-3"
        variant="outline"
      >
        Got it
      </Button>
    </div>
  );
}