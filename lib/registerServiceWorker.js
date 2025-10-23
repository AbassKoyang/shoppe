export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.log('Attempting to register service worker...');
  
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((reg) => console.log('✅ Service Worker registered:', reg))
        .catch((err) => console.error('❌ SW registration failed:', err));
    } else {
      console.warn('Service workers not supported in this browser');
    }
  }
  