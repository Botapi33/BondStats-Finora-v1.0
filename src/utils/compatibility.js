/*
=========================================================
BondStats Finora
Compatibility Utilities
Version 1.0.0
=========================================================
*/

export function supportsLocalStorage(){

try{

const key="finora-storage-test";

localStorage.setItem(key,"1");

localStorage.removeItem(key);

return true;

}catch(error){

return false;

}

}

export function supportsCanvas(){

const canvas=document.createElement("canvas");

return Boolean(

canvas.getContext&&

canvas.getContext("2d")

);

}

export function supportsServiceWorker(){

return "serviceWorker" in navigator;

}

export function supportsClipboard(){

return Boolean(

navigator.clipboard&&

navigator.clipboard.writeText

);

}

export function supportsCryptoId(){

return Boolean(

window.crypto&&

crypto.randomUUID

);

}

export function createSafeId(){

if(supportsCryptoId()){

return crypto.randomUUID();

}

return `finora-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

}

export function safeLocalStorageGet(key,fallback=null){

if(!supportsLocalStorage()){

return fallback;

}

try{

const value=localStorage.getItem(key);

return value===null?fallback:value;

}catch(error){

return fallback;

}

}

export function safeLocalStorageSet(key,value){

if(!supportsLocalStorage()){

return false;

}

try{

localStorage.setItem(key,value);

return true;

}catch(error){

return false;

}

}

export function safeJSONParse(value,fallback=null){

try{

return JSON.parse(value);

}catch(error){

return fallback;

}

}

export function safeJSONStringify(value,fallback="{}"){

try{

return JSON.stringify(value);

}catch(error){

return fallback;

}

}

export function copyText(text){

if(supportsClipboard()){

return navigator.clipboard.writeText(text);

}

return fallbackCopy(text);

}

function fallbackCopy(text){

return new Promise((resolve,reject)=>{

const textarea=document.createElement("textarea");

textarea.value=text;

textarea.setAttribute("readonly","");

textarea.style.position="fixed";

textarea.style.left="-9999px";

document.body.appendChild(textarea);

textarea.select();

try{

document.execCommand("copy");

textarea.remove();

resolve();

}catch(error){

textarea.remove();

reject(error);

}

});

}

export function compatibilityReport(){

return{

localStorage:supportsLocalStorage(),

canvas:supportsCanvas(),

serviceWorker:supportsServiceWorker(),

clipboard:supportsClipboard(),

cryptoId:supportsCryptoId(),

userAgent:navigator.userAgent,

online:navigator.onLine

};

}
