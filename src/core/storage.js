/*
=========================================================
BondStats Finora
Persistent Storage Manager
Version 1.0.0
=========================================================
*/

import State from "./state.js";
import { STORAGE } from "./config.js";

class StorageManager{

constructor(){

this.prefix=STORAGE.database;

}

initialize(){

this.load();

window.addEventListener("beforeunload",()=>{

this.save();

});

}

save(){

try{

const snapshot=State.get();

localStorage.setItem(

this.prefix,

JSON.stringify(snapshot)

);

return true;

}catch(error){

console.error(

"[Storage] Save failed",

error

);

return false;

}

}

load(){

try{

const raw=localStorage.getItem(this.prefix);

if(!raw){

return false;

}

const data=JSON.parse(raw);

this.merge(State.get(),data);

return true;

}catch(error){

console.error(

"[Storage] Load failed",

error

);

return false;

}

}

clear(){

localStorage.removeItem(this.prefix);

State.reset();

}

backup(){

return JSON.stringify(

State.get(),

null,

2

);

}

restore(json){

try{

const data=JSON.parse(json);

this.merge(

State.get(),

data

);

this.save();

return true;

}catch(error){

console.error(

"[Storage] Restore failed",

error

);

return false;

}

}

saveSection(section){

try{

localStorage.setItem(

`${this.prefix}.${section}`,

JSON.stringify(

State.getValue(section)

)

);

}catch(error){

console.error(error);

}

}

loadSection(section){

try{

const raw=localStorage.getItem(

`${this.prefix}.${section}`

);

if(!raw){

return;

}

State.set(

section,

JSON.parse(raw)

);

}catch(error){

console.error(error);

}

}

merge(target,source){

Object.keys(source).forEach(key=>{

if(

typeof source[key]==="object"&&

source[key]!==null&&

!Array.isArray(source[key])

){

if(!target[key]){

target[key]={};

}

this.merge(

target[key],

source[key]

);

}else{

target[key]=source[key];

}

});

}

downloadBackup(){

const blob=new Blob(

[this.backup()],

{

type:"application/json"

}

);

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=`bondstats-finora-backup-${Date.now()}.json`;

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);

}

}

export const Storage=new StorageManager();

export default Storage;
