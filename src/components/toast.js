/*
=========================================================
BondStats Finora
Toast Notification System
Version 1.0.0
=========================================================
*/

import { Events, on } from "../core/events.js";

class ToastManager{

constructor(){

this.root=null;
this.duration=3200;

}

initialize(){

this.root=document.getElementById("toast-root");

if(!this.root){

return;

}

on(Events.TOAST,data=>{

this.show(data);

});

}

show(options={}){

if(!this.root){

this.initialize();

}

const toast=document.createElement("div");

toast.className="toast";

const type=options.type||"info";

toast.classList.add(`toast-${type}`);

toast.innerHTML=`

<div class="toast-header">

<div class="toast-icon">

${this.icon(type)}

</div>

<div class="toast-title">

${escapeHTML(options.title||"BondStats Finora")}

</div>

</div>

<div class="toast-body">

${escapeHTML(options.message||"Notification")}

</div>

`;

this.root.appendChild(toast);

requestAnimationFrame(()=>{

toast.classList.add("visible");

});

setTimeout(()=>{

this.hide(toast);

},

options.duration||this.duration);

}

hide(toast){

toast.classList.add("hide");

setTimeout(()=>{

toast.remove();

},250);

}

icon(type){

switch(type){

case"success":

return"✓";

case"warning":

return"⚠";

case"danger":

return"✕";

default:

return"●";

}

}

}

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,char=>({

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

'"':"&quot;",

"'":"&#039;"

}[char]));

}

export const Toast=new ToastManager();

export function toast(message,type="success"){

Toast.show({

title:"BondStats Finora",

message,

type

});

}

export default Toast;
