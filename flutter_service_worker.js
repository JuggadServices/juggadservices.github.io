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
"index.html": "56c317a60a19a73ed2f48d668b65e16f",
"/": "56c317a60a19a73ed2f48d668b65e16f",
"main.dart.js": "dc88a487df9da60aaa52384622617cf3",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"favicon.png": "7eca8554117289785c98f9d3caff4914",
"icons/Icon-192.png": "5969123e35af47a05deb90f6321ac225",
"icons/Icon-maskable-192.png": "5969123e35af47a05deb90f6321ac225",
"icons/Icon-maskable-512.png": "04d931f611133b32b262380791e3e437",
"icons/Icon-512.png": "04d931f611133b32b262380791e3e437",
"manifest.json": "63f8b25bd542106af8c61345406f3ba3",
"assets/AssetManifest.json": "671ff8eb41d4e318fb0c7b594ed8b85e",
"assets/loading.gif": "04cbb2e3566a38c250a047b4fd63f172",
"assets/NOTICES": "2868354912ae053c3e5b3c7340ad1263",
"assets/FontManifest.json": "f739aa7b991f9e6a27cd364c5a659774",
"assets/AssetManifest.bin.json": "8700bd5ed4366c26d1de02933177c36f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/glass/images/noise.png": "326f70bd3633c4bb951eac0da073485d",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "665ce6a97a3a0f0b04e78b9f50424074",
"assets/fonts/MaterialIcons-Regular.otf": "50a34b3488b55154643d1fbfbe978156",
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
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
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
