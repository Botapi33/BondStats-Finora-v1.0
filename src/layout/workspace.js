/*
=========================================================
BondStats Finora
Workspace Layout Manager
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { Events, on } from "../core/events.js";

const TITLES={

dashboard:"Dashboard",

chat:"AI Workspace",

portfolio:"Portfolio Intelligence",

research:"Research Workspace",

learn:"BondStats Learn",

future:"Future Lab",

brief:"Daily Brief",

settings:"Settings"

};

export function createWorkspace(){

const workspace=document.getElementById("workspace-root");

if(!workspace){

return;

}

workspace.setAttribute(

"role",

"main"

);

workspace.setAttribute(

"aria-live",

"polite"

);

initializeViews();

registerWorkspaceEvents();

updateTitle();

}

function initializeViews(){

document

.querySelectorAll(".view")

.forEach(view=>{

view.dataset.initialized="false";

});

}

function registerWorkspaceEvents(){

on(

Events.ROUTE_CHANGE,

({route})=>{

activate(route);

updateTitle(route);

}

);

document.addEventListener(

"finora-search",

event=>{

highlightSearch(

event.detail

);

}

);

}

function activate(route){

document

.querySelectorAll(".view")

.forEach(view=>{

view.classList.remove(

"active"

);

});

const active=document.getElementById(

`${route}-view`

);

if(!active){

return;

}

active.classList.add(

"active"

);

active.dataset.initialized="true";

window.scrollTo({

top:0,

behavior:"smooth"

});

State.set(

"ui.route",

route

);

}

function updateTitle(route=State.getValue("ui.route")){

document.title=

`BondStats Finora • ${TITLES[route]||"Workspace"}`;

}

function highlightSearch(query){

const root=document.getElementById("workspace-root");

if(!root){

return;

}

root

.querySelectorAll("mark.finora-search")

.forEach(mark=>{

const parent=mark.parentNode;

parent.replaceChild(

document.createTextNode(mark.textContent),

mark

);

parent.normalize();

});

if(!query){

return;

}

const walker=document.createTreeWalker(

root,

NodeFilter.SHOW_TEXT

);

const nodes=[];

while(walker.nextNode()){

nodes.push(walker.currentNode);

}

nodes.forEach(node=>{

const value=node.nodeValue;

if(

!value||

!value.toLowerCase().includes(

query.toLowerCase()

)

){

return;

}

const regex=new RegExp(

`(${escapeRegex(query)})`,

"ig"

);

const span=document.createElement("span");

span.innerHTML=value.replace(

regex,

"<mark class='finora-search'>$1</mark>"

);

node.parentNode.replaceChild(

span,

node

);

});

}

function escapeRegex(value){

return value.replace(

/[-/\\^$*+?.()|[\]{}]/g,

"\\$&"

);

}

export function showLoading(view){

const target=document.getElementById(

`${view}-view`

);

if(!target){

return;

}

target.innerHTML=`

<div class="workspace-loader">

<div class="loader-orb"></div>

<p>

Loading ${TITLES[view]}...

</p>

</div>

`;

}

export function clearWorkspace(view){

const target=document.getElementById(

`${view}-view`

);

if(target){

target.innerHTML="";

}

}

export function currentView(){

return State.getValue(

"ui.route"

);

}
