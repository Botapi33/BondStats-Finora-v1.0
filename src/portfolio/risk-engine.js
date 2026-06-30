/*
=========================================================
BondStats Finora
Portfolio Risk Engine
Version 1.0.0
=========================================================
*/

import {
getAssets,
totalAllocation,
weightedRisk,
concentrationRatio,
herfindahlIndex,
groupExposure,
diversificationScore,
portfolioHealthScore
} from "./analytics.js";

export function calculateRiskEngine(){

const assets=getAssets();

if(!assets.length){

return emptyRiskEngine();

}

const total=totalAllocation(assets);

const risk={

overall:riskScore(assets),

concentration:concentrationRisk(assets),

geographic:geographicRisk(assets),

sector:sectorRisk(assets),

assetClass:assetClassRisk(assets),

allocation:allocationRisk(total),

diversification:diversificationRisk(assets),

liquidity:liquidityRisk(assets),

currency:currencyRisk(assets),

health:portfolioHealthScore(assets)

};

risk.grade=riskGrade(risk.overall);

risk.insights=riskInsights(risk);

return risk;

}

export function riskScore(assets=getAssets()){

if(!assets.length){

return 0;

}

const weighted=weightedRisk(assets);

const concentration=concentrationRisk(assets);

const geo=geographicRisk(assets);

const sector=sectorRisk(assets);

const assetClass=assetClassRisk(assets);

const allocation=allocationRisk(totalAllocation(assets));

const diversification=diversificationRisk(assets);

const liquidity=liquidityRisk(assets);

const currency=currencyRisk(assets);

const base=

weighted*12+

concentration*.18+

geo*.12+

sector*.14+

assetClass*.12+

allocation*.12+

diversification*.12+

liquidity*.10+

currency*.08;

return clamp(base);

}

export function concentrationRisk(assets=getAssets()){

if(!assets.length){

return 0;

}

const largest=concentrationRatio(assets);

const hhi=herfindahlIndex(assets)*100;

let score=0;

if(largest>20){

score+=(largest-20)*1.4;

}

score+=hhi*.55;

return clamp(score);

}

export function geographicRisk(assets=getAssets()){

const regions=groupExposure("region",assets);

const values=Object.values(regions);

if(values.length===0){

return 0;

}

const largest=Math.max(...values);

let score=0;

if(values.length===1){

score+=35;

}

if(largest>50){

score+=(largest-50)*1.1;

}

if(!regions["Global"]&&!regions["Emerging Markets"]&&values.length<3){

score+=14;

}

return clamp(score);

}

export function sectorRisk(assets=getAssets()){

const sectors=groupExposure("sector",assets);

const values=Object.values(sectors);

if(values.length===0){

return 0;

}

const largest=Math.max(...values);

let score=0;

if(largest>35){

score+=(largest-35)*1.3;

}

if(values.length<4){

score+=18;

}

return clamp(score);

}

export function assetClassRisk(assets=getAssets()){

const classes=groupExposure("type",assets);

const values=Object.values(classes);

if(values.length===0){

return 0;

}

const largest=Math.max(...values);

let score=0;

if(largest>45){

score+=(largest-45)*1.15;

}

if(!classes["Bonds"]){

score+=12;

}

if(!classes["Cash"]){

score+=10;

}

if(classes["Crypto"]>10){

score+=18;

}

return clamp(score);

}

export function allocationRisk(total=totalAllocation()){

let score=0;

if(total<95){

score+=(95-total)*1.8;

}

if(total>105){

score+=(total-105)*2.2;

}

return clamp(score);

}

export function diversificationRisk(assets=getAssets()){

return clamp(100-diversificationScore(assets));

}

export function liquidityRisk(assets=getAssets()){

const exposure=groupExposure("type",assets);

let score=0;

const cash=exposure["Cash"]||0;

const crypto=exposure["Crypto"]||0;

const reits=exposure["REITs"]||0;

if(cash<3){

score+=22;

}

if(cash<1){

score+=14;

}

if(crypto>15){

score+=14;

}

if(reits>25){

score+=10;

}

return clamp(score);

}

export function currencyRisk(assets=getAssets()){

const currencies=groupExposure("currency",assets);

const values=Object.values(currencies);

if(values.length===0){

return 0;

}

const largest=Math.max(...values);

let score=0;

if(values.length===1){

score+=25;

}

if(largest>75){

score+=(largest-75)*.9;

}

return clamp(score);

}

export function riskGrade(score){

if(score<=20){

return{

grade:"A",

label:"Low Risk",

tone:"success"

};

}

if(score<=40){

return{

grade:"B",

label:"Moderate Risk",

tone:"success"

};

}

if(score<=60){

return{

grade:"C",

label:"Elevated Risk",

tone:"warning"

};

}

if(score<=80){

return{

grade:"D",

label:"High Risk",

tone:"warning"

};

}

return{

grade:"F",

label:"Extreme Risk",

tone:"danger"

};

}

export function riskInsights(risk=calculateRiskEngine()){

const insights=[];

if(risk.concentration>45){

insights.push({

title:"Concentration Risk Detected",

description:"A large share of the portfolio is concentrated in few positions or categories.",

tone:"warning"

});

}

if(risk.geographic>45){

insights.push({

title:"Geographic Risk Elevated",

description:"Portfolio exposure appears regionally concentrated.",

tone:"warning"

});

}

if(risk.sector>45){

insights.push({

title:"Sector Risk Elevated",

description:"Sector exposure may be too concentrated for resilient allocation.",

tone:"warning"

});

}

if(risk.assetClass>45){

insights.push({

title:"Asset Class Risk Elevated",

description:"The portfolio may rely too heavily on one asset class or lacks defensive assets.",

tone:"warning"

});

}

if(risk.allocation>20){

insights.push({

title:"Allocation Risk",

description:"Total allocation is meaningfully away from 100%. Normalize weights for cleaner analytics.",

tone:"danger"

});

}

if(risk.liquidity>35){

insights.push({

title:"Liquidity Risk",

description:"Cash allocation may be too low or illiquid exposure may be too high.",

tone:"warning"

});

}

if(risk.currency>35){

insights.push({

title:"Currency Risk",

description:"Currency exposure appears concentrated.",

tone:"warning"

});

}

if(insights.length===0){

insights.push({

title:"Risk Structure Stable",

description:"No major risk concentration detected by the current risk engine.",

tone:"success"

});

}

return insights;

}

function emptyRiskEngine(){

return{

overall:0,

concentration:0,

geographic:0,

sector:0,

assetClass:0,

allocation:0,

diversification:0,

liquidity:0,

currency:0,

health:0,

grade:{

grade:"-",

label:"No Portfolio",

tone:"warning"

},

insights:[

{

title:"No Assets Added",

description:"Add assets to activate the Finora risk engine.",

tone:"warning"

}

]

};

}

function clamp(value){

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
