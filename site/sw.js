// 가늠 웹앱: 한 번 열면 인터넷 없이도(해외·비행기 안) 열리게 저장하고, 인터넷이 되면 항상 새 파일을 먼저 받아요.
// 이 사이트(github.io/ganeum/) 파일만 다루고, 다른 곳으로는 아무것도 보내지 않아요.
// 같은 github.io 주소에 다른 앱도 있어서, 저장분 이름은 'ganeum-'으로 시작하고 정리할 때도 'ganeum-' 것만 지워요.
const CACHE = 'ganeum-__V__';
const FILES = ['./app.html', './app.js?v=__V__', './icon-180.png', './icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ganeum-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(new URL('./', location).pathname)) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true })
    .then(r => r || (e.request.mode === 'navigate' ? c.match('./app.html') : undefined))
    .then(r => r || Response.error()))));
});
