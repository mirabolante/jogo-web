const version = "0.1.0";
const cacheName = "mirabolante";
const precacheResources = [
    "./assets/audiolaser.mp3",
    "./assets/audioestrela.mp3",
    "./assets/blocos.png",
    "./assets/cena0.png",
    "./assets/cena2.png",
    "./assets/cena3.png",
    "./assets/ceu.png",
    "./assets/fullscreen.png",
    "./assets/estrela.png",
    "./assets/laser.png",
    "./assets/logo-128.png",
    "./assets/logo-192.png",
    "./assets/logo-256.png",
    "./assets/logo-384.png",
    "./assets/logo-512.png",
    "./assets/mapa.json",
    "./assets/personagem.png",
    "./assets/personagem2.png",
    "./assets/tema.mp3",
    "./assets/cima.png",
    "./assets/direita.png",
    "./assets/esquerda.png",
    "./index.html",
    "./js/cena0.js",
    "./js/cena1.js",
    "./js/cena2.js",
    "./js/cena3.js",
    "./js/index.js",
    "./main.css",
    "./manifest.json",
    "./sw.js",
];

self.addEventListener("install", (event) => {
    console.log("Service worker install event!");
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(precacheResources).then(() => self.skipWaiting());
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service worker activate event!");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    console.log("Fetch intercepted for: ", event.request.url);
    event.respondWith(
        caches
            .open(cacheName)
            .then((cache) => cache.match(event.request, { ignoreSearch: true }))
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});