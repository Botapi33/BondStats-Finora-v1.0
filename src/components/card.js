/*
=========================================================
BondStats Finora
Card Component
Version 1.0.0
=========================================================
*/

export class Card{

constructor(options={}){

this.options={

title:"",

subtitle:"",

content:"",

footer:"",

className:"",

hover:true,

padding:true,

headerActions:null,

...options

};

this.element=this.create();

}

create(){

const card=document.createElement("section");

card.className=`card ${this.options.className}`.trim();

if(this.options.hover){

card.classList.add("hover-lift");

}

if(!this.options.padding){

card.style.padding="0";

}

if(

this.options.title||

this.options.subtitle||

this.options.headerActions

){

const header=document.createElement("header");

header.className="card-header";

const left=document.createElement("div");

left.className="card-header-left";

if(this.options.title){

const title=document.createElement("h3");

title.className="card-title";

title.textContent=this.options.title;

left.appendChild(title);

}

if(this.options.subtitle){

const subtitle=document.createElement("p");

subtitle.className="card-subtitle";

subtitle.textContent=this.options.subtitle;

left.appendChild(subtitle);

}

header.appendChild(left);

if(this.options.headerActions){

const actions=document.createElement("div");

actions.className="card-header-actions";

if(this.options.headerActions instanceof HTMLElement){

actions.appendChild(this.options.headerActions);

}else{

actions.innerHTML=this.options.headerActions;

}

header.appendChild(actions);

}

card.appendChild(header);

}

const body=document.createElement("div");

body.className="card-body";

if(this.options.content instanceof HTMLElement){

body.appendChild(this.options.content);

}else{

body.innerHTML=this.options.content;

}

card.appendChild(body);

if(this.options.footer){

const footer=document.createElement("footer");

footer.className="card-footer";

if(this.options.footer instanceof HTMLElement){

footer.appendChild(this.options.footer);

}else{

footer.innerHTML=this.options.footer;

}

card.appendChild(footer);

}

return card;

}

setContent(content){

const body=this.element.querySelector(".card-body");

body.innerHTML="";

if(content instanceof HTMLElement){

body.appendChild(content);

}else{

body.innerHTML=content;

}

}

setTitle(title){

const heading=this.element.querySelector(".card-title");

if(heading){

heading.textContent=title;

}

}

append(node){

this.element.querySelector(".card-body").appendChild(node);

}

mount(target){

if(typeof target==="string"){

target=document.querySelector(target);

}

target?.appendChild(this.element);

return this;

}

remove(){

this.element.remove();

}

get(){

return this.element;

}

}

export function createCard(options){

return new Card(options);

}
