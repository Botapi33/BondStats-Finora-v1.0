/*
=========================================================
BondStats Finora
General Helper Utilities
Version 1.0.0
=========================================================
*/

/*
Pure helper functions only.
No DOM.
No Storage.
No Router.
No State.

Safe to import everywhere.
*/

export function clamp(value,min=0,max=100){

value=Number(value);

if(Number.isNaN(value)) return min;

return Math.min(max,Math.max(min,value));

}

export function lerp(start,end,t){

return start+(end-start)*t;

}

export function round(value,decimals=2){

const factor=10**decimals;

return Math.round(Number(value)*factor)/factor;

}

export function percent(value,total){

if(total===0)return 0;

return round((value/total)*100);

}

export function sum(array,key){

if(!Array.isArray(array))return 0;

if(!key){

return array.reduce((a,b)=>a+(Number(b)||0),0);

}

return array.reduce((a,item)=>{

return a+(Number(item[key])||0);

},0);

}

export function average(array,key){

if(!array.length)return 0;

return sum(array,key)/array.length;

}

export function groupBy(array,key){

return array.reduce((groups,item)=>{

const value=item[key]??"Unknown";

(groups[value]??=[]).push(item);

return groups;

},{});

}

export function unique(array){

return [...new Set(array)];

}

export function sortDescending(array,key){

return [...array].sort((a,b)=>{

if(key){

return (b[key]||0)-(a[key]||0);

}

return b-a;

});

}

export function deepClone(object){

return structuredClone

?structuredClone(object)

:JSON.parse(JSON.stringify(object));

}

export function uuid(){

if(window.crypto?.randomUUID){

return crypto.randomUUID();

}

return Math.random().toString(36).slice(2)+Date.now();

}

export function debounce(callback,delay=250){

let timeout;

return(...args)=>{

clearTimeout(timeout);

timeout=setTimeout(()=>{

callback(...args);

},delay);

};

}

export function throttle(callback,delay=250){

let waiting=false;

return(...args)=>{

if(waiting)return;

callback(...args);

waiting=true;

setTimeout(()=>{

waiting=false;

},delay);

};

}

export function formatNumber(value){

return new Intl.NumberFormat().format(value);

}

export function formatPercent(value){

return `${round(value,1)}%`;

}

export function formatCurrency(value,currency="USD"){

return new Intl.NumberFormat(undefined,{

style:"currency",

currency

}).format(value);

}

export function formatDate(date){

return new Intl.DateTimeFormat(undefined,{

dateStyle:"medium",

timeStyle:"short"

}).format(new Date(date));

}

export function capitalize(text){

return String(text)

.charAt(0)

.toUpperCase()+

String(text).slice(1);

}

export function titleCase(text){

return String(text)

.split(" ")

.map(capitalize)

.join(" ");

}

export function escapeHTML(text){

const div=document.createElement("div");

div.textContent=text;

return div.innerHTML;

}

export function download(filename,content,type="text/plain"){

const blob=new Blob([content],{type});

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=filename;

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);

}

export function isMobile(){

return window.matchMedia("(max-width:768px)").matches;

}

export function sleep(ms){

return new Promise(resolve=>setTimeout(resolve,ms));

}
