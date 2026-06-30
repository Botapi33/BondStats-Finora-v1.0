/*
=========================================================
BondStats Finora
Badge Component
Version 1.0.0
=========================================================
*/

export class Badge{

constructor(options={}){

this.options={

text:"Badge",

variant:"default",

icon:null,

pill:true,

className:"",

...options

};

this.element=this.create();

}

create(){

const badge=document.createElement("span");

badge.className=`badge badge-${this.options.variant} ${this.options.className}`.trim();

if(!this.options.pill){

badge.classList.add("badge-square");

}

if(this.options.icon){

const icon=document.createElement("span");

icon.className="badge-icon";

icon.innerHTML=this.options.icon;

badge.appendChild(icon);

}

const label=document.createElement("span");

label.className="badge-label";

label.textContent=this.options.text;

badge.appendChild(label);

return badge;

}

setText(text){

this.options.text=text;

this.element.querySelector(".badge-label").textContent=text;

}

setVariant(variant){

this.element.className=this.element.className.replace(

/badge-\S+/,

`badge-${variant}`

);

this.options.variant=variant;

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

get(){

return this.element;

}

}

export function createBadge(options){

return new Badge(options);

}
