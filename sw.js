const CACHE_NAME='kenko-karte-v1441-no-cache';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',()=>{});
