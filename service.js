const version = '1.00'

self.addEventListener('install', event => {
    console.log("Log from event 'INSTALL' in SW version " + version)
    return self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log("Log from event 'ACTIVATE' in SW version " + version)
    return self.clients.claim() //active le contrôle
})

self.addEventListener('fetch', event => {
    const requestUrl = new URL(
        event.request.url
    )
})