/*
=========================================================
BondStats Finora
DOM Utilities
Version 1.0.0
=========================================================
*/

/*
This file intentionally contains only generic DOM helpers.

It has:
- No dependency on State
- No dependency on Router
- No dependency on Storage

This prevents circular imports.
*/

export const $=(selector,parent=document)=>{

return parent.querySelector(selector);

};

export const $$=(selector,parent=document)=>{

return [...parent.querySelectorAll(selector)];

};

export function createElement(tag,options={}){

const element=document.createElement(tag);

if(options.className){

element.className=options.className;

}

if(options.id){

element.id=options.id;

}

if(options.text!==undefined){

element.textContent=options.text;

}

if(options.html!==undefined){

element.innerHTML=options.html;

}

if(options.attributes){

Object.entries(options.attributes)

.forEach(([key,value])=>{

element.setAttribute(key,value);

});

}

return element;

}

export function clearElement(element){

if(!element)return;

while(element.firstChild){

element.removeChild(element.firstChild);

}

}

export function append(parent,...children){

children.forEach(child=>{

if(child){

parent.appendChild(child);

}

});

return parent;

}

export function remove(element){

element?.remove();

}

export function show(element){

if(!element)return;

element.hidden=false;

element.style.display="";

}

export function hide(element){

if(!element)return;

element.hidden=true;

}

export function toggle(element,state){

if(state){

show(element);

}else{

hide(element);

}

}

export function on(element,event,handler,options){

element?.addEventListener(

event,

handler,

options

);

return()=>{

element?.removeEventListener(

event,

handler,

options

);

};

}

export function once(element,event,handler){

const callback=e=>{

handler(e);

element.removeEventListener(

event,

callback

);

};

element.addEventListener(

event,

callback

);

}

export function delegate(parent,event,selector,handler){

parent.addEventListener(event,e=>{

const target=e.target.closest(selector);

if(!target)return;

handler(e,target);

});

}

export function ready(callback){

if(document.readyState==="loading"){

document.addEventListener(

"DOMContentLoaded",

callback,

{once:true}

);

}else{

callback();

}

}

export function fragment(html){

const template=document.createElement("template");

template.innerHTML=html.trim();

return template.content;

}

export function replaceChildren(parent,...children){

clearElement(parent);

append(parent,...children);

}

export function setText(element,text){

if(element){

element.textContent=text;

}

}

export function setHTML(element,html){

if(element){

element.innerHTML=html;

}

}

export function addClass(element,...classes){

element?.classList.add(...classes);

}

export function removeClass(element,...classes){

element?.classList.remove(...classes);

}

export function toggleClass(element,className,force){

element?.classList.toggle(className,force);

}

export function hasClass(element,className){

return element?.classList.contains(className);

}

export function css(element,styles={}){

if(!element)return;

Object.assign(element.style,styles);

}

export function dataset(element,key,value){

if(!element)return;

if(value===undefined){

return element.dataset[key];

}

element.dataset[key]=value;

}

export function isVisible(element){

if(!element)return false;

return !!(

element.offsetWidth||

element.offsetHeight||

element.getClientRects().length

);

}

export function nextFrame(){

return new Promise(resolve=>{

requestAnimationFrame(resolve);

});

}

export function wait(milliseconds){

return new Promise(resolve=>{

setTimeout(resolve,milliseconds);

});

}
