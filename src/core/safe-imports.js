/*
=========================================================
BondStats Finora
Safe Import Manager
Version 1.0.0
=========================================================
*/

/*
This module provides safe dynamic loading.

Goals

✓ Prevent duplicate initialization
✓ Avoid crashes if optional modules are missing
✓ Load every feature only once
✓ Compatible with ES Modules
*/

const loadedModules=new Map();

export async function loadModule(path){

if(loadedModules.has(path)){

return loadedModules.get(path);

}

try{

const module=await import(path);

loadedModules.set(path,module);

return module;

}catch(error){

console.warn(

`[Finora] Unable to load module: ${path}`,

error

);

return null;

}

}

export async function initializeModule(path,method="initialize"){

const module=await loadModule(path);

if(!module){

return false;

}

const fn=

module[method]||

module.default?.[method]||

module.default;

if(typeof fn==="function"){

try{

await fn();

return true;

}catch(error){

console.error(

`[Finora] Failed to initialize ${path}`,

error

);

}

}

return false;

}

export async function initializeModules(modules=[]){

for(const item of modules){

if(typeof item==="string"){

await initializeModule(item);

continue;

}

await initializeModule(

item.path,

item.method||"initialize"

);

}

}

export function moduleLoaded(path){

return loadedModules.has(path);

}

export function loadedModuleNames(){

return [...loadedModules.keys()];

}

export function unloadModule(path){

loadedModules.delete(path);

}

export function unloadAllModules(){

loadedModules.clear();

}

export async function preloadModules(paths=[]){

await Promise.all(

paths.map(loadModule)

);

}

export default{

loadModule,

initializeModule,

initializeModules,

moduleLoaded,

loadedModuleNames,

unloadModule,

unloadAllModules,

preloadModules

};
