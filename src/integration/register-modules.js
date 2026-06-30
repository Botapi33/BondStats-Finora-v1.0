/*
=========================================================
BondStats Finora
Module Registration
Version 1.0.0
=========================================================
*/

/*
Central integration layer.

Purpose:
- Register every module exactly once.
- Prevent duplicate initialization.
- Avoid circular imports.
- Provide one place for future module extensions.
*/

const registry=new Map();

export function registerModule(name,initializer){

if(typeof name!=="string"||!name.trim()){

throw new Error("Module name is required.");

}

if(typeof initializer!=="function"){

throw new Error(`Module "${name}" requires an initializer.`);

}

if(registry.has(name)){

console.warn(`[Finora] Module "${name}" already registered.`);

return false;

}

registry.set(name,{

initializer,

initialized:false

});

return true;

}

export function initializeModules(){

registry.forEach((module,name)=>{

if(module.initialized){

return;

}

try{

module.initializer();

module.initialized=true;

console.info(`[Finora] ${name} initialized.`);

}catch(error){

console.error(

`[Finora] Failed to initialize ${name}`,

error

);

}

});

}

export function initializeModule(name){

const module=registry.get(name);

if(!module){

console.warn(`[Finora] Unknown module "${name}".`);

return;

}

if(module.initialized){

return;

}

try{

module.initializer();

module.initialized=true;

}catch(error){

console.error(

`[Finora] Failed to initialize ${name}`,

error

);

}

}

export function unregisterModule(name){

registry.delete(name);

}

export function moduleExists(name){

return registry.has(name);

}

export function isInitialized(name){

return registry.get(name)?.initialized===true;

}

export function registeredModules(){

return [...registry.keys()];

}

export function moduleStatus(){

return [...registry.entries()].map(([name,module])=>({

name,

initialized:module.initialized

}));

}

export function resetModules(){

registry.forEach(module=>{

module.initialized=false;

});

}

export default{

registerModule,

initializeModules,

initializeModule,

unregisterModule,

moduleExists,

registeredModules,

moduleStatus,

resetModules,

isInitialized

};
