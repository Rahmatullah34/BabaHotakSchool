const cacheName = 'baba-hotak-v1';
const assets = [
  './',
  './index.html',
  './finance.html',
  './attendance.html',
  './results.html',
  './app_logic.js',
  './logo.png'
];

// د فایلونو خوندي کول په موبایل کې
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// له آفلاین حالت څخه د فایلونو را ایستل
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
// په Install کې د View Only فایلونه
const OFFLINE_VIEWER_FILES = [
    '/',
    '/index.html',
    '/css/hybrid_styles.css',
    '/hybrid_system.js',
    '/view_only_components.js',
    '/offline_viewer.js',
    '/logo.png',
    '/favicon.ico'
];

// په Fetch کې
event.respondWith(
    caches.match(request)
        .then(response => {
            if (response) {
                return response;
            }
            
            // که Online وي
            if (navigator.onLine) {
                return fetch(request);
            }
            
            // که Offline وي او فایل په Cache کې نشته
            return new Response(
                '<h1>Offline Viewer</h1><p>دا پاڼه په Offline کې نشته</p>',
                {
                    status: 200,
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        })
);