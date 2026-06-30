/*
=========================================================
BondStats Finora
Validation Utilities
Version 1.0.0
=========================================================
*/

/*
Pure validation helpers.

No DOM
No Storage
No Router
No State

Safe to import everywhere.
*/

export function required(value){

return String(value??"").trim().length>0;

}

export function minLength(value,length){

return String(value??"").trim().length>=length;

}

export function maxLength(value,length){

return String(value??"").trim().length<=length;

}

export function between(value,min,max){

value=Number(value);

return Number.isFinite(value)&&value>=min&&value<=max;

}

export function positive(value){

return Number(value)>0;

}

export function percentage(value){

return between(value,0,100);

}

export function allocation(value){

return between(value,0,1000);

}

export function integer(value){

return Number.isInteger(Number(value));

}

export function email(value){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

String(value).trim()

);

}

export function url(value){

try{

new URL(value);

return true;

}catch{

return false;

}

}

export function currency(value){

return /^[A-Z]{3}$/.test(

String(value).trim()

);

}

export function riskLevel(value){

return between(value,1,5);

}

export function assetName(value){

return required(value)&&maxLength(value,120);

}

export function notes(value){

return maxLength(value,5000);

}

export function portfolio(assetList){

const errors=[];

if(!Array.isArray(assetList)){

errors.push("Portfolio must be an array.");

return{

valid:false,

errors

};

}

let allocation=0;

assetList.forEach(asset=>{

allocation+=Number(asset.allocation)||0;

});

if(allocation>100.01){

errors.push("Portfolio allocation exceeds 100%.");

}

return{

valid:errors.length===0,

errors

};

}

export function validateAsset(asset){

const errors=[];

if(!assetName(asset.name)){

errors.push("Invalid asset name.");

}

if(!allocation(asset.allocation)){

errors.push("Invalid allocation.");

}

if(!riskLevel(asset.risk)){

errors.push("Risk level must be between 1 and 5.");

}

if(!currency(asset.currency)){

errors.push("Currency code must be ISO-4217.");

}

if(!notes(asset.notes)){

errors.push("Notes exceed maximum length.");

}

return{

valid:errors.length===0,

errors

};

}

export function sanitizeText(value){

return String(value??"")

.replace(/<[^>]*>/g,"")

.replace(/\s+/g," ")

.trim();

}

export function sanitizeAsset(asset){

return{

...asset,

name:sanitizeText(asset.name),

notes:sanitizeText(asset.notes),

region:sanitizeText(asset.region),

sector:sanitizeText(asset.sector),

type:sanitizeText(asset.type),

currency:sanitizeText(asset.currency)

};

}

export default{

required,

minLength,

maxLength,

between,

positive,

percentage,

allocation,

integer,

email,

url,

currency,

riskLevel,

assetName,

notes,

portfolio,

validateAsset,

sanitizeText,

sanitizeAsset

};
