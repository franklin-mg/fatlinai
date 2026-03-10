/* ═══════════════════════════════════════════════════════════════
   Fatlin AI — Service Worker (sw.js)
   Estrategia: Network First para HTML · Cache First para assets
   Actualiza CACHE_VERSION en cada deploy para forzar refresco
═══════════════════════════════════════════════════════════════ */

const CACHE_VERSION  = 'fatlin-v8';
const CACHE_STATIC   = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC  = `${CACHE_VERSION}-dynamic`;

// Archivos que se precargan en instalación (app shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/pwa.js',
  '/js/splash.js',
  '/js/restSystem.js',
  '/manifest.json',
  '/verify.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Fuente Inter (CDN Google Fonts — solo si hay conexión en instalación)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// ── INSTALL: precargar app shell ──────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Instalando versión:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(
        PRECACHE_ASSETS.filter(url => !url.startsWith('https://fonts'))
      ))
      .then(() => {
        console.log('[SW] App shell precargada');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch(err => console.warn('[SW] Precache parcial:', err))
  );
});

// ── ACTIVATE: limpiar cachés viejas ──────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activando:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map(key => {
            console.log('[SW] Eliminando caché vieja:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      // Notificar a todos los clientes que hay nueva versión
      return self.clients.matchAll({ includeUncontrolled: true });
    }).then(clients => {
      clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      return self.clients.claim();
    })
  );
});

// ── FETCH: estrategia mixta ───────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no GET y extensiones de Chrome
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Firebase APIs, Anthropic proxy, CDN scripts → Network only (sin caché)
  if (
    url.hostname.includes('firebaseio.com')     ||
    url.hostname.includes('googleapis.com')     ||
    url.hostname.includes('anthropic.com')      ||
    url.hostname.includes('cloudfunctions.net') ||
    url.hostname.includes('gstatic.com')        ||
    url.pathname.includes('/v1/messages')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // HTML → Network First (siempre la versión más reciente)
  if (request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // CSS, JS, Fuentes → Cache First (versión con hash inmutable)
  if (
    url.pathname.startsWith('/css/')    ||
    url.pathname.startsWith('/js/')     ||
    url.pathname.startsWith('/icons/')  ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Resto → Network First con fallback a caché dinámica
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ── Recibir mensajes desde la app ─────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING recibido — activando nueva versión');
    self.skipWaiting();
  }
});
