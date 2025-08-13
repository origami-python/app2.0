const CACHE = 'socquiz-v2.0.1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon512.png',
  './data/index.json'
];
// assets以下の任意ファイル（画像/効果音）もキャッシュ対象にする
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
  const isLocal = (u.origin === location.origin);
  if (isLocal || allow.some(d=>u.origin.startsWith(d))) {
    e.respondWith(
      caches.match(e.request).then(cached=>{
        const fetcher = fetch(e.request).then(res=>{
          // data/packs/ や assets/ も順次キャッシュ
          caches.open(CACHE).then(c=>c.put(e.request, res.clone()));
          return res;
        }).catch(()=>cached);
        return cached || fetcher;
      })
    );
  }
});