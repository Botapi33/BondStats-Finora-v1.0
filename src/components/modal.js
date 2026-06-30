/*
=========================================================
BondStats Finora
Modal Component
Version 1.0.0
=========================================================
*/

export class Modal{

constructor(options={}){

this.options={

title:"Modal",

content:"",

size:"md",

closable:true,

closeOnBackdrop:true,

footer:null,

onOpen:null,

onClose:null,

...options

};

this.element=this.create();

}

create(){

const overlay=document.createElement("div");

overlay.className="modal-overlay";

overlay.innerHTML=`

<div class="modal modal-${this.options.size}">

<div class="modal-header">

<div>

<h2 class="modal-title">

${this.options.title}

</h2>

</div>

${this.options.closable?`

<button class="modal-close">

✕

</button>

`:""}

</div>

<div class="modal-body">

</div>

${this.options.footer?`

<div class="modal-footer">

</div>

`:""}

</div>

`;

const body=overlay.querySelector(".modal-body");

if(this.options.content instanceof HTMLElement){

body.appendChild(this.options.content);

}else{

body.innerHTML=this.options.content;

}

if(this.options.footer){

const footer=overlay.querySelector(".modal-footer");

if(this.options.footer instanceof HTMLElement){

footer.appendChild(this.options.footer);

}else{

footer.innerHTML=this.options.footer;

}

}

if(this.options.closable){

overlay

.querySelector(".modal-close")

.addEventListener("click",()=>{

this.close();

});

}

if(this.options.closeOnBackdrop){

overlay.addEventListener("click",event=>{

if(event.target===overlay){

this.close();

}

});

}

return overlay;

}

open(){

const root=document.getElementById("modal-root");

if(!root){

return;

}

root.appendChild(this.element);

requestAnimationFrame(()=>{

this.element.classList.add("visible");

});

document.body.style.overflow="hidden";

this.options.onOpen?.();

}

close(){

this.element.classList.remove("visible");

setTimeout(()=>{

this.element.remove();

document.body.style.overflow="";

this.options.onClose?.();

},220);

}

setContent(content){

const body=this.element.querySelector(".modal-body");

body.innerHTML="";

if(content instanceof HTMLElement){

body.appendChild(content);

}else{

body.innerHTML=content;

}

}

setTitle(title){

this.element.querySelector(".modal-title").textContent=title;

}

get(){

return this.element;

}

}

export function createModal(options){

return new Modal(options);

}
