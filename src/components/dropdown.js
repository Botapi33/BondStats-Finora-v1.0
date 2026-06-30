/*
=========================================================
BondStats Finora
Dropdown Component
Version 1.0.0
=========================================================
*/

export class Dropdown{

constructor(options={}){

this.options={

label:"",

name:"",

value:"",

placeholder:"Select...",

options:[],

disabled:false,

className:"",

helperText:"",

onChange:null,

...options

};

this.element=this.create();

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`form-group ${this.options.className}`.trim();

if(this.options.label){

const label=document.createElement("label");

label.className="form-label";

label.textContent=this.options.label;

wrapper.appendChild(label);

}

const select=document.createElement("select");

select.className="select";

select.name=this.options.name;

select.disabled=this.options.disabled;

if(this.options.placeholder){

const placeholder=document.createElement("option");

placeholder.value="";

placeholder.textContent=this.options.placeholder;

placeholder.disabled=true;

placeholder.selected=!this.options.value;

select.appendChild(placeholder);

}

this.options.options.forEach(option=>{

const item=document.createElement("option");

if(typeof option==="string"){

item.value=option;

item.textContent=option;

}else{

item.value=option.value;

item.textContent=option.label;

}

if(item.value===this.options.value){

item.selected=true;

}

select.appendChild(item);

});

wrapper.appendChild(select);

if(this.options.helperText){

const helper=document.createElement("small");

helper.className="form-helper";

helper.textContent=this.options.helperText;

wrapper.appendChild(helper);

}

if(typeof this.options.onChange==="function"){

select.addEventListener("change",event=>{

this.options.onChange(

event.target.value,

event

);

});

}

return wrapper;

}

get(){

return this.element.querySelector("select");

}

value(){

return this.get().value;

}

set(value){

this.get().value=value;

}

enable(){

this.get().disabled=false;

}

disable(){

this.get().disabled=true;

}

clear(){

this.get().selectedIndex=0;

}

setOptions(options=[]){

const select=this.get();

const current=this.value();

select.innerHTML="";

options.forEach(option=>{

const item=document.createElement("option");

if(typeof option==="string"){

item.value=option;

item.textContent=option;

}else{

item.value=option.value;

item.textContent=option.label;

}

select.appendChild(item);

});

if(current){

select.value=current;

}

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

}

export function createDropdown(options){

return new Dropdown(options);

}
