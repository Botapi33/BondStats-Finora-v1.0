/*
=========================================================
BondStats Finora
Portfolio Workspace
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";

import { Card } from "../components/card.js";
import { toast } from "../components/toast.js";

import {
createAsset,
validateAsset,
ASSET_TYPES,
REGIONS,
SECTORS,
CURRENCIES,
RISK_LEVELS
} from "./assets.js";

import { dashboardSummary } from "../dashboard/metrics.js";

let root;

export function initializePortfolio(){

root=document.getElementById("portfolio-view");

if(!root){

return;

}

renderPortfolio();

}

export function renderPortfolio(){

root.innerHTML="";

const page=document.createElement("div");

page.className="page";

page.appendChild(buildHeader());

page.appendChild(buildForm());

page.appendChild(buildPortfolioTable());

page.appendChild(buildSummary());

root.appendChild(page);

}

function buildHeader(){

return new Card({

content:`

<div class="hero">

<div>

<h1 class="gradient-text">

Portfolio Intelligence

</h1>

<p>

Build your portfolio, analyze allocation,
risk, diversification and exposure completely offline.

</p>

</div>

</div>

`

}).get();

}

function buildForm(){

const card=new Card({

title:"Add Asset",

subtitle:"Create a new portfolio position",

content:`

<form id="asset-form" class="grid grid-2">

<input
class="input"
name="name"
placeholder="Asset Name"
required>

<select class="select" name="type">

${ASSET_TYPES.map(type=>

`<option>${type}</option>`

).join("")}

</select>

<input
class="input"
type="number"
step="0.01"
name="allocation"
placeholder="Allocation %"
required>

<select class="select" name="region">

${REGIONS.map(region=>

`<option>${region}</option>`

).join("")}

</select>

<select class="select" name="sector">

${SECTORS.map(sector=>

`<option>${sector}</option>`

).join("")}

</select>

<select class="select" name="currency">

${CURRENCIES.map(currency=>

`<option>${currency}</option>`

).join("")}

</select>

<select class="select" name="risk">

${RISK_LEVELS.map(level=>

`<option value="${level.value}">

${level.label}

</option>`

).join("")}

</select>

<textarea
class="textarea"
name="notes"
placeholder="Notes">

</textarea>

<div>

<button
class="button button-primary"
type="submit">

Add Asset

</button>

</div>

</form>

`

});

setTimeout(bindForm);

return card.get();

}

function bindForm(){

const form=document.getElementById("asset-form");

if(!form){

return;

}

form.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(

new FormData(form)

);

const asset=createAsset(data);

const validation=validateAsset(asset);

if(!validation.valid){

toast(

validation.errors[0],

"danger"

);

return;

}

const assets=State.getValue(

"portfolio.assets"

);

assets.push(asset);

State.set(

"portfolio.assets",

assets

);

Storage.save();

toast(

"Asset added",

"success"

);

renderPortfolio();

});

}

function buildPortfolioTable(){

const assets=State.getValue(

"portfolio.assets"

);

const card=new Card({

title:"Portfolio Assets",

subtitle:`${assets.length} assets tracked`,

content:`

<div class="table-wrapper">

<table class="table">

<thead>

<tr>

<th>Name</th>

<th>Type</th>

<th>Allocation</th>

<th>Region</th>

<th>Sector</th>

<th>Risk</th>

<th></th>

</tr>

</thead>

<tbody>

${assets.length?

assets.map(asset=>`

<tr>

<td>${asset.name}</td>

<td>${asset.type}</td>

<td>${asset.allocation}%</td>

<td>${asset.region}</td>

<td>${asset.sector}</td>

<td>${asset.risk}</td>

<td>

<button

class="button"

data-delete="${asset.id}">

Delete

</button>

</td>

</tr>

`).join("")

:`

<tr>

<td colspan="7">

No assets added yet.

</td>

</tr>

`}

</tbody>

</table>

</div>

`

});

setTimeout(()=>{

document

.querySelectorAll("[data-delete]")

.forEach(button=>{

button.addEventListener("click",()=>{

removeAsset(

button.dataset.delete

);

});

});

});

return card.get();

}

function removeAsset(id){

const assets=State

.getValue("portfolio.assets")

.filter(asset=>asset.id!==id);

State.set(

"portfolio.assets",

assets

);

Storage.save();

toast(

"Asset removed"

);

renderPortfolio();

}

function buildSummary(){

const summary=dashboardSummary();

return new Card({

title:"Portfolio Summary",

subtitle:"Calculated in real time",

content:`

<div class="grid grid-4">

<div>

<div class="metric-label">

Health

</div>

<div class="metric-value">

${summary.portfolioHealth}

</div>

</div>

<div>

<div class="metric-label">

Diversification

</div>

<div class="metric-value">

${summary.diversification}

</div>

</div>

<div>

<div class="metric-label">

Risk

</div>

<div class="metric-value">

${summary.risk}

</div>

</div>

<div>

<div class="metric-label">

Allocation

</div>

<div class="metric-value">

${summary.totalAllocation.toFixed(1)}%

</div>

</div>

</div>

`

}).get();

}
