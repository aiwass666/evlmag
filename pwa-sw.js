const CACHE_VERSION = 'v31.12';
const CACHE_NAME = `evl-minimal-cache-${CACHE_VERSION}`;

const PRECACHE_URLS = [
'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap.min.css',
'https://cdn.jsdelivr.net/gh/aiwass666/evlmag/seven-of-nine.css',
'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/js/bootstrap.bundle.min.js',
'https://cdn.jsdelivr.net/gh/aiwass666/evlmag/kaizen.min.js',
'https://evl.one/pwa-sw.js',
'https://evl.one/manifest.json',
'https://evl.one/pwa/maskable_icon_legacy-v4.png',
];

self.addEventListener('install', event => {
self.skipWaiting();
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
);
});

self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames =>
Promise.all(
cacheNames.map(cacheName => {
if (cacheName !== CACHE_NAME) {
return caches.delete(cacheName);
}
})
)
).then(() => self.clients.claim())
);
});

self.addEventListener('fetch', event => {
if (event.request.method !== 'GET') return;
if (!PRECACHE_URLS.includes(event.request.url)) return;

event.respondWith(
caches.match(event.request).then(cachedResponse => {
if (cachedResponse) return cachedResponse;
return fetch(event.request);
})
);
});
