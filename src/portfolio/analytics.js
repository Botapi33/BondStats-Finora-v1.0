/*
=========================================================
BondStats Finora
Portfolio Analytics Engine
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";

export function getAssets(){

return State.getValue("portfolio.assets")||[];

}

export function totalAllocation(assets=getAssets()){

return assets.reduce((sum,asset)=>{

return sum+(Number(asset.allocation)||0);

},0);

}

export function groupExposure(key,assets=getAssets()){

const result={};

assets.forEach(asset=>{

const label=asset[key]||"Other";

result[label]=(result[label]||0)+(Number(asset.allocation)||0);

});

return sortExposure(result);

}

export function assetAllocation(){

return groupExposure("type");

}

export function regionExposure(){

return groupExposure("region");

}

export function sectorExposure(){

return groupExposure("sector");

}

export function currencyExposure(){

return groupExposure("currency");

}

export function riskDistribution(assets=getAssets()){

const result={

"Very Low":0,

"Low":0,

"Moderate":0,

"High":0,

"Very High":0

};

assets.forEach(asset=>{

const allocation=Number(asset.allocation)||0;

switch(Number(asset.risk)){

case 1:

result["Very Low"]+=allocation;

break;

case 2:

result["Low"]+=allocation;

break;

case 3:

result["Moderate"]+=allocation;

break;

case 4:

result["High"]+=allocation;

break;

case 5:

result["Very High"]+=allocation;

break;

default:

result["Moderate"]+=allocation;

}

});

return sortExposure(result);

}

export function weightedRisk(assets=getAssets()){

const total=totalAllocation(assets);

if(total<=0){

return 0;

}

const weighted=assets.reduce((sum,asset)=>{

return sum+(Number(asset.risk)||3)*(Number(asset.allocation)||0);

},0);

return weighted/total;

}

export function concentrationRatio(assets=getAssets()){

if(!assets.length){

return 0;

}

const largest=Math.max(

...assets.map(asset=>Number(asset.allocation)||0)

);

return largest;

}

export function herfindahlIndex(assets=getAssets()){

const total=totalAllocation(assets);

if(total<=0){

return 0;

}

return assets.reduce((sum,asset)=>{

const share=(Number(asset.allocation)||0)/total;

return sum+(share*share);

},0);

}

export function diversificationScore(assets=getAssets()){

if(!assets.length){

return 0;

}

const typeCount=Object.keys(groupExposure("type",assets)).length;

const regionCount=Object.keys(groupExposure("region",assets)).length;

const sectorCount=Object.keys(groupExposure("sector",assets)).length;

const currencyCount=Object.keys(groupExposure("currency",assets)).length;

const hhi=herfindahlIndex(assets);

let score=

typeCount*14+

regionCount*12+

sectorCount*10+

currencyCount*7+

Math.min(assets.length*4,20);

score-=hhi*35;

return clampScore(score);

}

export function cashRatio(assets=getAssets()){

return assetAllocationFromAssets(assets)["Cash"]||0;

}

export function bondRatio(assets=getAssets()){

return assetAllocationFromAssets(assets)["Bonds"]||0;

}

export function equityRatio(assets=getAssets()){

const exposure=assetAllocationFromAssets(assets);

return(

(exposure["Stocks"]||0)+

(exposure["ETFs"]||0)+

(exposure["Mutual Funds"]||0)+

(exposure["REITs"]||0)

);

}

export function portfolioHealthScore(assets=getAssets()){

if(!assets.length){

return 0;

}

const total=totalAllocation(assets);

const allocationScore=clampScore(

100-Math.abs(100-total)*1.8

);

const diversification=diversificationScore(assets);

const risk=weightedRisk(assets);

let riskBalance=100;

if(risk>3.4){

riskBalance-=(risk-3.4)*26;

}

if(risk<1.7){

riskBalance-=(1.7-risk)*12;

}

riskBalance=clampScore(riskBalance);

const concentration=100-concentrationRatio(assets);

return clampScore(

allocationScore*.24+

diversification*.34+

riskBalance*.24+

concentration*.18

);

}

export function portfolioStatus(score=portfolioHealthScore()){

if(score>=90){

return{

label:"Elite",

tone:"success"

};

}

if(score>=78){

return{

label:"Healthy",

tone:"success"

};

}

if(score>=62){

return{

label:"Stable",

tone:"warning"

};

}

if(score>=42){

return{

label:"Watch",

tone:"warning"

};

}

return{

label:"High Risk",

tone:"danger"

};

}

export function calculateAnalytics(){

const assets=getAssets();

const health=portfolioHealthScore(assets);

return{

assetCount:assets.length,

totalAllocation:totalAllocation(assets),

assetAllocation:assetAllocation(),

regionExposure:regionExposure(),

sectorExposure:sectorExposure(),

currencyExposure:currencyExposure(),

riskDistribution:riskDistribution(assets),

weightedRisk:weightedRisk(assets),

concentrationRatio:concentrationRatio(assets),

herfindahlIndex:herfindahlIndex(assets),

diversificationScore:diversificationScore(assets),

healthScore:health,

status:portfolioStatus(health),

cashRatio:cashRatio(assets),

bondRatio:bondRatio(assets),

equityRatio:equityRatio(assets)

};

}

function assetAllocationFromAssets(assets){

const result={};

assets.forEach(asset=>{

const type=asset.type||"Other";

result[type]=(result[type]||0)+(Number(asset.allocation)||0);

});

return result;

}

function sortExposure(object){

return Object.fromEntries(

Object.entries(object)

.sort((a,b)=>b[1]-a[1])

);

}

function clampScore(value){

return Math.round(

Math.max(

0,

Math.min(

100,

Number(value)||0

)

)

);

}
