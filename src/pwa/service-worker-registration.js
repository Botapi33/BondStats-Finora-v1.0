/*
=========================================================
BondStats Finora
Service Worker Registration
Version 1.0.0
=========================================================
*/

import { toast } from "../components/toast.js";

export function registerServiceWorker(){

if(!("serviceWorker" in navigator)){

console.info("[Finora] Service Worker not supported.");

return;

}

window.addEventListener("load",async()=>{

try{

const registration=await navigator.serviceWorker.register("./sw.js");

console.info("[Finora] Service Worker registered.",registration.scope);

registration.addEventListener("updatefound",()=>{

const worker=registration.installing;

if(!worker)return;

worker.addEventListener("statechange",()=>{

if(worker.state==="installed"&&navigator.serviceWorker.controller){

toast("Finora update ready. Reload to activate.","success");

}

});

});

}catch(error){

console.warn("[Finora] Service Worker registration failed.",error);

}

});

}

export function unregisterServiceWorker(){

if(!("serviceWorker" in navigator)){

return Promise.resolve(false);

}

return navigator.serviceWorker.getRegistrations().then(registrations=>{

return Promise.all(

registrations.map(registration=>registration.unregister())

);

});

}

export function listenForOfflineStatus(){

window.addEventListener("online",()=>{

toast("Online connection restored.","success");

});

window.addEventListener("offline",()=>{

toast("Offline Mode Enabled.","warning");

});

}

export function initializePWA(){

registerServiceWorker();

listenForOfflineStatus();

}
