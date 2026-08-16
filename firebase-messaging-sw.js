/* ============================================================
   CLABSI Guard Pro — Firebase Cloud Messaging Service Worker
   ------------------------------------------------------------
   LETAK FAIL INI DI ROOT PROJEK (sama level dgn clabsi.html /
   index.html). Contoh: clbsiguard.vercel.app/firebase-messaging-sw.js
   JANGAN letak dalam subfolder — SW mesti di root supaya boleh
   handle push utk seluruh domain.
   ============================================================ */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyD5HCR6QuMS_JSHxRX42Cee9smCWvtpgU8",
  authDomain:"clabsi-htpn.firebaseapp.com",
  projectId:"clabsi-htpn",
  storageBucket:"clabsi-htpn.firebasestorage.app",
  messagingSenderId:"945530986459",
  appId:"1:945530986459:web:fcfe8ad2629cbe9469d1fe"
});

const messaging = firebase.messaging();

// ── Push masa app TUTUP / background ──────────────────────
// Nota: kalau GAS hantar payload jenis "notification", browser
// auto-papar notif. Handler ni utk payload jenis "data" supaya
// kita boleh kawal ikon, badge, klik, dsb.
messaging.onBackgroundMessage(function(payload){
  const d = payload.data || {};
  const title = d.title || (payload.notification && payload.notification.title) || 'CLABSI Guard Pro';
  const opts = {
    body: d.body || (payload.notification && payload.notification.body) || '',
    icon: d.icon || '/icon-192.png',
    badge: '/badge-72.png',
    tag: d.tag || 'clabsi-reminder',   // tag sama = ganti notif lama, tak bertimbun
    renotify: true,
    requireInteraction: false,
    data: { url: d.url || '/' }
  };
  return self.registration.showNotification(title, opts);
});

// ── Bila user tekan notif ─────────────────────────────────
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
      for (const c of list){ if (c.url.indexOf(url) !== -1 && 'focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
