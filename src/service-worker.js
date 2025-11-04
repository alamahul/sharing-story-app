import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';


cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
    ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/stories'),
    new NetworkFirst({
        cacheName: 'story-api-json',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200], 
            }),
            new ExpirationPlugin({
                maxEntries: 100, 
                maxAgeSeconds: 30 * 24 * 60 * 60, 
            }),
        ],
    })
);

registerRoute(
    ({ request, url }) => request.destination === 'image' && url.href.startsWith('https://story-api.dicoding.dev/images/stories/'),
    new StaleWhileRevalidate({
        cacheName: 'story-api-images',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 60, 
                maxAgeSeconds: 30 * 24 * 60 * 60, 
            }),
        ],
    })
);


registerRoute(
    ({ request }) => request.destination === 'image' && request.url.match(/^https:\/\/[abc]\.tile\.openstreetmap\.org\//),
    new CacheFirst({
        cacheName: 'osm-map-tiles',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 200, 
                maxAgeSeconds: 30 * 24 * 60 * 60, 
            }),
        ],
    })
);


registerRoute(
    ({ url }) => url.href.startsWith('https://api.maptiler.com/geocoding/'),
    new CacheFirst({
        cacheName: 'maptiler-geocoding',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 30, 
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);

self.addEventListener('push', (event) => {
    console.log('Service Worker: Menerima Push Notification...');
    
    let payload;
    try {
        payload = event.data.json();
    } catch (e) {
        payload = { 
            title: 'Notifikasi Baru', 
            body: 'Ada konten baru untuk Anda.', 
            data: { storyId: null } 
        };
    }
    const storyId = payload.data ? payload.data.storyId : null;
    const body = payload.body || 'Ada konten baru untuk Anda.';
    const title = payload.title || 'Notifikasi Baru';
    const notificationOptions = {
        body: payload.body,
        icon: '/images/icons/icon-192x192.png', 
        badge: '/images/icons/icon-192x192.png', 
        vibrate: [200, 100, 200], 
        
        data: {
            storyId: payload.data.storyId, 
        },
        
        actions: [
            { action: 'open-story', title: 'Lihat Detail Cerita' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, notificationOptions)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notifikasi di-klik.');

    event.notification.close();

    const storyId = event.notification.data.storyId;

    if (event.action === 'open-story' || event.action === '') {
        if (storyId) {
            const urlToOpen = `/#/story-detail/${storyId}`;
            event.waitUntil(clients.openWindow(urlToOpen));
        } else {
            event.waitUntil(clients.openWindow('/'));
        }
    }
});