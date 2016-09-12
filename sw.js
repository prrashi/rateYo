;(function () {
  "use strict";

  function log (message) {

    console.log("[Service Worker] " + message);
  };

  var version         = "2.2.0",
      cacheName       = "rateyo-v" + version,
      filesToBeCached = [
        "/",
        "/index.html",
        "/favicon.ico",
        "/libs/shCore.css",
        "/libs/shThemeDefault.css",
        "/debut_light.png",
        "/bower_components/bootstrap/dist/css/bootstrap.min.css",
        "/application.css",
        "/bower_components/jquery-rateyo/min/jquery.rateyo.min.css?v=" + version,
        "/rateYo.png",
        "/bower_components/jquery/dist/jquery.min.js",
        "/bower_components/bootstrap/dist/js/bootstrap.min.js",
        "/bower_components/jquery-rateyo/min/jquery.rateyo.min.js?v=" + version,
        "/application.js?v=" + version
      ];

  self.addEventListener("install", function (event) {

    event.waitUntil(

      caches.open(cacheName).then(function (cache) {

        return cache.addAll(filesToBeCached);
      }, function (err) {

        log("Unable to cache Error: " + err);
      })
    );
  });

  self.addEventListener("fetch", function (event) {

    event.respondWith(

      caches.match(event.request).then(function (response) {

        if (response) {

          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function (response) {

          if (!response || response.status !== 200 || response.type !== "basic") {

            return response;
          }

          var cacheResponse = response.clone();

          caches.open(cacheName).then(function (cache) {

            cache.put(event.request, cacheResponse);
          });

          return response;
        });
      })
    );
  });

  self.addEventListener("activate", function (event) {

    event.waitUntil(

      caches.keys().then(function (cachesList) {

        return Promise.all(cachesList.map(function (name) {

          if (name !== cacheName) {

            return caches.delete(name);
          }
        }));
      })
    );
  });
}());
