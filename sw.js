const CACHE='ai-health-karte-v106';
const ASSETS=['./','index.html','style.css?v=106','script.js?v=106','manifest.json','apple-touch-icon.png','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy).catch(()=>{}));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))))});
