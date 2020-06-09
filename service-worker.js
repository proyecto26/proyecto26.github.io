importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  initializeWorkbox();
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

function initializeWorkbox() {
  workbox.routing.registerRoute(
    /^(?!.*(?:unsplash|giphy|tenor|firebasestorage))(?=.*(?:png|jpg|jpeg|svg|webp|gif)).*/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
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
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxEntries: 60,
        }),
        new workbox.cacheableResponse.CacheableResponse({
          statuses: [0, 200],
        }),
      ],
    })
  );
}
