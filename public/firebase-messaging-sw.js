importScripts(
  'https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js'
 );
 importScripts(
  'https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js'
 );

 
 const app = firebase.initializeApp({
  apiKey: "AIzaSyCGmsqJ9cCaZBr8YCpWmmynrviXp2ZEd2o",
  authDomain: "shoppee-6890c.firebaseapp.com",
  projectId: "shoppee-6890c",
  messagingSenderId: "1046437634138",
  appId: "1:1046437634138:web:b03524e34da92b91427863",
});
 const messaging = firebase.messaging();
 
 messaging.onBackgroundMessage((payload) => {
  console.log(
   '[firebase-messaging-sw.js] Received background message ',
   payload
  );
  const link = payload.data?.fcmOptions?.link ?? payload.data?.url; // Prioritize fcmOptions link
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
   body: payload.notification.body,
   data: { url: link },
   icon: '/icon-512.png',
   badge: '/icon-512.png',
   requireInteraction: true,
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Dismiss',
      }
    ],

  };
  self.registration.showNotification(notificationTitle, notificationOptions);
 });
 
 self.addEventListener('notificationclick', (event) => {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();
  // This checks if the client is already open and if it is, it focuses on the tab.
  // tab with the URL passed in the notification payload
  event.waitUntil(
   clients
    // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(function (clientList) {
     const url = event.notification.data.url;
     if (!url) return;
     // will focus on the existing tab i.e. https://example.com/about
     for (const client of clientList) {
      console.log(client.url);
      if (client.url === url && 'focus' in client) {
       return client.focus();
      }
     }
     if (clients.openWindow) {
      console.log('OPENWINDOW ON CLIENT');
      return clients.openWindow(url);
     }
    })
  );
 });