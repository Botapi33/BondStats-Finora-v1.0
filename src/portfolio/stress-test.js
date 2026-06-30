/*
=========================================================
BondStats Finora
Portfolio Stress Test Engine
Version 1.0.0
=========================================================
*/

import {
getAssets,
assetAllocation,
sectorExposure,
regionExposure,
currencyExposure,
weightedRisk,
cashRatio,
bondRatio,
equityRatio
} from "./analytics.js";

const SCENARIO_FACTORS={
"higher-rates":{
title:"Higher Interest Rates",
summary:"Higher interest rates may pressure long-duration bonds, highly valued growth assets and leveraged sectors while improving cash yield.",
asset:{
Bonds:-2,
Stocks:-1,
ETFs:-1,
Cash:2,
REITs:-2,
Crypto:-2,
Gold:0,
Commodities:0
},
sector:{
Technology:-2,
RealEstate:-2,
Financials:1,
Utilities:-1
}
},
"lower-rates":{
title:"Lower Interest Rates",
summary:"Lower rates may support bonds, growth equities, REITs and duration-sensitive assets while reducing cash yield.",
asset:{
Bonds:2,
Stocks:1,
ETFs:1,
Cash:-1,
REITs:2,
Crypto:1,
Gold:0,
Commodities:0
},
sector:{
Technology:2,
RealEstate:2,
Financials:-1,
Utilities:1
}
},
"high-inflation":{
title:"High Inflation",
summary:"High inflation may pressure fixed income and cash purchasing power while supporting selected real assets, commodities and pricing-power businesses.",
asset:{
Bonds:-2,
Cash:-1,
Stocks:-1,
Commodities:2,
Gold:2,
REITs:0,
Crypto:-1
},
sector:{
Energy:2,
Materials:1,
Consumer:-1,
Utilities:0
}
},
"recession":{
title:"Recession",
summary:"A recession may pressure cyclical equities, credit-sensitive assets and higher-risk exposures while supporting defensive assets and liquidity.",
asset:{
Stocks:-2,
Crypto:-3,
REITs:-2,
Commodities:-1,
Bonds:1,
Cash:2,
Gold:1
},
sector:{
Technology:-1,
Industrials:-2,
Consumer:-1,
Financials:-2,
Healthcare:1,
Utilities:1,
Government:2
}
},
"bull-market":{
title:"Bull Market",
summary:"A bull market may support equities, risk assets, credit and growth exposure while defensive assets may lag on a relative basis.",
asset:{
Stocks:2,
ETFs:1,
Crypto:3,
REITs:1,
Commodities:1,
Bonds:-1,
Cash:-2
},
sector:{
Technology:2,
Consumer:1,
Financials:1,
Industrials:1
}
},
"bear-market":{
title:"Bear Market",
summary:"A bear market may expose concentration, liquidity and volatility risks while defensive assets can become more important.",
asset:{
Stocks:-2,
ETFs:-1,
Crypto:-3,
REITs:-2,
Commodities:-1,
Bonds:1,
Cash:2,
Gold:1
},
sector:{
Technology:-2,
Consumer:-1,
Financials:-1,
Healthcare:1,
Utilities:1,
Government:2
}
},
"strong-usd":{
title:"Strong USD",
summary:"A strong USD may pressure non-USD assets, commodities and emerging markets while supporting USD purchasing power.",
asset:{
Commodities:-1,
Gold:-1,
Stocks:0,
Bonds:0,
Cash:1
},
region:{
EmergingMarkets:-2,
Europe:-1,
AsiaPacific:-1,
NorthAmerica:1
},
currency:{
USD:1,
EUR:-1,
CHF:-1,
GBP:-1,
JPY:-1,
Other:-1
}
},
"weak-usd":{
title:"Weak USD",
summary:"A weak USD may support foreign assets, commodities and global diversification while reducing USD purchasing power.",
asset:{
Commodities:1,
Gold:1,
Stocks:0,
Bonds:0,
Cash:-1
},
region:{
EmergingMarkets:2,
Europe:1,
AsiaPacific:1,
NorthAmerica:-1
},
currency:{
USD:-1,
EUR:1,
CHF:1,
GBP:1,
JPY:1,
Other:1
}
}
};

