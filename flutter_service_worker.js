'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "bf8695e981d071ae6e0c3b801fa739ca",
"splash/img/light-2x.png": "1d5d98ba30381c0329a8b9d85d242f02",
"splash/img/dark-4x.png": "a340e5864153e21df9e8034959a089dc",
"splash/img/light-3x.png": "5561071ae46b4a3ea9ba2518a2a03864",
"splash/img/dark-3x.png": "5561071ae46b4a3ea9ba2518a2a03864",
"splash/img/light-4x.png": "a340e5864153e21df9e8034959a089dc",
"splash/img/dark-2x.png": "1d5d98ba30381c0329a8b9d85d242f02",
"splash/img/dark-1x.png": "8fcac72f52ebe7b3b9ead16507525fe4",
"splash/img/light-1x.png": "8fcac72f52ebe7b3b9ead16507525fe4",
"index.html": "cc7ec55f130b27414ea110b4c55ce1b4",
"/": "cc7ec55f130b27414ea110b4c55ce1b4",
"main.dart.js": "78433e73f907cc0c3c71d1dfc8af415f",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "7eca8554117289785c98f9d3caff4914",
"icons/Icon-192.png": "5969123e35af47a05deb90f6321ac225",
"icons/Icon-maskable-192.png": "5969123e35af47a05deb90f6321ac225",
"icons/Icon-maskable-512.png": "04d931f611133b32b262380791e3e437",
"icons/Icon-512.png": "04d931f611133b32b262380791e3e437",
"manifest.json": "63f8b25bd542106af8c61345406f3ba3",
"assets/AssetManifest.json": "7a6a50fff8af4f196760e074d24ecc5a",
"assets/loading.gif": "04cbb2e3566a38c250a047b4fd63f172",
"assets/NOTICES": "c34fdb6079489275073b5b1168883eea",
"assets/FontManifest.json": "f739aa7b991f9e6a27cd364c5a659774",
"assets/AssetManifest.bin.json": "d5db586f322b752ad207ba22d755d37d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/glass/images/noise.png": "326f70bd3633c4bb951eac0da073485d",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "f7adb0987925efb6c140d286f146aeac",
"assets/fonts/MaterialIcons-Regular.otf": "01067a29c353900b4a521ef72ddb21b6",
"assets/assets/empty.json": "20e62229847226f1b54b605cc6df8d8c",
"assets/assets/serviceFull.png": "d6a3acfcdd8843be163626a66cdeccd6",
"assets/assets/emailsent.png": "794426ca68f56c1b34ca685c8c988aee",
"assets/assets/service.png": "7a2030140abcdf4e676dcc1b251e33d6",
"assets/assets/logo.png": "eedf5fc2a717f823fe4cd0513bb39034",
"assets/assets/onboarding.png": "95dc00c1d32349b150a7360e43abfa0f",
"assets/assets/logo2.png": "93bb081b7327be69537c00471859696c",
"assets/assets/fonts/poppins_bold.ttf": "08c20a487911694291bd8c5de41315ad",
"assets/assets/fonts/poppins.ttf": "093ee89be9ede30383f39a899c485a82",
"assets/assets/update.json": "9709ee0dcca6aed4d8281eacfed971c5",
"assets/assets/serviceIcon.png": "19ff11955c9da4525275d3404bf49394",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
