// Implementation reference
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers
// https://github.com/mdn/pwa-examples/tree/main/js13kpwa


// Set up local file cache for offline use
// Increment version num when app files changes
const cacheName = "SpySchool-v4";
const appFiles = [
    "index.html",
    "app.js",
    "site.css",    

    "images/icons/icon-48x48.png",
    "images/icons/icon-72x72.png",
    "images/icons/icon-96x96.png",
    "images/icons/icon-128x128.png",
    "images/icons/icon-144x144.png",
    "images/icons/icon-152x152.png",
    "images/icons/icon-192x192.png",
    "images/icons/icon-384x384.png",
    "images/icons/icon-512x512.png",
    "images/icons/spy.svg",

    "images/spy-photos/Amanda.jpg",
    "images/spy-photos/Becky.jpg",
    "images/spy-photos/Jason.png",
    "images/spy-photos/Shan.jpg",
    "images/spy-photos/AdelynReich.png",
    "images/spy-photos/AinsleyYoung.png",
    "images/spy-photos/BettyMartin.png",
    "images/spy-photos/BrightonSheridan.png",
    "images/spy-photos/CalistaArnold.png",
    "images/spy-photos/CarolineMartin.png",
    "images/spy-photos/ChloeLombardo.png",
    "images/spy-photos/CoraYoung.png",
    "images/spy-photos/EdisonBaker.png",
    "images/spy-photos/EliasSnyder.png",
    "images/spy-photos/ElijahEdwin.png",
    "images/spy-photos/FloBaker.png",
    "images/spy-photos/GaviMcLaughlin.png",
    "images/spy-photos/IslaYoung.png",
    "images/spy-photos/JackRedden.png",
    "images/spy-photos/JakeLandini.png",
    "images/spy-photos/MacklinMorgan.png",
    "images/spy-photos/ZephyraHafner.png",

    "sounds/access-denied.m4a",
    "sounds/access-granted.m4a",
    "sounds/scanning.mp3"
];


// Install service worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching app files');
        await cache.addAll(appFiles);
    })());
  });


// Fetch content using Service Worker
self.addEventListener('fetch', (e) => {
    if (!(e.request.url.startsWith('http:') || e.request.url.startsWith('https:'))) {
        return; 
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
            return r;
        }

        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});


// Clean up old caches
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key === cacheName) {
                        return;
                    }
                    return caches.delete(key);
                }),
            );
        }),
    );
});