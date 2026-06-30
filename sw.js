const CACHE_NAME = "bondstats-finora-v1.0.0";

const APP_SHELL = [

"./",

"./index.html",

"./manifest.webmanifest",

"./src/design/tokens.css",
"./src/design/reset.css",
"./src/design/typography.css",
"./src/design/layout.css",
"./src/design/components.css",
"./src/design/animations.css",
"./src/design/themes.css",
"./src/design/responsive.css",

"./src/core/app.js",
"./src/core/router.js",
"./src/core/state.js",
"./src/core/storage.js",
"./src/core/events.js",
"./src/core/config.js"

];

self.addEventListener("install",event=>{

event.waitUntil(

caches

.open(CACHE_NAME)

.then(cache=>cache.addAll(APP_SHELL))

);

self.skipWaiting();

});

self.addEventListener("activate",event=>{

event.waitUntil(

caches.keys().then(keys=>{

return Promise.all(

keys.map(key=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

self.addEventListener("fetch",event=>{

if(event.request.method!=="GET"){

return;

}

event.respondWith(

caches.match(event.request)

.then(cached=>{

if(cached){

return cached;

}

return fetch(event.request)

.then(response=>{

if(

!response||

response.status!==200||

response.type!=="basic"

){

return response;

}

const clone=response.clone();

caches

.open(CACHE_NAME)

.then(cache=>{

cache.put(event.request,clone);

});

return response;

})

.catch(()=>{

if(

event.request.destination==="document"

){

return caches.match("./index.html");

}

});

})

);

});

self.addEventListener("message",event=>{

if(event.data==="skipWaiting"){

self.skipWaiting();

}

});
