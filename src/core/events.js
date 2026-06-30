/*
=========================================================
BondStats Finora
Global Event Bus
Version 1.0.1
=========================================================
*/

class FinoraEventBus{

constructor(){
this.events=new Map();
}

on(event,callback){

if(typeof callback!=="function"){
throw new TypeError("Event callback must be a function.");
}

if(!this.events.has(event)){
this.events.set(event,new Set());
}

this.events.get(event).add(callback);

return()=>this.off(event,callback);

}

once(event,callback){

const unsubscribe=this.on(event,payload=>{

unsubscribe();
callback(payload);

});

return unsubscribe;

}

off(event,callback){

if(!this.events.has(event)){
return;
}

this.events.get(event).delete(callback);

if(this.events.get(event).size===0){
this.events.delete(event);
}

}

emit(event,payload={}){

if(!this.events.has(event)){
return;
}

this.events.get(event).forEach(callback=>{

try{
callback(payload);
}catch(error){
console.error(`[Finora Event Error] ${event}`,error);
}

});

}

clear(event){

if(event){
this.events.delete(event);
return;
}

this.events.clear();

}

listenerCount(event){

return this.events.get(event)?.size||0;

}

has(event){

return this.events.has(event);

}

}

const bus=new FinoraEventBus();

export const EventBus=bus;

export const Events=Object.freeze({

APP_READY:"app:ready",
APP_LOADING:"app:loading",
APP_ERROR:"app:error",

ROUTE_CHANGE:"route:change",

SIDEBAR_TOGGLE:"sidebar:toggle",

THEME_CHANGE:"theme:change",

SEARCH:"search",

CHAT_NEW:"chat:new",
CHAT_SEND:"chat:send",
CHAT_STREAM:"chat:stream",
CHAT_COMPLETE:"chat:complete",
CHAT_STOP:"chat:stop",

PORTFOLIO_UPDATED:"portfolio:updated",
PORTFOLIO_ADD:"portfolio:add",
PORTFOLIO_DELETE:"portfolio:delete",
PORTFOLIO_EDIT:"portfolio:edit",
PORTFOLIO_REBALANCE:"portfolio:rebalance",

RESEARCH_SAVE:"research:save",
NOTE_CREATED:"note:created",
BOOKMARK_CREATED:"bookmark:created",
COLLECTION_CREATED:"collection:created",

LEARN_PROGRESS:"learn:progress",

SCENARIO_CHANGED:"scenario:changed",

SETTINGS_CHANGED:"settings:changed",

NOTIFICATION:"notification",
TOAST:"toast"

});

export function emit(name,data={}){

bus.emit(name,data);

}

export function on(name,callback){

return bus.on(name,callback);

}

export function once(name,callback){

return bus.once(name,callback);

}

export function off(name,callback){

bus.off(name,callback);

}
