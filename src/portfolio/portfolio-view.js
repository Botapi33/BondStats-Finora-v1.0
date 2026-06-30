/*
=========================================================
BondStats Finora
Portfolio View Renderer
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";

import { Card } from "../components/card.js";
import { Table } from "../components/table.js";
import { Badge } from "../components/badge.js";
import { Progress } from "../components/progress.js";
import { toast } from "../components/toast.js";

import {
createAsset,
validateAsset,
riskLabel,
riskClass,
ASSET_TYPES,
REGIONS,
SECTORS,
CURRENCIES,
RISK_LEVELS
} from "./assets.js";

import { calculateAnalytics } from "./analytics.js";
import { diversificationInsights } from "./diversification.js";
import { calculateRiskEngine } from "./risk-engine.js";
import { generateRebalancingPlan } from "./rebalance.js";
import { runStressTest, availableStressScenarios } from "./stress-test.js";

let selectedScenario="higher-rates";

export function renderPortfolioWorkspace(root){

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.appendChild(renderHeader());

page.appendChild(renderDashboard());

page.appendChild(renderBuilder());

page.appendChild(renderAssets());

page.appendChild(renderAnalytics());

page.appendChild(renderIntelligence());

page.appendChild(renderScenarioSimulator());

page.appendChild(renderRebalancing());

root.appendChild(page);

bindScenarioButtons();

}

function renderHeader(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">
Portfolio Intelligence
</h1>

<p>
Analyze allocation, diversification, concentration, scenario sensitivity and rebalancing opportunities with a fully offline risk engine.
</p>

</div>

<div class="inline">

<span class="badge">
Offline Engine
</span>

<span class="badge">
Auto Save
</span>

</div>

</div>

`

}).get();

}

function renderDashboard(){

const analytics=calculateAnalytics();

const risk=calculateRiskEngine();

const grid=document.createElement("div");

grid.className="grid grid-4";

grid.appendChild(metric("Health",analytics.healthScore,"Portfolio structure quality"));

grid.appendChild(metric("Diversification",analytics.diversificationScore,"Spread across risk dimensions"));

grid.appendChild(metric("Risk",risk.overall,"Lower score is better"));

grid.appendChild(metric("Allocation",`${analytics.totalAllocation.toFixed(1)}%`,"Total assigned weight"));

return grid;

}

function metric(title,value,label){

const card=new Card({

className:"metric-card",

content:`

<div class="metric-header">

<div>

<div class="metric-label">${title}</div>

<div class="metric-value">${value}</div>

</div>

<div class="metric-icon">◈</div>

</div>

`

});

if(typeof value==="number"){

card.append(

new Progress({

label,

value:Math.min(value,100)

}).get()

);

}

return card.get();

}

function renderBuilder(){

const card=new Card({

title:"Asset Builder",

subtitle:"Add a position to the local portfolio model",

content:`

<form id="portfolio-builder-form" class="grid grid-2">

<input class="input" name="name" placeholder="Asset Name" required>

<select class="select" name="type">
${ASSET_TYPES.map(value=>`<option value="${value}">${value}</option>`).join("")}
</select>

<input class="input" name="allocation" type="number" step="0.01" min="0.01" placeholder="Allocation %" required>

<select class="select" name="region">
${REGIONS.map(value=>`<option value="${value}">${value}</option>`).join("")}
</select>

<select class="select" name="sector">
${SECTORS.map(value=>`<option value="${value}">${value}</option>`).join("")}
</select>

<select class="select" name="currency">
${CURRENCIES.map(value=>`<option value="${value}">${value}</option>`).join("")}
</select>

<select class="select" name="risk">
${RISK_LEVELS.map(level=>`<option value="${level.value}">${level.label}</option>`).join("")}
</select>

<textarea class="textarea" name="notes" placeholder="Notes"></textarea>

<div class="inline">

<button class="button button-primary" type="submit">
Add Asset
</button>

<button class="button button-secondary" type="reset">
Clear
</button>

</div>

</form>

`

});

setTimeout(()=>{

document.getElementById("portfolio-builder-form")?.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(new FormData(event.target));

const asset=createAsset(data);

const validation=validateAsset(asset);

if(!validation.valid){

toast(validation.errors[0],"danger");

return;

}

const assets=State.getValue("portfolio.assets");

assets.push(asset);

State.set("portfolio.assets",assets);

Storage.save();

toast("Asset added");

renderPortfolioWorkspace(document.getElementById("portfolio-view"));

});

});

return card.get();

}

function renderAssets(){

const assets=State.getValue("portfolio.assets");

const table=new Table({

columns:[

{
key:"name",
label:"Asset"
},

{
key:"type",
label:"Type"
},

{
key:"allocation",
label:"Allocation",
render:value=>`${Number(value).toFixed(2)}%`
},

{
key:"region",
label:"Region"
},

{
key:"sector",
label:"Sector"
},

{
key:"currency",
label:"Currency"
},

{
key:"risk",
label:"Risk",
render:value=>new Badge({
text:riskLabel(value),
variant:riskClass(value)
}).get()
},

{
key:"id",
label:"Actions",
render:value=>`
<button class="button button-secondary" data-delete-asset="${value}">
Delete
</button>
`
}

],

rows:assets,

emptyMessage:"No assets added yet."

});

const card=new Card({

title:"Portfolio Assets",

subtitle:`${assets.length} local positions`,

content:table.get()

});

setTimeout(()=>{

document.querySelectorAll("[data-delete-asset]").forEach(button=>{

button.addEventListener("click",()=>{

const updated=State.getValue("portfolio.assets").filter(asset=>asset.id!==button.dataset.deleteAsset);

State.set("portfolio.assets",updated);

Storage.save();

toast("Asset deleted");

renderPortfolioWorkspace(document.getElementById("portfolio-view"));

});

});

});

return card.get();

}

function renderAnalytics(){

const analytics=calculateAnalytics();

const card=new Card({

title:"Exposure Analytics",

subtitle:"Asset, sector, region, currency and risk distribution",

content:`

<div class="grid grid-2">

${exposureBlock("Asset Allocation",analytics.assetAllocation)}

${exposureBlock("Sector Exposure",analytics.sectorExposure)}

${exposureBlock("Region Exposure",analytics.regionExposure)}

${exposureBlock("Currency Exposure",analytics.currencyExposure)}

${exposureBlock("Risk Distribution",analytics.riskDistribution)}

${exposureBlock("Portfolio Composition",{
"Equity Ratio":analytics.equityRatio,
"Bond Ratio":analytics.bondRatio,
"Cash Ratio":analytics.cashRatio
})}

</div>

`

});

return card.get();

}

function exposureBlock(title,data){

const entries=Object.entries(data);

if(!entries.length){

return`

<div class="card">
<h3>${title}</h3>
<p>No data available.</p>
</div>

`;

}

return`

<div class="card">

<h3>${title}</h3>

<div class="stack" style="margin-top:16px">

${entries.map(([label,value])=>`

<div>

<div class="inline" style="justify-content:space-between">

<span>${label}</span>

<strong>${Number(value).toFixed(1)}%</strong>

</div>

<div class="progress" style="margin-top:8px">

<div class="progress-fill" style="width:${Math.min(Number(value),100)}%"></div>

</div>

</div>

`).join("")}

</div>

</div>

`;

}

function renderIntelligence(){

const risk=calculateRiskEngine();

const diversification=diversificationInsights();

const cards=[

...risk.insights,

...diversification

];

return new Card({

title:"Portfolio Intelligence",

subtitle:"Smart diagnostics from the Finora risk engine",

content:`

<div class="grid grid-2">

${cards.map(item=>`

<div class="card">

<span class="badge badge-${item.tone}">
${item.tone}
</span>

<h3 style="margin-top:14px">
${item.title}
</h3>

<p style="margin-top:10px">
${item.description}
</p>

</div>

`).join("")}

</div>

`

}).get();

}

function renderScenarioSimulator(){

const result=runStressTest(selectedScenario);

return new Card({

title:"Scenario Simulator",

subtitle:"Qualitative stress testing without forecasting",

content:`

<div class="inline">

${availableStressScenarios().map(scenario=>`

<button
class="button ${scenario.id===selectedScenario?"button-primary":"button-secondary"}"
data-scenario="${scenario.id}">
${scenario.title}
</button>

`).join("")}

</div>

<div class="card" style="margin-top:20px">

<span class="badge">
${result.classification}
</span>

<h3 style="margin-top:14px">
${result.title}
</h3>

<p style="margin-top:10px">
${result.summary}
</p>

<div class="metric-value" style="margin-top:18px">
${result.portfolioSensitivity}
</div>

</div>

<div class="grid grid-2" style="margin-top:20px">

${result.diagnostics.map(item=>`

<div class="card">
<p>${item}</p>
</div>

`).join("")}

</div>

`

}).get();

}

function bindScenarioButtons(){

document.querySelectorAll("[data-scenario]").forEach(button=>{

button.addEventListener("click",()=>{

selectedScenario=button.dataset.scenario;

renderPortfolioWorkspace(document.getElementById("portfolio-view"));

});

});

}

function renderRebalancing(){

const plan=generateRebalancingPlan();

return new Card({

title:"Rebalancing Suggestions",

subtitle:"Actionable portfolio structure improvements",

content:`

<div class="stack">

${plan.map(item=>`

<div class="card">

<div class="inline">

<span class="badge badge-${item.priority}">
${item.priority}
</span>

<strong>
${item.title}
</strong>

</div>

<p style="margin-top:10px">
${item.action}
</p>

<p style="margin-top:6px">
${item.reason}
</p>

</div>

`).join("")}

</div>

`

}).get();

}
