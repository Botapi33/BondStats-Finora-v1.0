/*
=========================================================
BondStats Finora
Topbar
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { toggleSidebar } from "./sidebar.js";

export function createTopbar(){

const topbar=document.getElementById("topbar");

if(!topbar){

return;

}

topbar.innerHTML=`

<div class="topbar-left">

<button

id="sidebar-toggle"

class="icon-button mobile-menu"

aria-label="Toggle Sidebar">

☰

</button>

<div class="search-wrapper">

<svg
class="search-icon"
viewBox="0 0 24 24"
fill="none">

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

id="global-search"

class="search-input"

type="search"

autocomplete="off"

placeholder="Search conversations, portfolio, notes or concepts...">

</div>

</div>

<div class="topbar-center">

<div class="workspace-pill">

<div class="workspace-dot"></div>

<span>

Professional Mode

</span>

</div>

</div>

<div class="topbar-right">

<button

id="command-button"

class="icon-button"

title="Command Palette">

⌘

</button>

<button

id="notification-button"

class="icon-button"

title="Notifications">

🔔

</button>

<button

id="profile-button"

class="profile-button">

<div class="profile-avatar">

BS

</div>

<div class="profile-info">

<strong>

BondStats

</strong>

<small>

Offline Workspace

</small>

</div>

</button>

</div>

`;

bindEvents();

}

function bindEvents(){

document

.getElementById("sidebar-toggle")

?.addEventListener(

"click",

toggleSidebar

);

const search=document.getElementById("global-search");

search?.addEventListener("input",event=>{

document.dispatchEvent(

new CustomEvent(

"finora-search",

{

detail:event.target.value

}

)

);

});

search?.addEventListener("keydown",event=>{

if(event.key==="Escape"){

event.target.blur();

}

});

document

.getElementById("command-button")

?.addEventListener("click",()=>{

document.dispatchEvent(

new CustomEvent(

"finora:command"

)

);

});

document

.getElementById("notification-button")

?.addEventListener("click",()=>{

document.dispatchEvent(

new CustomEvent(

"finora:notifications"

)

);

});

window.addEventListener("resize",()=>{

if(window.innerWidth>900){

State.set(

"ui.sidebarOpen",

true

);

}

});

}

export function setWorkspaceMode(mode){

const pill=document.querySelector(".workspace-pill span");

if(pill){

pill.textContent=`${mode} Mode`;

}

}

export function focusSearch(){

document

.getElementById("global-search")

?.focus();

}
