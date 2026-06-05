// public/service-worker.js

// ✅ Installation : mettre en cache index.html et la racine
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("apmthr-cache").then(cache => {
      return cache.addAll(["/", "/index.html"]);
    })
  );
});

// ✅ Activation : nettoyer les anciens caches
self.addEventListener("activate", event => {
  const cacheWhitelist = ["apmthr-cache"];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// ✅ Fetch : toujours retélécharger index.html pour les navigations
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
