/*
=========================================================
BondStats Finora
Dashboard Metrics Engine
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";

export function calculateDashboardMetrics(){

const assets=State.getValue("portfolio.assets")||[];

const metrics={

assetCount:assets.length,

totalAllocation:0,

equityRatio:0,

bondRatio:0,

cashRatio:0,

portfolioHealth:100,

diversification:100,

risk:0

};

if(!assets.length){

metrics.portfolioHealth=0;
metrics.diversification=0;

return metrics;

}

const regions=new Set();
const sectors=new Set();
const assetTypes=new Set();

let weightedRisk=0;

assets.forEach(asset=>{

const allocation=Number(asset.allocation)||0;

metrics.totalAllocation+=allocation;

assetTypes.add(asset.type);

regions.add(asset.region);

sectors.add(asset.sector);

switch(asset.type){

case"Stocks":

metrics.equityRatio+=allocation;

break;

case"Bonds":

metrics.bondRatio+=allocation;

break;

case"Cash":

metrics.cashRatio+=allocation;

break;

}

weightedRisk+=allocation*(Number(asset.risk)||3);

});

metrics.risk=Math.round(

weightedRisk/

Math.max(metrics.totalAllocation,1)

);

metrics.diversification=Math.min(

100,

Math.round(

(

assetTypes.size*18+

regions.size*12+

sectors.size*8

)

)

);

metrics.portfolioHealth=Math.max(

0,

Math.min(

100,

Math.round(

100-

Math.abs(metrics.totalAllocation-100)

-

metrics.risk*4+

metrics.diversification*0.35

)

)

);

return metrics;

}

export function portfolioStatus(score){

if(score>=90){

return{

label:"Excellent",

color:"success"

};

}

if(score>=75){

return{

label:"Healthy",

color:"success"

};

}

if(score>=60){

return{

label:"Stable",

color:"warning"

};

}

if(score>=40){

return{

label:"Needs Attention",

color:"warning"

};

}

return{

label:"High Risk",

color:"danger"

};

}

export function dashboardSummary(){

const metrics=calculateDashboardMetrics();

const status=portfolioStatus(

metrics.portfolioHealth

);

return{

...metrics,

status

};

}
