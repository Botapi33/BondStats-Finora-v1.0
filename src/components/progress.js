/*
=========================================================
BondStats Finora
Progress Component
Version 1.0.0
=========================================================
*/

export class Progress{

constructor(options={}){

this.options={

label:"",

value:0,

max:100,

showValue:true,

animated:true,

variant:"emerald",

className:"",

...options

};

this.element=this.create();

requestAnimationFrame(()=>{

this.setValue(this.options.value);

});

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`progress-card ${this.options.className}`.trim();

wrapper.innerHTML=`

${this.options.label?`

<div class="progress-header">

<span class="progress-title">

${escapeHTML(this.options.label)}

</span>

${this.options.showValue?`

<span class="progress-value">

0%

</span>

`:""}

</div>

`:""}

<div class="progress">

<div
class="progress-fill progress-${this.options.variant}">

</div>

</div>

`;

return wrapper;

}

setValue(value){

const max=this.options.max||100;

const percentage=Math.max(

0,

Math.min(

100,

(value/max)*100

)

);

const fill=this.element.querySelector(".progress-fill");

const label=this.element.querySelector(".progress-value");

if(fill){

if(!this.options.animated){

fill.style.transition="none";

}

fill.style.width=`${percentage}%`;

}

if(label){

label.textContent=`${Math.round(percentage)}%`;

}

this.options.value=value;

}

increment(amount=1){

this.setValue(this.options.value+amount);

}

decrement(amount=1){

this.setValue(this.options.value-amount);

}

setLabel(text){

const title=this.element.querySelector(".progress-title");

if(title){

title.textContent=text;

}

}

setVariant(name){

const fill=this.element.querySelector(".progress-fill");

fill.className=`progress-fill progress-${name}`;

this.options.variant=name;

}

reset(){

this.setValue(0);

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

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,character=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[character]));

}

export function createProgress(options){

return new Progress(options);

}
