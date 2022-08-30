const version = 1.02

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

self.addEventListener('install', event => {
    console.log("Log from event 'INSTALL' in SW version " + version)
    return self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log("Log from event 'ACTIVATE' in SW version " + version)
    return self.clients.claim()
})


// définition d'un cache pour les assets
const CACHE = "assets"
const API_CACHE = "api"

workbox.precaching.precacheAndRoute([
    {
        "url": "index.html"
    },
    {
      "url": "about.html"
    },
    {
      "url" : "manifest.json"
    },
    {
      "url": "android-icon-96x96.png"
    },
    {
      "url": "main.js"
    },
    {
        "url" : "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
    },
    {
        "url" : "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"
    }
  ])

  //gérer le cache d'une image
workbox.routing.registerRoute(
    /(.*)\.(?:png|gif|jpg|css|js|ico|webp)$/,
    new workbox.strategies.CacheFirst({
      cacheName: CACHE
    })
  );

  workbox.routing.registerRoute(
    "https://api.irail.be/stations/?format=json",
    new workbox.strategies.NetworkFirst({
      cacheName: API_CACHE
    })
  );