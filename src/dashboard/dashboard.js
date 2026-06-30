/*
=========================================================
BondStats Finora
Dashboard
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { Card } from "../components/card.js";
import { Progress } from "../components/progress.js";
import { toast } from "../components/toast.js";

let root;

export function initializeDashboard(){

root=document.getElementById("dashboard-view");

if(!root){

return;

}

renderDashboard();

}

export function renderDashboard(){

const state=State.get();

const portfolio=state.portfolio;

root.innerHTML="";

const page=document.createElement("div");

page.className="page";

page.appendChild(createHero());

const metrics=document.createElement("div");

metrics.className="grid grid-4";

metrics.appendChild(metricCard(
"Portfolio Health",
portfolio.healthScore||92,
"Overall portfolio quality"
));

metrics.appendChild(metricCard(
"Diversification",
portfolio.diversificationScore||84,
"Asset diversification"
));

metrics.appendChild(metricCard(
"Risk Score",
portfolio.riskScore||37,
"Lower is better"
));

metrics.appendChild(metricCard(
"Assets",
portfolio.assets.length,
"Tracked positions"
));

page.appendChild(metrics);

const analytics=document.createElement("div");

analytics.className="grid grid-2";

analytics.appendChild(allocationCard());

analytics.appendChild(insightsCard());

page.appendChild(analytics);

root.appendChild(page);

}

function createHero(){

const hero=new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">

Financial Intelligence

</h1>

<p>

Professional portfolio intelligence, AI research,
risk analytics and financial insights —
all running completely offline.

</p>

</div>

<div class="hero-actions">

<button
id="dashboard-refresh"
class="button button-primary">

Refresh Dashboard

</button>

</div>

</div>

`

});

setTimeout(()=>{

document

.getElementById("dashboard-refresh")

?.addEventListener("click",()=>{

renderDashboard();

toast(

"Dashboard updated"

);

});

});

return hero.get();

}

function metricCard(title,value,label){

const progress=new Progress({

value:Math.min(Number(value)||0,100),

label,

animated:true

});

const card=new Card({

className:"metric-card",

content:`

<div class="metric-header">

<div>

<div class="metric-label">

${title}

</div>

<div class="metric-value">

${value}

</div>

</div>

</div>

`

});

card.append(progress.get());

return card.get();

}

function allocationCard(){

const card=new Card({

title:"Portfolio Allocation",

subtitle:"Current asset allocation",

content:`

<div class="stack">

<div>

Stocks

<div class="progress">

<div
class="progress-fill"
style="width:48%"></div>

</div>

</div>

<div>

Bonds

<div class="progress">

<div
class="progress-fill"
style="width:27%"></div>

</div>

</div>

<div>

ETFs

<div class="progress">

<div
class="progress-fill"
style="width:18%"></div>

</div>

</div>

<div>

Cash

<div class="progress">

<div
class="progress-fill"
style="width:7%"></div>

</div>

</div>

</div>

`

});

return card.get();

}

function insightsCard(){

const card=new Card({

title:"Portfolio Intelligence",

subtitle:"AI Generated Insights",

content:`

<div class="stack">

<div class="badge">

Well Diversified

</div>

<div class="badge">

Technology Exposure Moderate

</div>

<div class="badge">

Healthy Bond Allocation

</div>

<div class="badge">

Currency Diversification Good

</div>

<div class="badge">

Cash Reserve Slightly Low

</div>

</div>

`

});

return card.get();

}
