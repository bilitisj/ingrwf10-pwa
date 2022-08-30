const version = '1.00'

// l'installation ne se fait qu'une seule fois
self.addEventListener('install', event => {
    console.log("Log from event 'INSTALL' in SW version " + version)
    return self.skipWaiting()
})

// activation à chaque fois que l'on relance le navigateur
self.addEventListener('activate', event => {
    console.log("Log from event 'ACTIVATE' in SW version " + version)
    return self.clients.claim() //active le contrôle
})


/*
//simple fetch general for install btn
//on écoute chaque requête
self.addEventListener('fetch', event => {
    const requestUrl = new URL(
        event.request.url
    )
})
*/

//définition d'un cache pour les assets
const ASSETS_CACHE_NAME = "assets"

// 2 méthodes: getter et setter
// si la valeur est dans le cache, on l'utilise, si non on va la chercher sur le serveur

// GETTER
const getResponseFromCache = (cacheName, request) => {
    // on ouvre le bon cache
    return caches.open(cacheName)
    // une promesse
    .then(cache => {
        // réponse de la promesse
        // on retourne le fichier qui correspond à la requête
        return cache.match(request)
    })
}

// SETTER
const setResponseCache = (cacheName, request, response) => {
    // on ouvre le bon cache
    return caches.open(cacheName)
    // une promesse
    .then(cache => {
        // réponse de la promesse
        return cache.put(request, response)
    })
}

//--------------- Stratégie de cache ---------------

// Méthode de stratégie cacheFirst --> priorité au cache (si fichier est dans le cache, on l'utilise)
const getResponseFromCacheFirst = (cacheName, request) => {
    const response = getResponseFromCache(cacheName, request)
    .then(response => {
        // si la réponse est sur true
        if(response) {
            // on retourne la réponse à la stratégie
            return response
        }
        else { // le fichier correspondant à request n'est pas dans le cache --> on fat une requete sur le serveur
            return fetch(request)
            .then(response => {
                // on stocke une copie de la réponse 
                setResponseCache(cacheName, request, response.clone())
                //on envoie la réponse à la stratégie pour la stocker
                return response
            })
        }
    })
    // renvoie au fetch
    return response
}
// si requests , on l'intercepte
self.addEventListener("fetch", (event) => {
    // on récupère l'url de la reqest exécutée par le navigateur
    const requestUrl = new URL (event.request.url)
    console.log(requestUrl.pathname)
    // on intercepte la requête et on va appliquer la stratégie cacheFirst
    if(requestUrl.pathname.startsWith('/assets')) {
        // si une requête dont le pathname commence par assets
        event.respondWith(
            getResponseFromCacheFirst(ASSETS_CACHE_NAME, event.request)
        )
    }
    if(requestUrl.pathname.startsWith('/stations/')) {
        console.log('appel de api')
        // renvoi au navigateur
        event.respondWith(
            getResponseFromNetworkFirst(API_CACHE_NAME, event.request)
        )
    }
})


// Méthode de stratégie networkFirst

const getResponseFromNetworkFirst = (
    cacheName,
    request
) => {
    // test si connexion
    return fetch(request)
    .then( response => {
        if(response) {
        //exécution du setter
        setResponseCache(
            cacheName,
            request,
            response.clone()
        )
        //on envoie la réponse à la stratégie
        return response
        } else {
            //pas IntersectionObserverEntry, donc on lance le getter
            const responseCache = getResponseFromCache(
                cacheName, request
            )
            .then(responseCache => {
                //si en cache
                if(responseCache) {
                    return responseCache
                } else//sinon, c'est mort
                {
                    return 'error'
                }
            })
        }
    })
    
    return response
}
