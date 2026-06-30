/*
=========================================================
BondStats Finora
Dashboard Widgets
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { Card } from "../components/card.js";
import { Progress } from "../components/progress.js";

export function createMarketWidget(){

const card=new Card({

title:"Market Intelligence",

subtitle:"Offline market framework",

content:`

<div class="stack">

${marketRow("Rates","Monitor yield curves, duration pressure and central bank expectations.","●")}

${marketRow("Credit","Watch spreads, liquidity and refinancing risk.","●")}

${marketRow("Equities","Track breadth, valuation and earnings quality.","●")}

${marketRow("Currencies","Review FX exposure and USD sensitivity.","●")}

</div>

`

});

return card.get();

}

export function createPortfolioWidget(){

const assets=State.getValue("portfolio.assets")||[];

const total=assets.reduce((sum,asset)=>sum+(Number(asset.allocation)||0),0);

const card=new Card({

title:"Portfolio Snapshot",

subtitle:"Local portfolio overview",

content:`

<div class="stack">

<div class="inline">

<span class="badge">Assets ${assets.length}</span>

<span class="badge">Allocation ${total.toFixed(1)}%</span>

</div>

<div id="portfolio-widget-progress"></div>

<p>

This widget summarizes local portfolio structure and allocation completeness.

</p>

</div>

`

});

setTimeout(()=>{

const target=card.get().querySelector("#portfolio-widget-progress");

if(target){

const progress=new Progress({

label:"Allocation Completion",

value:Math.min(total,100)

});

target.appendChild(progress.get());

}

});

return card.get();

}

export function createBriefWidget(){

return new Card({

title:"Daily Brief",

subtitle:"Financial operating context",

content:`

<div class="stack">

<p>

Review rates, inflation, equities, credit, currencies,
commodities, central banks and AI finance themes.

</p>

<div class="inline">

<span class="badge">Macro</span>

<span class="badge">Bonds</span>

<span class="badge">AI</span>

<span class="badge">Future Finance</span>

</div>

</div>

`

}).get();

}

export function createActionWidget(){

return new Card({

title:"Quick Actions",

subtitle:"Navigate faster",

content:`

<div class="stack">

<button class="button button-secondary" data-route="chat">

Open AI Workspace

</button>

<button class="button button-secondary" data-route="portfolio">

Analyze Portfolio

</button>

<button class="button button-secondary" data-route="research">

Save Research Note

</button>

<button class="button button-secondary" data-route="brief">

Open Daily Brief

</button>

</div>

`

}).get();

}

function marketRow(title,text,icon){

return`

<div class="card">

<div class="inline">

<span class="badge">${icon}</span>

<strong>${title}</strong>

</div>

<p style="margin-top:10px">

${text}

</p>

</div>

`;

}
