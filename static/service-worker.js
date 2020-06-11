const CORE_CACHE = 1
const CORE_CACHE_NAME = `core-cache-v${CORE_CACHE}`
const CORE_ASSETS = [
    '/',
    '/offline',
    '/dist/site.css',
    // TODO: error pages
]

self.addEventListener('install', e => {
    console.log('sw install')

    e.waitUntil(
        caches.open(CORE_CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', e => {
    console.log('sw activate');

    // update sw in all active tabs
    e.waitUntil(clients.claim())
});

self.addEventListener('fetch', e => {
    const fileType = e.request.destination

    // cache only strategy
    if (isCoreGetRequest(e.request))  {
        // open from cache
        e.respondWith(
            caches.open(CORE_CACHE_NAME)
                .then(cache => cache.match(e.request.url))
        )
    // generic fallback
    } else if (isHtmlGetRequest(e.request) || (isFileGetRequest(e.request, fileType) && isCachedFileType(fileType))) {
        e.respondWith(
            caches.open(`${fileType}-cache`)
                .then(cache => cache.match(e.request.url))
                .then(res => res ? res : fetchAndCache(e.request, `${fileType}-cache`)
                .catch(e => {
                    return caches.open(CORE_CACHE_NAME)
                        .then(cache => cache.match('/offline'))
                })
            )
        )
    }
})

function fetchAndCache(request, cacheName) {
    return fetch(request)
        .then(response => {
            if (!response.ok) {
                throw new TypeError('Bad response status');
            }

            const clone = response.clone()
            caches.open(cacheName).then((cache) => cache.put(request.url, clone))
            return response
        })
}

function isCachedFileType(fileType) {
    return ['image', 'font', 'script', 'manifest'].includes(fileType)
}

function isCoreGetRequest(request) {
    return request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url))
}

function isFileGetRequest(request, fileType) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.destination.indexOf(`${fileType}`) > -1)
}

function isHtmlGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1)
}

function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    return url.pathname;
}