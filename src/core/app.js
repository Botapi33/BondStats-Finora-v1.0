/*
=========================================================
BondStats Finora
Application Bootstrap
Version 1.0.0
=========================================================
*/

import State from "./state.js";
import Storage from "./storage.js";
import AppRouter from "./router.js";
import { APP } from "./config.js";
import { emit, Events } from "./events.js";

import { createSidebar } from "../layout/sidebar.js";
import { createTopbar } from "../layout/topbar.js";
import { createWorkspace } from "../layout/workspace.js";

import { initializeDashboard } from "../dashboard/dashboard.js";
import { initializePortfolio } from "../portfolio/portfolio.js";
import { initializeResearch } from "../research/research.js";
import { initializeLearn } from "../learn/learn.js";
import { initializeBrief } from "../brief/brief.js";
import { initializeFuture } from "../future/future.js";
import { initializeAI } from "../ai/ai.js";

class FinoraApplication{

async start(){

try{

this.showLoading();

Storage.initialize();

createSidebar();

createTopbar();

createWorkspace();

initializeDashboard();

initializePortfolio();

initializeResearch();

initializeLearn();

initializeBrief();

initializeFuture();

initializeAI();

AppRouter.initialize();

this.registerServiceWorker();

this.registerGlobalEvents();

this.hideLoading();

State.set("app.initialized",true);

State.set("app.loading",false);

emit(Events.APP_READY);

console.info(

`${APP.name} ${APP.version} started successfully.`

);

}catch(error){

console.error(error);

this.showFatalError(error);

}

}

showLoading(){

const boot=document.getElementById("boot-screen");

const progress=document.getElementById("boot-progress-bar");

let value=0;

const timer=setInterval(()=>{

value+=4;

progress.style.width=`${value}%`;

if(value>=100){

clearInterval(timer);

}

},18);

}

hideLoading(){

setTimeout(()=>{

const boot=document.getElementById("boot-screen");

const app=document.getElementById("application");

boot.classList.add("boot-hidden");

app.classList.remove("hidden");

setTimeout(()=>{

boot.remove();

},500);

},700);

}

registerServiceWorker(){

if(!("serviceWorker" in navigator)){

return;

}

window.addEventListener("load",()=>{

navigator.serviceWorker

.register("./sw.js")

.catch(console.error);

});

}

registerGlobalEvents(){

window.addEventListener("online",()=>{

emit(

Events.NOTIFICATION,

{

title:"Online",

message:"Internet connection restored."

}

);

});

window.addEventListener("offline",()=>{

emit(

Events.NOTIFICATION,

{

title:"Offline",

message:"Offline mode active."

}

);

});

window.addEventListener("keydown",event=>{

if(!(event.metaKey||event.ctrlKey)){

return;

}

switch(event.key.toLowerCase()){

case"k":

event.preventDefault();

document.dispatchEvent(

new CustomEvent("finora:command")

);

break;

case"1":

AppRouter.navigate("dashboard");

break;

case"2":

AppRouter.navigate("chat");

break;

case"3":

AppRouter.navigate("portfolio");

break;

case"4":

AppRouter.navigate("research");

break;

case"5":

AppRouter.navigate("learn");

break;

case"6":

AppRouter.navigate("future");

break;

case"7":

AppRouter.navigate("brief");

break;

}

});

}

showFatalError(error){

document.body.innerHTML=`

<div style="

display:flex;

justify-content:center;

align-items:center;

height:100vh;

background:#050907;

color:white;

font-family:Inter,sans-serif;

padding:40px;

text-align:center;

">

<div>

<h1>BondStats Finora</h1>

<h2 style="margin-top:20px">

Application failed to start

</h2>

<p style="margin-top:20px;color:#9fb5ac">

${error.message}

</p>

</div>

</div>

`;

}

}

const App=new FinoraApplication();

document.addEventListener(

"DOMContentLoaded",

()=>{

App.start();

}
);

export default App;
