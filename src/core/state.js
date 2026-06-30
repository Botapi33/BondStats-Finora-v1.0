/*
=========================================================
BondStats Finora
Global Application State
Version 1.0.0
=========================================================
*/

import { DEFAULT_SETTINGS } from "./config.js";

class StateManager{

constructor(){

this.state={

app:{

initialized:false,

loading:true,

version:"1.0.0"

},

ui:{

route:"dashboard",

sidebarOpen:false,

commandPalette:false,

notifications:[],

loading:false

},

user:{

mode:"professional"

},

settings:structuredClone(DEFAULT_SETTINGS),

portfolio:{

assets:[],

healthScore:0,

riskScore:0,

diversificationScore:0,

totalAllocation:0

},

chat:{

currentConversation:null,

conversations:[],

streaming:false,

history:[]

},

research:{

notes:[],

bookmarks:[],

collections:[]

},

learn:{

progress:0,

completedArticles:[],

completedQuizzes:[]

},

brief:{

lastGenerated:null,

notes:""

},

future:{

selectedScenario:"higher-rates",

savedScenarios:[]

}

};

this.listeners=new Set();

}

get(){

return this.state;

}

subscribe(callback){

this.listeners.add(callback);

return()=>{

this.listeners.delete(callback);

};

}

notify(){

this.listeners.forEach(listener=>{

try{

listener(this.state);

}catch(error){

console.error(error);

}

});

}

set(path,value){

const keys=path.split(".");

let current=this.state;

while(keys.length>1){

const key=keys.shift();

if(!(key in current)){

current[key]={};

}

current=current[key];

}

current[keys[0]]=value;

this.notify();

}

update(path,callback){

const current=this.getValue(path);

this.set(

path,

callback(current)

);

}

push(path,value){

const current=this.getValue(path);

if(Array.isArray(current)){

current.push(value);

this.notify();

}

}

remove(path,predicate){

const current=this.getValue(path);

if(Array.isArray(current)){

const filtered=current.filter(item=>!predicate(item));

this.set(path,filtered);

}

}

getValue(path){

const keys=path.split(".");

let current=this.state;

for(const key of keys){

if(current==null){

return undefined;

}

current=current[key];

}

return current;

}

reset(){

this.state.settings=structuredClone(DEFAULT_SETTINGS);

this.state.portfolio.assets=[];

this.state.chat.conversations=[];

this.state.chat.history=[];

this.state.research.notes=[];

this.state.research.bookmarks=[];

this.state.research.collections=[];

this.state.learn.completedArticles=[];

this.state.learn.completedQuizzes=[];

this.state.future.savedScenarios=[];

this.notify();

}

}

export const State=new StateManager();

export default State;
