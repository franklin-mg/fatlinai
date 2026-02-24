const CACHE_NAME = 'fatlin-v1-gold-cache';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ico-192.png',
  './ico-512.png'
];

// Instalación: Guardar archivos base en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Estrategia: Cache First para diseño, Network First para la IA y Firebase
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Si es una petición a Google (IA) o Firebase, ir directo a la red
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para el resto (diseño), cargar de caché para máxima velocidad
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
