/*
=========================================================
BondStats Finora
Portfolio Scenario Library
Version 1.0.0
=========================================================
*/

export const PORTFOLIO_SCENARIOS=[

{
id:"higher-rates",
title:"Higher Interest Rates",
category:"Rates",
description:"Interest rates move higher across the yield curve.",
primaryRisks:[
"Duration pressure",
"Growth valuation compression",
"Debt refinancing costs",
"Real estate sensitivity"
],
potentialBeneficiaries:[
"Cash",
"Short-duration bonds",
"Financials",
"Floating-rate instruments"
],
questions:[
"How much duration risk is embedded in bond exposure?",
"How much allocation depends on growth valuations?",
"Is cash yield becoming more attractive?"
]
},

{
id:"lower-rates",
title:"Lower Interest Rates",
category:"Rates",
description:"Interest rates decline and liquidity conditions ease.",
primaryRisks:[
"Lower future cash yield",
"Potential reach for yield",
"Duration crowding"
],
potentialBeneficiaries:[
"Longer-duration bonds",
"Growth equities",
"REITs",
"Rate-sensitive assets"
],
questions:[
"Does the portfolio benefit from falling discount rates?",
"Is there enough growth exposure?",
"Could lower yields reduce income?"
]
},

{
id:"high-inflation",
title:"High Inflation",
category:"Macro",
description:"Inflation remains persistently above target.",
primaryRisks:[
"Real return erosion",
"Bond pressure",
"Margin compression",
"Policy tightening"
],
potentialBeneficiaries:[
"Commodities",
"Gold",
"Pricing-power equities",
"Real assets"
],
questions:[
"Is there inflation-sensitive exposure?",
"How vulnerable are fixed-income assets?",
"Does the portfolio rely too heavily on nominal cash flows?"
]
},

{
id:"recession",
title:"Recession",
category:"Cycle",
description:"Economic activity weakens meaningfully.",
primaryRisks:[
"Earnings decline",
"Credit spread widening",
"Liquidity pressure",
"Cyclical sector drawdowns"
],
potentialBeneficiaries:[
"Cash",
"Government bonds",
"Defensive sectors",
"High-quality assets"
],
questions:[
"Is cash sufficient?",
"Are cyclical sectors too large?",
"Does the portfolio rely on high-risk assets?"
]
},

{
id:"bull-market",
title:"Bull Market",
category:"Risk Appetite",
description:"Risk assets rise broadly with improving sentiment.",
primaryRisks:[
"Overconcentration",
"Valuation excess",
"Rebalancing neglect"
],
potentialBeneficiaries:[
"Stocks",
"ETFs",
"Crypto",
"Growth sectors"
],
questions:[
"Should gains be rebalanced?",
"Is performance driven by too few positions?",
"Does risk tolerance still match allocation?"
]
},

{
id:"bear-market",
title:"Bear Market",
category:"Risk Appetite",
description:"Risk assets fall and volatility rises.",
primaryRisks:[
"Drawdown risk",
"Forced selling",
"Liquidity stress",
"Concentration losses"
],
potentialBeneficiaries:[
"Cash",
"Government bonds",
"Gold",
"Defensive sectors"
],
questions:[
"Can the portfolio survive a drawdown?",
"Is liquidity sufficient?",
"Are losses concentrated in one sector?"
]
},

{
id:"strong-usd",
title:"Strong USD",
category:"Currencies",
description:"The US dollar strengthens versus major currencies.",
primaryRisks:[
"Foreign asset translation pressure",
"Emerging market sensitivity",
"Commodity pressure"
],
potentialBeneficiaries:[
"USD cash",
"USD bonds",
"Domestic USD purchasing power"
],
questions:[
"How much non-USD exposure exists?",
"Are emerging markets vulnerable?",
"Does currency diversification help or hurt?"
]
},

{
id:"weak-usd",
title:"Weak USD",
category:"Currencies",
description:"The US dollar weakens versus major currencies.",
primaryRisks:[
"USD purchasing power erosion",
"Imported inflation",
"Currency volatility"
],
potentialBeneficiaries:[
"International assets",
"Commodities",
"Gold",
"Foreign currency exposure"
],
questions:[
"Does the portfolio benefit from non-USD exposure?",
"Is foreign currency exposure intentional?",
"How does FX affect portfolio volatility?"
]
}

];

export function getScenario(id){

return PORTFOLIO_SCENARIOS.find(

scenario=>scenario.id===id

)||PORTFOLIO_SCENARIOS[0];

}

export function scenarioOptions(){

return PORTFOLIO_SCENARIOS.map(scenario=>({

value:scenario.id,

label:scenario.title

}));

}

export function scenarioCategories(){

return[

...new Set(

PORTFOLIO_SCENARIOS.map(

scenario=>scenario.category

)

)

];

}

export function scenariosByCategory(){

return PORTFOLIO_SCENARIOS.reduce((groups,scenario)=>{

if(!groups[scenario.category]){

groups[scenario.category]=[];

}

groups[scenario.category].push(scenario);

return groups;

},{});

}
