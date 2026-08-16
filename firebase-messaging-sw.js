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

const DEFAULT_ICON = 'https://clabsi-guard-pro.vercel.app/icon-192.png';

function showClabsiNotif(d){
  d = d || {};
  const title = d.title || 'CLABSI Guard Pro';
  const iconUrl = d.icon || DEFAULT_ICON;
  return self.registration.showNotification(title, {
    body: d.body || '',
    icon: iconUrl,
    badge: iconUrl,
    tag: d.tag || 'clabsi-reminder',
    renotify: true,
    requireInteraction: false,
    data: { url: d.url || 'https://clabsi-guard-pro.vercel.app/' }
  });
}

// ── Handler 1: event 'push' ASLI (paling pasti jalan) ──────
// Ni trigger utk SEMUA push, termasuk test dari DevTools.
self.addEventListener('push', function(event){
  let d = {};
  try{
    const json = event.data ? event.data.json() : {};
    // FCM data-only → payload.data; kadang di bawah .data.data
    d = json.data || json.notification || json || {};
  }catch(e){
    try{ d = { body: event.data ? event.data.text() : '' }; }catch(_){}
  }
  event.waitUntil(showClabsiNotif(d));
});

// ── Handler 2: Firebase onBackgroundMessage (sokongan) ─────
messaging.onBackgroundMessage(function(payload){
  const d = payload.data || (payload.notification || {});
  return showClabsiNotif(d);
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