export function runStressTest(scenarioId){

const assets=getAssets();

const scenario=SCENARIO_FACTORS[scenarioId]||SCENARIO_FACTORS["higher-rates"];

const impacts=assets.map(asset=>{

const assetImpact=lookupImpact(scenario.asset,asset.type);

const sectorImpact=lookupImpact(scenario.sector,asset.sector);

const regionImpact=lookupImpact(scenario.region,asset.region);

const currencyImpact=lookupImpact(scenario.currency,asset.currency);

const riskAdjustment=(Number(asset.risk)||3)-3;

const sensitivity=assetImpact+sectorImpact+regionImpact+currencyImpact-riskAdjustment*.35;

return{

asset,

sensitivity:round(sensitivity,2),

classification:classifyImpact(sensitivity),

explanation:impactExplanation(asset,sensitivity,scenario.title)

};

});

const portfolioSensitivity=round(

impacts.reduce((sum,item)=>{

return sum+item.sensitivity*((Number(item.asset.allocation)||0)/100);

},0),

2

);

return{

id:scenarioId,

title:scenario.title,

summary:scenario.summary,

portfolioSensitivity,

classification:classifyImpact(portfolioSensitivity),

impacts,

diagnostics:stressDiagnostics(scenarioId,portfolioSensitivity)

};

}

export function availableStressScenarios(){

return Object.entries(SCENARIO_FACTORS).map(([id,scenario])=>({

id,

title:scenario.title,

summary:scenario.summary

}));

}

export function stressDiagnostics(scenarioId,sensitivity){

const diagnostics=[];

const allocation=assetAllocation();

const sectors=sectorExposure();

const regions=regionExposure();

const currencies=currencyExposure();

const cash=cashRatio();

const bonds=bondRatio();

const equity=equityRatio();

const risk=weightedRisk();

if(scenarioId==="higher-rates"&&bonds>45){

diagnostics.push("Bond exposure is high, so duration risk should be reviewed.");

}

if(scenarioId==="higher-rates"&&(sectors["Technology"]||0)>35){

diagnostics.push("Technology exposure may be sensitive to higher discount rates.");

}

if(scenarioId==="recession"&&cash<5){

diagnostics.push("Cash allocation is low for a recession stress scenario.");

}

if(scenarioId==="bear-market"&&equity>70){

diagnostics.push("Equity exposure is high for a bear market stress scenario.");

}

if(scenarioId==="high-inflation"&&(allocation["Commodities"]||0)+(allocation["Gold"]||0)<5){

diagnostics.push("Real asset exposure is low for an inflation stress scenario.");

}

if(scenarioId==="strong-usd"&&(regions["Emerging Markets"]||0)>20){

diagnostics.push("Emerging market exposure can be sensitive to a strong USD.");

}

if(scenarioId==="weak-usd"&&(currencies["USD"]||0)>80){

diagnostics.push("USD currency concentration may reduce benefit from a weak USD scenario.");

}

if(risk>4){

diagnostics.push("Portfolio risk level is already elevated before scenario stress.");

}

if(Math.abs(sensitivity)<.4){

diagnostics.push("Portfolio appears relatively balanced under this scenario.");

}

if(diagnostics.length===0){

diagnostics.push("No major scenario-specific vulnerability detected.");

}

return diagnostics;

}

function lookupImpact(map={},key){

if(!map||!key){

return 0;

}

const normalized=normalizeKey(key);

if(map[key]!==undefined){

return map[key];

}

if(map[normalized]!==undefined){

return map[normalized];

}

return 0;

}

function normalizeKey(value){

return String(value).replace(/\s+/g,"");

}

function classifyImpact(value){

if(value>=1.5){

return"Positive";

}

if(value>=.4){

return"Slightly Positive";

}

if(value<=-1.5){

return"Negative";

}

if(value<=-.4){

return"Slightly Negative";

}

return"Neutral";

}

function impactExplanation(asset,sensitivity,scenario){

const direction=classifyImpact(sensitivity).toLowerCase();

return `${asset.name} is classified as ${direction} under ${scenario} based on asset type, sector, region, currency and stated risk level.`;

}

function round(value,decimals=2){

const factor=10**decimals;

return Math.round(value*factor)/factor;

}
