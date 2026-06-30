/*
=========================================================
BondStats Finora
Portfolio Rebalancing Engine
Version 1.0.0
=========================================================
*/

import {
assetAllocation,
sectorExposure,
regionExposure,
currencyExposure,
cashRatio,
bondRatio,
equityRatio,
diversificationScore,
totalAllocation,
weightedRisk
} from "./analytics.js";

import {
allocationDrift,
targetAllocationModel
} from "./allocation.js";

export function generateRebalancingPlan(profile="balanced"){

const recommendations=[];

const total=totalAllocation();

const cash=cashRatio();

const bonds=bondRatio();

const equity=equityRatio();

const diversification=diversificationScore();

const risk=weightedRisk();

const assetExposure=assetAllocation();

const sectors=sectorExposure();

const regions=regionExposure();

const currencies=currencyExposure();

if(total<98){

recommendations.push({

type:"allocation",

priority:"high",

title:"Increase Total Allocation",

action:`Deploy approximately ${(100-total).toFixed(1)}% unassigned allocation.`,

reason:"Portfolio weights below 100% reduce the accuracy of exposure analytics."

});

}

if(total>102){

recommendations.push({

type:"allocation",

priority:"high",

title:"Reduce Total Allocation",

action:`Reduce portfolio weights by approximately ${(total-100).toFixed(1)}%.`,

reason:"Portfolio allocation above 100% creates distorted analytics."

});

}

if(cash<5){

recommendations.push({

type:"liquidity",

priority:"medium",

title:"Increase Cash",

action:"Add a modest cash buffer.",

reason:"Cash improves liquidity, flexibility and stress resilience."

});

}

if(bonds<15){

recommendations.push({

type:"defensive",

priority:"medium",

title:"Increase Bonds",

action:"Consider adding bond exposure.",

reason:"Bonds can reduce volatility and improve defensive portfolio balance."

});

}

if(equity>70){

recommendations.push({

type:"risk",

priority:"medium",

title:"Reduce Equity Concentration",

action:"Lower equity-like exposure or add defensive assets.",

reason:"High equity concentration increases drawdown sensitivity."

});

}

if(risk>=4){

recommendations.push({

type:"risk",

priority:"high",

title:"Reduce High-Risk Exposure",

action:"Lower high-risk assets or offset them with defensive allocation.",

reason:"Weighted portfolio risk is elevated."

});

}

Object.entries(sectors).forEach(([sector,value])=>{

if(value>40){

recommendations.push({

type:"sector",

priority:"medium",

title:`Reduce ${sector}`,

action:`Reduce ${sector} exposure below 40%.`,

reason:`${sector} exposure is ${value.toFixed(1)}%, creating sector concentration.`

});

}

});

Object.entries(regions).forEach(([region,value])=>{

if(value>55){

recommendations.push({

type:"region",

priority:"medium",

title:"Add International Exposure",

action:`Reduce dependency on ${region} by adding other regions.`,

reason:`${region} represents ${value.toFixed(1)}% of the portfolio.`

});

}

});

Object.entries(currencies).forEach(([currency,value])=>{

if(value>75){

recommendations.push({

type:"currency",

priority:"low",

title:"Improve Currency Diversification",

action:`Review ${currency} concentration and consider multi-currency exposure.`,

reason:`${currency} exposure is ${value.toFixed(1)}%.`

});

}

});

if(diversification<60){

recommendations.push({

type:"diversification",

priority:"high",

title:"Improve Diversification",

action:"Add more asset classes, sectors, regions or currencies.",

reason:"Diversification score is below the preferred range."

});

}

if(!assetExposure["Gold"]&&!assetExposure["Commodities"]){

recommendations.push({

type:"inflation",

priority:"low",

title:"Add Inflation Hedge",

action:"Consider gold or commodity exposure if aligned with portfolio objectives.",

reason:"No explicit inflation-sensitive real asset allocation is visible."

});

}

const drift=allocationDrift(profile)

.filter(item=>Math.abs(item.drift)>=5)

.slice(0,5);

drift.forEach(item=>{

recommendations.push({

type:"target-model",

priority:Math.abs(item.drift)>=15?"high":"medium",

title:`Rebalance ${item.assetType}`,

action:item.drift>0

?`Reduce ${item.assetType} by ${Math.abs(item.drift).toFixed(1)}%.`

:`Increase ${item.assetType} by ${Math.abs(item.drift).toFixed(1)}%.`,

reason:`Current ${item.assetType} allocation is ${item.current.toFixed(1)}% versus target ${item.target.toFixed(1)}%.`

});

});

if(recommendations.length===0){

recommendations.push({

type:"status",

priority:"low",

title:"Portfolio Structure Balanced",

action:"Maintain current allocation discipline.",

reason:"No major rebalancing issues detected."

});

}

return prioritize(recommendations);

}

export function targetModelSummary(profile="balanced"){

const target=targetAllocationModel(profile);

return Object.entries(target)

.map(([assetType,value])=>({

assetType,

target:value,

current:assetAllocation()[assetType]||0,

drift:(assetAllocation()[assetType]||0)-value

}))

.sort((a,b)=>Math.abs(b.drift)-Math.abs(a.drift));

}

function prioritize(items){

const weight={

high:3,

medium:2,

low:1

};

return items.sort((a,b)=>weight[b.priority]-weight[a.priority]);

}
