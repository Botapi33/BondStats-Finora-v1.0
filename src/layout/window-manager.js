/*
=========================================================
BondStats Finora
Workspace Window Manager
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { emit, Events } from "../core/events.js";

class WindowManager{

constructor(){

this.windows=new Map();

this.zIndex=100;

this.container=null;

}

initialize(){

this.container=document.getElementById("modal-root");

}

create(options={}){

const id=options.id||crypto.randomUUID();

const windowElement=document.createElement("div");

windowElement.className="finora-window";

windowElement.dataset.window=id;

windowElement.style.zIndex=++this.zIndex;

windowElement.innerHTML=`

<div class="window-header">

<div class="window-title">

${options.title||"Window"}

</div>

<div class="window-actions">

<button class="window-minimize">—</button>

<button class="window-maximize">□</button>

<button class="window-close">✕</button>

</div>

</div>

<div class="window-body">

${options.content||""}

</div>

`;

this.container.appendChild(windowElement);

this.windows.set(id,{

id,

element:windowElement,

maximized:false,

minimized:false

});

this.makeDraggable(windowElement);

this.bindWindowEvents(id);

emit(

Events.NOTIFICATION,

{

title:"Window",

message:`${options.title||"Workspace"} opened.`

}

);

return id;

}

bindWindowEvents(id){

const windowObject=this.windows.get(id);

const element=windowObject.element;

element.querySelector(".window-close").addEventListener("click",()=>{

this.close(id);

});

element.querySelector(".window-minimize").addEventListener("click",()=>{

this.minimize(id);

});

element.querySelector(".window-maximize").addEventListener("click",()=>{

this.maximize(id);

});

element.addEventListener("mousedown",()=>{

this.focus(id);

});

}

focus(id){

const windowObject=this.windows.get(id);

if(!windowObject){

return;

}

windowObject.element.style.zIndex=++this.zIndex;

}

minimize(id){

const windowObject=this.windows.get(id);

if(!windowObject){

return;

}

windowObject.minimized=!windowObject.minimized;

windowObject.element.classList.toggle(

"window-minimized",

windowObject.minimized

);

}

maximize(id){

const windowObject=this.windows.get(id);

if(!windowObject){

return;

}

windowObject.maximized=!windowObject.maximized;

windowObject.element.classList.toggle(

"window-maximized",

windowObject.maximized

);

}

close(id){

const windowObject=this.windows.get(id);

if(!windowObject){

return;

}

windowObject.element.remove();

this.windows.delete(id);

}

makeDraggable(windowElement){

let active=false;

let startX=0;

let startY=0;

let originX=0;

let originY=0;

const header=windowElement.querySelector(".window-header");

header.addEventListener("mousedown",event=>{

active=true;

startX=event.clientX;

startY=event.clientY;

const rect=windowElement.getBoundingClientRect();

originX=rect.left;

originY=rect.top;

windowElement.style.position="fixed";

});

window.addEventListener("mousemove",event=>{

if(!active){

return;

}

const dx=event.clientX-startX;

const dy=event.clientY-startY;

windowElement.style.left=`${originX+dx}px`;

windowElement.style.top=`${originY+dy}px`;

});

window.addEventListener("mouseup",()=>{

active=false;

});

}

closeAll(){

this.windows.forEach(window=>{

window.element.remove();

});

this.windows.clear();

}

count(){

return this.windows.size;

}

}

export const WorkspaceWindows=new WindowManager();

export default WorkspaceWindows;
