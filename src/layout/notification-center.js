/*
=========================================================
BondStats Finora
Notification Center
Version 1.0.0
=========================================================
*/

import { Events, on } from "../core/events.js";

class NotificationCenterManager{

constructor(){
this.root=null;
this.items=[];
}

initialize(){

this.root=document.getElementById("notification-center");

if(!this.root){
return;
}

on(Events.NOTIFICATION,data=>{
this.add(data);
});

this.render();

}

add(data={}){

const item={
id:crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
title:data.title||"BondStats Finora",
message:data.message||"",
createdAt:new Date().toISOString()
};

this.items.unshift(item);

this.items=this.items.slice(0,8);

this.render();

}

render(){

if(!this.root){
return;
}

this.root.innerHTML=this.items.map(item=>`

<div class="card notification-card">

<strong>${escapeHTML(item.title)}</strong>

<p style="margin-top:8px">${escapeHTML(item.message)}</p>

<small>${new Date(item.createdAt).toLocaleTimeString()}</small>

</div>

`).join("");

}

clear(){

this.items=[];

this.render();

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

export const NotificationCenter=new NotificationCenterManager();

export default NotificationCenter;
