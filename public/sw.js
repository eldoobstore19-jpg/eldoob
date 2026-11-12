self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(d.title || 'ELDOOB.DZ', { body: d.body || '', icon: '/assets/logo.svg', badge: '/assets/logo.svg', dir: 'rtl', lang: 'ar', data: { url: d.url || '/' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => l.length ? l[0].focus() : clients.openWindow(e.notification.data.url || '/')));
});
