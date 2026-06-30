/*
=========================================================
BondStats Finora
Portfolio Allocation Engine
Version 1.0.0
=========================================================
*/

import {
getAssets,
totalAllocation,
assetAllocation,
sectorExposure,
regionExposure,
currencyExposure,
cashRatio,
bondRatio,
equityRatio
} from "./analytics.js";

export function allocationCompleteness(){

const total=totalAllocation();

return{

total,

complete:total>=99&&total<=101,

underAllocated:total<99,

overAllocated:total>101,

gap:100-total

};

}

export function allocationQuality(){

const allocation=allocationCompleteness();

let score=100;

score-=Math.abs(allocation.gap)*2;

return Math.max(0,Math.min(100,Math.round(score)));

}

export function largestPositions(limit=5){

return [...getAssets()]

.sort((a,b)=>(Number(b.allocation)||0)-(Number(a.allocation)||0))

.slice(0,limit);

}

export function smallestPositions(limit=5){

return [...getAssets()]

.sort((a,b)=>(Number(a.allocation)||0)-(Number(b.allocation)||0))

.slice(0,limit);

}

export function exposureSummary(){

return{

assetTypes:assetAllocation(),

sectors:sectorExposure(),

regions:regionExposure(),

currencies:currencyExposure(),

cash:cashRatio(),

bonds:bondRatio(),

equity:equityRatio()

};

}

export function concentrationWarnings(){

const warnings=[];

const exposures=exposureSummary();

Object.entries(exposures.assetTypes).forEach(([label,value])=>{

if(value>50){

warnings.push({

type:"asset-class",

label,

value,

message:`${label} exposure is ${value.toFixed(1)}%, creating asset class concentration.`

});

}

});

Object.entries(exposures.sectors).forEach(([label,value])=>{

if(value>40){

warnings.push({

type:"sector",

label,

value,

message:`${label} sector exposure is ${value.toFixed(1)}%, creating sector concentration.`

});

}

});

Object.entries(exposures.regions).forEach(([label,value])=>{

if(value>55){

warnings.push({

type:"region",

label,

value,

message:`${label} region exposure is ${value.toFixed(1)}%, creating geographic concentration.`

});

}

});

Object.entries(exposures.currencies).forEach(([label,value])=>{

if(value>70){

warnings.push({

type:"currency",

label,

value,

message:`${label} currency exposure is ${value.toFixed(1)}%, creating FX concentration.`

});

}

});

return warnings;

}

export function allocationDiagnostics(){

const completeness=allocationCompleteness();

const diagnostics=[];

if(completeness.underAllocated){

diagnostics.push({

title:"Portfolio Underallocated",

description:`${Math.abs(completeness.gap).toFixed(1)}% remains unassigned.`,

tone:"warning"

});

}

if(completeness.overAllocated){

diagnostics.push({

title:"Portfolio Overallocated",

description:`Allocation exceeds 100% by ${Math.abs(completeness.gap).toFixed(1)}%.`,

tone:"danger"

});

}

concentrationWarnings().forEach(warning=>{

diagnostics.push({

title:`High ${warning.label} Exposure`,

description:warning.message,

tone:"warning"

});

});

if(diagnostics.length===0){

diagnostics.push({

title:"Allocation Structure Healthy",

description:"No major allocation completeness or concentration warnings detected.",

tone:"success"

});

}

return diagnostics;

}

export function targetAllocationModel(profile="balanced"){

const models={

conservative:{

Bonds:45,

Stocks:25,

ETFs:15,

Cash:10,

Gold:5

},

balanced:{

Stocks:35,

Bonds:30,

ETFs:20,

Cash:7,

Gold:5,

REITs:3

},

growth:{

Stocks:50,

ETFs:25,

Bonds:10,

REITs:5,

Crypto:5,

Cash:5

},

aggressive:{

Stocks:55,

ETFs:20,

Crypto:10,

REITs:7,

Commodities:5,

Cash:3

}

};

return models[profile]||models.balanced;

}

export function allocationDrift(profile="balanced"){

const target=targetAllocationModel(profile);

const current=assetAllocation();

const keys=new Set([

...Object.keys(target),

...Object.keys(current)

]);

return [...keys].map(key=>{

const currentValue=current[key]||0;

const targetValue=target[key]||0;

return{

assetType:key,

current:currentValue,

target:targetValue,

drift:currentValue-targetValue

};

}).sort((a,b)=>Math.abs(b.drift)-Math.abs(a.drift));

}
