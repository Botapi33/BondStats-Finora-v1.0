/*
=========================================================
BondStats Finora
Tabs Component
Version 1.0.0
=========================================================
*/

export class Tabs{

constructor(options={}){

this.options={

items:[],

active:0,

className:"",

onChange:null,

...options

};

this.activeIndex=this.options.active;

this.element=this.create();

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`tabs ${this.options.className}`.trim();

const nav=document.createElement("div");

nav.className="tabs-nav";

const content=document.createElement("div");

content.className="tabs-content";

this.options.items.forEach((item,index)=>{

const button=document.createElement("button");

button.className=`tab-button ${index===this.activeIndex?"active":""}`;

button.textContent=item.label;

button.dataset.index=index;

button.addEventListener("click",()=>{

this.select(index);

});

nav.appendChild(button);

const panel=document.createElement("section");

panel.className=`tab-panel ${index===this.activeIndex?"active":""}`;

panel.dataset.index=index;

if(item.content instanceof HTMLElement){

panel.appendChild(item.content);

}else{

panel.innerHTML=item.content||"";

}

content.appendChild(panel);

});

wrapper.appendChild(nav);

wrapper.appendChild(content);

return wrapper;

}

select(index){

this.activeIndex=index;

this.element.querySelectorAll(".tab-button").forEach((button,i)=>{

button.classList.toggle("active",i===index);

});

this.element.querySelectorAll(".tab-panel").forEach((panel,i)=>{

panel.classList.toggle("active",i===index);

});

if(typeof this.options.onChange==="function"){

this.options.onChange(

this.options.items[index],

index

);

}

}

current(){

return this.options.items[this.activeIndex];

}

mount(parent){

if(typeof parent==="string"){

parent=document.querySelector(parent);

}

parent?.appendChild(this.element);

return this;

}

destroy(){

this.element.remove();

}

get(){

return this.element;

}

}

export function createTabs(options){

return new Tabs(options);

}
