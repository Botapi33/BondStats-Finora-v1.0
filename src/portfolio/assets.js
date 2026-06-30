/*
=========================================================
BondStats Finora
Portfolio Assets Model
Version 1.0.0
=========================================================
*/

export const ASSET_TYPES=[
"Stocks",
"Bonds",
"ETFs",
"Mutual Funds",
"REITs",
"Commodities",
"Gold",
"Cash",
"Crypto",
"Other"
];

export const REGIONS=[
"North America",
"Europe",
"Asia Pacific",
"Emerging Markets",
"Latin America",
"Middle East",
"Africa",
"Global"
];

export const SECTORS=[
"Technology",
"Financials",
"Healthcare",
"Energy",
"Consumer",
"Industrials",
"Utilities",
"Real Estate",
"Materials",
"Communication",
"Government",
"Diversified",
"Other"
];

export const CURRENCIES=[
"USD",
"EUR",
"CHF",
"GBP",
"JPY",
"CAD",
"AUD",
"Other"
];

export const RISK_LEVELS=[
{
value:1,
label:"Very Low"
},
{
value:2,
label:"Low"
},
{
value:3,
label:"Moderate"
},
{
value:4,
label:"High"
},
{
value:5,
label:"Very High"
}
];

export function createAsset(data={}){

return{

id:data.id||crypto.randomUUID(),

name:clean(data.name),

type:data.type||"Stocks",

allocation:toNumber(data.allocation),

region:data.region||"Global",

sector:data.sector||"Diversified",

currency:data.currency||"USD",

risk:toRisk(data.risk),

notes:clean(data.notes),

createdAt:data.createdAt||new Date().toISOString(),

updatedAt:new Date().toISOString()

};

}

export function validateAsset(asset){

const errors=[];

if(!asset.name){

errors.push("Asset name is required.");

}

if(!ASSET_TYPES.includes(asset.type)){

errors.push("Asset type is invalid.");

}

if(!Number.isFinite(asset.allocation)||asset.allocation<=0){

errors.push("Allocation must be greater than zero.");

}

if(asset.allocation>1000){

errors.push("Allocation is unrealistically high.");

}

if(!REGIONS.includes(asset.region)){

errors.push("Region is invalid.");

}

if(!SECTORS.includes(asset.sector)){

errors.push("Sector is invalid.");

}

if(!CURRENCIES.includes(asset.currency)){

errors.push("Currency is invalid.");

}

if(asset.risk<1||asset.risk>5){

errors.push("Risk level is invalid.");

}

return{

valid:errors.length===0,

errors

};

}

export function updateAsset(asset,updates={}){

return{

...asset,

...updates,

name:updates.name!==undefined?clean(updates.name):asset.name,

allocation:updates.allocation!==undefined?toNumber(updates.allocation):asset.allocation,

risk:updates.risk!==undefined?toRisk(updates.risk):asset.risk,

notes:updates.notes!==undefined?clean(updates.notes):asset.notes,

updatedAt:new Date().toISOString()

};

}

export function riskLabel(value){

const found=RISK_LEVELS.find(item=>item.value===Number(value));

return found?found.label:"Moderate";

}

export function riskClass(value){

const risk=Number(value);

if(risk<=2){

return"success";

}

if(risk===3){

return"warning";

}

return"danger";

}

function clean(value){

return String(value||"").trim();

}

function toNumber(value){

const number=Number(value);

return Number.isFinite(number)?number:0;

}

function toRisk(value){

const number=Number(value);

if(!Number.isFinite(number)){

return 3;

}

return Math.max(1,Math.min(5,Math.round(number)));

}
