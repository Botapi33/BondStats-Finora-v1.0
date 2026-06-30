/*
=========================================================
BondStats Finora
Application Router
Version 1.0.0
=========================================================
*/

import State from "./state.js";
import { ROUTES } from "./config.js";
import { emit, Events } from "./events.js";

class Router{

constructor(){

this.views=new Map();

this.currentRoute="dashboard";

}

initialize(){

this.cacheViews();

this.registerNavigation();

this.registerHashRouting();

const initial=this.getInitialRoute();

this.navigate(initial,false);

}

cacheViews(){

document.querySelectorAll(".view").forEach(view=>{

const route=view.id.replace("-view","");

this.views.set(route,view);

});

}

registerNavigation(){

document.querySelectorAll("[data-route]").forEach(button=>{

button.addEventListener("click",()=>{

this.navigate(button.dataset.route);

});

});

}

registerHashRouting(){

window.addEventListener("hashchange",()=>{

const route=location.hash.replace("#","");

if(route){

this.navigate(route,false);

}

});

}

getInitialRoute(){

const hash=location.hash.replace("#","");

if(hash&&ROUTES.includes(hash)){

return hash;

}

return State.getValue("ui.route")||"dashboard";

}

navigate(route,updateHash=true){

if(!ROUTES.includes(route)){

route="dashboard";

}

this.currentRoute=route;

State.set("ui.route",route);

this.views.forEach(view=>{

view.classList.remove("active");

});

const active=this.views.get(route);

if(active){

active.classList.add("active");

}

document.querySelectorAll("[data-route]").forEach(button=>{

button.classList.toggle(

"active",

button.dataset.route===route

);

});

if(updateHash){

history.replaceState(

null,

"",

`#${route}`

);

}

emit(

Events.ROUTE_CHANGE,

{

route

}

);

}

current(){

return this.currentRoute;

}

}

export const AppRouter=new Router();

export default AppRouter;
