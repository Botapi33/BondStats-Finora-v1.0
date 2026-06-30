/*
=========================================================
BondStats Finora
Input Component
Version 1.0.0
=========================================================
*/

export class Input{

constructor(options={}){

this.options={

label:"",

placeholder:"",

type:"text",

name:"",

value:"",

required:false,

disabled:false,

autocomplete:"off",

className:"",

helperText:"",

onInput:null,

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

const input=document.createElement("input");

input.className="input";

input.type=this.options.type;

input.name=this.options.name;

input.placeholder=this.options.placeholder;

input.value=this.options.value;

input.required=this.options.required;

input.disabled=this.options.disabled;

input.autocomplete=this.options.autocomplete;

wrapper.appendChild(input);

if(this.options.helperText){

const helper=document.createElement("small");

helper.className="form-helper";

helper.textContent=this.options.helperText;

wrapper.appendChild(helper);

}

if(typeof this.options.onInput==="function"){

input.addEventListener("input",event=>{

this.options.onInput(event.target.value,event);

});

}

if(typeof this.options.onChange==="function"){

input.addEventListener("change",event=>{

this.options.onChange(event.target.value,event);

});

}

return wrapper;

}

get(){

return this.element.querySelector("input");

}

value(){

return this.get().value;

}

set(value){

this.get().value=value;

}

focus(){

this.get().focus();

}

disable(){

this.get().disabled=true;

}

enable(){

this.get().disabled=false;

}

clear(){

this.get().value="";

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

export function createInput(options){

return new Input(options);

}
