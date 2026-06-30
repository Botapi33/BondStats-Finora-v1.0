/*
=========================================================
BondStats Finora
Safe Boot Controller
Version 1.0.0
=========================================================
*/

import State from "./state.js";
import Storage from "./storage.js";
import Router from "./router.js";

import { createSidebar } from "../layout/sidebar.js";
import { createTopbar } from "../layout/topbar.js";
import { createWorkspace } from "../layout/workspace.js";
import CommandPalette from "../layout/command-palette.js";
import NotificationCenter from "../layout/notification-center.js";

import Toast from "../components/toast.js";

import { initializeDashboard } from "../dashboard/dashboard.js";
import { renderPortfolioWorkspace } from "../portfolio/portfolio-view.js";
import { initializeAI } from "../ai/ai.js";
import { initializeResearch } from "../research/research.js";
import { initializeLearn } from "../learn/learn.js";
import { initializeFuture } from "../future/future.js";
import { initializeBrief } from "../brief/brief.js";
import { initializeSettings } from "../settings/settings.js";

export async function bootFinora(){

try{

Storage.initialize();

Toast.initialize();

createSidebar();

createTopbar();

createWorkspace();

CommandPalette.initialize();

NotificationCenter.initialize();

initializeDashboard();

initializeAI();

initializeResearch();

initializeLearn();

initializeFuture();

initializeBrief();

initializeSettings();

const portfolioRoot=document.getElementById("portfolio-view");

if(portfolioRoot){

renderPortfolioWorkspace(portfolioRoot);

}

Router.initialize();

State.set("app.initialized",true);

State.set("app.loading",false);

hideBoot();

}catch(error){

console.error("[Finora Boot Error]",error);

showBootError(error);

}

}

function hideBoot(){

const boot=document.getElementById("boot-screen");

const app=document.getElementById("application");

if(app){

app.classList.remove("hidden");

}

if(!boot){

return;

}

const bar=document.getElementById("boot-progress-bar");

let value=0;

const interval=setInterval(()=>{

value+=8;

if(bar){

bar.style.width=`${Math.min(value,100)}%`;

}

if(value>=100){

clearInterval(interval);

boot.classList.add("boot-hidden");

setTimeout(()=>boot.remove(),480);

}

},18);

}

function showBootError(error){

const boot=document.getElementById("boot-screen");

if(!boot){

document.body.innerHTML=errorMarkup(error);

return;

}

boot.innerHTML=errorMarkup(error);

}

function errorMarkup(error){

return`

<div class="card" style="max-width:640px;margin:auto;text-align:center">

<h1>BondStats Finora</h1>

<h3 style="margin-top:18px">Application failed to start</h3>

<p style="margin-top:14px">${escapeHTML(error.message||"Unknown error")}</p>

<button class="button button-primary" style="margin-top:24px" onclick="location.reload()">
Reload Application
</button>

</div>

`;

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
