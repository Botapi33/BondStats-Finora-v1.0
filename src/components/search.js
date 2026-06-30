/*
=========================================================
BondStats Finora
Search Component
Version 1.0.0
=========================================================
*/

export class Search{

constructor(options={}){

this.options={

placeholder:"Search...",

value:"",

debounce:120,

className:"",

ariaLabel:"Search",

onSearch:null,

onClear:null,

...options

};

this.timer=null;

this.element=this.create();

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`search-component ${this.options.className}`.trim();

wrapper.innerHTML=`

<svg
class="search-component-icon"
viewBox="0 0 24 24"
fill="none"
aria-hidden="true">

<circle
cx="11"
cy="11"
r="7"
stroke="currentColor"
stroke-width="2"/>

<path
d="M20 20L17 17"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"/>

</svg>

<input
class="search-component-input"
type="search"
value="${escapeHTML(this.options.value)}"
placeholder="${escapeHTML(this.options.placeholder)}"
aria-label="${escapeHTML(this.options.ariaLabel)}">

<button
class="search-component-clear"
type="button"
aria-label="Clear search">

✕

</button>

`;

const input=wrapper.querySelector("input");

const clear=wrapper.querySelector("button");

input.addEventListener("input",event=>{

clearTimeout(this.timer);

this.timer=setTimeout(()=>{

this.options.onSearch?.(

event.target.value,

event

);

},this.options.debounce);

});

input.addEventListener("keydown",event=>{

if(event.key==="Escape"){

this.clear();

}

});

clear.addEventListener("click",()=>{

this.clear();

});

return wrapper;

}

value(){

return this.element.querySelector("input").value;

}

set(value){

const input=this.element.querySelector("input");

input.value=value;

this.options.onSearch?.(value);

}

clear(){

const input=this.element.querySelector("input");

input.value="";

this.options.onClear?.();

this.options.onSearch?.("");

input.focus();

}

focus(){

this.element.querySelector("input").focus();

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

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,character=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[character]));

}

export function createSearch(options){

return new Search(options);

}
