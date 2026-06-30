/*
=========================================================
BondStats Finora
Portfolio Diversification Engine
Version 1.0.0
=========================================================
*/

import {
getAssets,
groupExposure,
herfindahlIndex,
diversificationScore
} from "./analytics.js";

export function diversificationBreakdown(){

const assets=getAssets();

return{

assetClass:dimensionScore("type",assets),

region:dimensionScore("region",assets),

sector:dimensionScore("sector",assets),

currency:dimensionScore("currency",assets),

position:positionDiversificationScore(assets),

overall:diversificationScore(assets)

};

}

export function dimensionScore(key,assets=getAssets()){

if(!assets.length){

return 0;

}

const exposure=groupExposure(key,assets);

const count=Object.keys(exposure).length;

const largest=Math.max(...Object.values(exposure));

let score=0;

score+=Math.min(count*22,70);

score+=Math.max(0,30-largest*.45);

return clamp(score);

}

export function positionDiversificationScore(assets=getAssets()){

if(!assets.length){

return 0;

}

const hhi=herfindahlIndex(assets);

const countBonus=Math.min(assets.length*5,35);

const score=100-(hhi*100)+countBonus;

return clamp(score);

}

export function diversificationGrade(score=diversificationScore()){

if(score>=90){

return{

grade:"A+",

label:"Elite Diversification",

tone:"success"

};

}

if(score>=80){

return{

grade:"A",

label:"Strong Diversification",

tone:"success"

};

}

if(score>=70){

return{

grade:"B",

label:"Good Diversification",

tone:"success"

};

}

if(score>=55){

return{

grade:"C",

label:"Moderate Diversification",

tone:"warning"

};

}

if(score>=40){

return{

grade:"D",

label:"Weak Diversification",

tone:"warning"

};

}

return{

grade:"F",

label:"Concentrated Portfolio",

tone:"danger"

};

}

export function missingDiversificationAreas(){

const assets=getAssets();

const exposure={

types:groupExposure("type",assets),

regions:groupExposure("region",assets),

sectors:groupExposure("sector",assets),

currencies:groupExposure("currency",assets)

};

const missing=[];

if(!exposure.types["Bonds"]){

missing.push({

area:"Asset Class",

item:"Bonds",

reason:"No bond exposure is visible."

});

}

if(!exposure.types["Cash"]){

missing.push({

area:"Liquidity",

item:"Cash",

reason:"No dedicated cash allocation is visible."

});

}

if(!exposure.regions["Emerging Markets"]){

missing.push({

area:"Region",

item:"Emerging Markets",

reason:"No emerging markets exposure is visible."

});

}

if(!exposure.regions["Europe"]){

missing.push({

area:"Region",

item:"Europe",

reason:"No European exposure is visible."

});

}

if(!exposure.sectors["Healthcare"]){

missing.push({

area:"Sector",

item:"Healthcare",

reason:"No healthcare exposure is visible."

});

}

if(!exposure.sectors["Utilities"]){

missing.push({

area:"Sector",

item:"Utilities",

reason:"No defensive utilities exposure is visible."

});

}

if(Object.keys(exposure.currencies).length<2){

missing.push({

area:"Currency",

item:"Multi Currency Exposure",

reason:"Portfolio appears concentrated in one currency."

});

}

return missing;

}

export function diversificationInsights(){

const breakdown=diversificationBreakdown();

const grade=diversificationGrade(breakdown.overall);

const missing=missingDiversificationAreas();

const insights=[

{

title:grade.label,

description:`Diversification grade is ${grade.grade} with an overall score of ${breakdown.overall}.`,

tone:grade.tone

}

];

if(breakdown.assetClass<60){

insights.push({

title:"Asset Class Diversification Weak",

description:"Add more asset categories to reduce dependency on a single return driver.",

tone:"warning"

});

}

if(breakdown.region<60){

insights.push({

title:"Geographic Diversification Weak",

description:"Region exposure is concentrated. Additional geography can reduce macro dependency.",

tone:"warning"

});

}

if(breakdown.sector<60){

insights.push({

title:"Sector Diversification Weak",

description:"Sector exposure is concentrated. Broader sector coverage may reduce cycle risk.",

tone:"warning"

});

}

missing.slice(0,4).forEach(item=>{

insights.push({

title:`Missing ${item.item}`,

description:item.reason,

tone:"warning"

});

});

return insights;

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
