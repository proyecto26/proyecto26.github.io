importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  initializeWorkbox();
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Handle Push Notifications
self.addEventListener('push', event => {
  const message = event.data.text()
  console.log(`Push received with data "${message}"`);

  const title = 'Push Notification';
  const options = {
    body: `${message}`,
    data: { href: '/games' },
    actions: [
      { action: 'game1', title: 'Game 1' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  if (action !== 'dismiss') {
    // This handles both notification click and 'details' action,
    // because some platforms might not support actions.
    clients.openWindow(notification.data.href);
  }
  notification.close();
});

function initializeWorkbox() {
  workbox.routing.registerRoute(
    /^(?!.*(?:unsplash|giphy|tenor|firebasestorage))(?=.*(?:png|jpg|jpeg|svg|webp|gif)).*/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxEntries: 60,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /^(?=.*(?:unsplash|giphy|tenor|firebasestorage))(?=.*(?:png|jpg|jpeg|svg|webp|gif)).*/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cors-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxEntries: 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
}
