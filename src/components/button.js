/*
=========================================================
BondStats Finora
Button Component
Version 1.0.0
=========================================================
*/

export class Button{

constructor(options={}){

this.options={

label:"Button",

variant:"primary",

icon:null,

type:"button",

disabled:false,

fullWidth:false,

className:"",

onClick:null,

...options

};

this.element=this.create();

}

create(){

const button=document.createElement("button");

button.type=this.options.type;

button.className=

`button button-${this.options.variant} ${this.options.className}`.trim();

if(this.options.fullWidth){

button.style.width="100%";

}

if(this.options.disabled){

button.disabled=true;

}

if(this.options.icon){

const icon=document.createElement("span");

icon.className="button-icon";

icon.innerHTML=this.options.icon;

button.appendChild(icon);

}

const label=document.createElement("span");

label.className="button-label";

label.textContent=this.options.label;

button.appendChild(label);

if(typeof this.options.onClick==="function"){

button.addEventListener(

"click",

this.options.onClick

);

}

return button;

}

mount(parent){

if(typeof parent==="string"){

parent=document.querySelector(parent);

}

parent?.appendChild(this.element);

return this;

}

setLabel(text){

this.element.querySelector(

".button-label"

).textContent=text;

}

enable(){

this.element.disabled=false;

}

disable(){

this.element.disabled=true;

}

show(){

this.element.hidden=false;

}

hide(){

this.element.hidden=true;

}

destroy(){

this.element.remove();

}

get(){

return this.element;

}

}

export function createButton(options){

return new Button(options);

}
