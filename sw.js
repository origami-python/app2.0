const CACHE = 'socquiz-v2.0.0';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon512.png',
  './data/index.json'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const u = new URL(e.request.url);
  const allow = ['https://ja.wikipedia.org'];
  if (u.origin === location.origin || allow.some(d=>u.origin.startsWith(d))) {
    e.respondWith(
      caches.match(e.request).then(cached=>{
        const fetcher = fetch(e.request).then(res=>{
          caches.open(CACHE).then(c=>c.put(e.request, res.clone()));
          return res;
        }).catch(()=>cached);
        return cached || fetcher;
      })
    );
  }
});