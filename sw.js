const CACHE='aportelab-app-v5';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return; // cotações (brapi) sempre direto da rede
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(r,cp));return resp}).catch(()=>hit||caches.match('./'));
    return hit||net;
  }));
});
