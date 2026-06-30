/*
=========================================================
BondStats Finora
Loader Component
Version 1.0.0
=========================================================
*/

export class Loader{

constructor(options={}){

this.options={

label:"Loading...",

size:"md",

overlay:false,

className:"",

...options

};

this.element=this.create();

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`loader loader-${this.options.size} ${this.options.overlay?"loader-overlay":""} ${this.options.className}`.trim();

wrapper.innerHTML=`

<div class="loader-symbol">

<div class="loader-ring"></div>

<div class="loader-core"></div>

</div>

<div class="loader-label">

${escapeHTML(this.options.label)}

</div>

`;

return wrapper;

}

setLabel(label){

this.options.label=label;

const text=this.element.querySelector(".loader-label");

if(text){

text.textContent=label;

}

}

mount(parent){

if(typeof parent==="string"){

parent=document.querySelector(parent);

}

parent?.appendChild(this.element);

return this;

}

remove(){

this.element.remove();

}

show(){

this.element.hidden=false;

}

hide(){

this.element.hidden=true;

}

get(){

return this.element;

}

}

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,character=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[character]));

}

export function createLoader(options){

return new Loader(options);

}
