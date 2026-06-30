/*
=========================================================
BondStats Finora
Sidebar
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import AppRouter from "../core/router.js";

const MENU=[

{
route:"dashboard",
icon:"◈",
title:"Dashboard"
},

{
route:"chat",
icon:"✦",
title:"AI Workspace"
},

{
route:"portfolio",
icon:"⬢",
title:"Portfolio"
},

{
route:"research",
icon:"◫",
title:"Research"
},

{
route:"learn",
icon:"◎",
title:"Learn"
},

{
route:"future",
icon:"⬡",
title:"Future Lab"
},

{
route:"brief",
icon:"◌",
title:"Daily Brief"
},

{
route:"settings",
icon:"⚙",
title:"Settings"
}

];

export function createSidebar(){

const sidebar=document.getElementById("sidebar");

if(!sidebar){

return;

}

sidebar.innerHTML=`

<div class="sidebar-header">

<div class="brand">

<div class="brand-logo">

<div class="brand-core"></div>

</div>

<div>

<h2>

BondStats

<span>

Finora

</span>

</h2>

<p>

Financial Intelligence OS

</p>

</div>

</div>

</div>

<nav
class="sidebar-nav"
id="sidebar-nav">

${MENU.map(item=>menuItem(item)).join("")}

</nav>

<div class="sidebar-footer">

<div class="workspace-card">

<div class="workspace-title">

Workspace

</div>

<div class="workspace-value">

Professional

</div>

</div>

<div class="workspace-card">

<div class="workspace-title">

Portfolio Health

</div>

<div
class="health-ring">

92

</div>

</div>

<div class="offline-status">

<div class="offline-dot"></div>

Offline Mode Enabled

</div>

</div>

`;

bindNavigation();

}

function menuItem(item){

return`

<button

class="sidebar-item"

data-route="${item.route}"

>

<div class="sidebar-icon">

${item.icon}

</div>

<div class="sidebar-text">

${item.title}

</div>

</button>

`;

}

function bindNavigation(){

document

.querySelectorAll(".sidebar-item")

.forEach(button=>{

button.addEventListener("click",()=>{

document

.querySelectorAll(".sidebar-item")

.forEach(item=>{

item.classList.remove("active");

});

button.classList.add("active");

State.set(

"ui.route",

button.dataset.route

);

AppRouter.navigate(

button.dataset.route

);

if(window.innerWidth<900){

closeSidebar();

}

});

});

const first=document.querySelector(".sidebar-item");

if(first){

first.classList.add("active");

}

}

export function openSidebar(){

const sidebar=document.getElementById("sidebar");

sidebar?.classList.add("open");

State.set(

"ui.sidebarOpen",

true

);

}

export function closeSidebar(){

const sidebar=document.getElementById("sidebar");

sidebar?.classList.remove("open");

State.set(

"ui.sidebarOpen",

false

);

}

export function toggleSidebar(){

const sidebar=document.getElementById("sidebar");

if(!sidebar){

return;

}

sidebar.classList.toggle("open");

State.set(

"ui.sidebarOpen",

sidebar.classList.contains("open")

);

}
