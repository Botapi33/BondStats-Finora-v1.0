/*
=========================================================
BondStats Finora
Daily Brief
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { Card } from "../components/card.js";
import { toast } from "../components/toast.js";

const BRIEF_SECTIONS=[
{
title:"Today’s Markets",
category:"Markets",
items:[
"Global equity sentiment",
"Government bond yields",
"Credit spreads",
"Currency pressure",
"Commodity signals"
]
},
{
title:"Central Banks",
category:"Policy",
items:[
"Policy rate expectations",
"Inflation reaction function",
"Balance sheet policy",
"Forward guidance",
"Financial conditions"
]
},
{
title:"Bond Markets",
category:"Fixed Income",
items:[
"Yield curve shape",
"Duration pressure",
"Credit quality",
"Default risk",
"Liquidity premium"
]
},
{
title:"Economy",
category:"Macro",
items:[
"GDP growth",
"Inflation",
"Employment",
"Consumer demand",
"Corporate margins"
]
},
{
title:"Artificial Intelligence",
category:"Technology",
items:[
"Productivity impact",
"Semiconductor demand",
"Automation",
"Model risk",
"AI regulation"
]
},
{
title:"Future Finance",
category:"Innovation",
items:[
"Tokenization",
"Digital assets",
"CBDCs",
"Fintech infrastructure",
"Programmable money"
]
}
];

export function initializeBrief(){

const root=document.getElementById("brief-view");

if(!root){

return;

}

renderBrief(root);

}

function renderBrief(root){

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.appendChild(renderHeader());

page.appendChild(renderBriefMetrics());

page.appendChild(renderBriefSections());

page.appendChild(renderCalendar());

page.appendChild(renderBondStatsInsight());

page.appendChild(renderNotes());

root.appendChild(page);

bindBriefEvents();

}

function renderHeader(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">Daily Brief</h1>

<p>
A structured offline briefing for markets, bonds, central banks, macroeconomics, AI and future finance.
</p>

</div>

<div class="inline">

<button id="refresh-brief" class="button button-primary">
Refresh Brief
</button>

<button id="save-brief" class="button button-secondary">
Save Notes
</button>

</div>

</div>

`

}).get();

}

function renderBriefMetrics(){

const lastSaved=State.getValue("brief.lastGenerated");

const grid=document.createElement("div");

grid.className="grid grid-4";

grid.appendChild(metric("Sections",BRIEF_SECTIONS.length,"Brief areas"));
grid.appendChild(metric("Signals",countSignals(),"Tracked signals"));
grid.appendChild(metric("Status","Ready","Offline briefing"));
grid.appendChild(metric("Saved",lastSaved?new Date(lastSaved).toLocaleDateString():"Never","Last save"));

return grid;

}

function metric(title,value,label){

return new Card({

className:"metric-card",

content:`

<div class="metric-header">

<div>

<div class="metric-label">${escapeHTML(title)}</div>

<div class="metric-value">${escapeHTML(value)}</div>

</div>

<div class="metric-icon">◌</div>

</div>

<p>${escapeHTML(label)}</p>

`

}).get();

}

function renderBriefSections(){

return new Card({

title:"Market Intelligence Brief",

subtitle:"Offline framework for daily financial analysis",

content:`

<div class="grid grid-2">

${BRIEF_SECTIONS.map(section=>`

<div class="card">

<span class="badge">${escapeHTML(section.category)}</span>

<h3 style="margin-top:14px">
${escapeHTML(section.title)}
</h3>

<div class="stack" style="margin-top:14px">

${section.items.map(item=>`

<div class="inline">

<span class="badge">●</span>

<p>${escapeHTML(item)}</p>

</div>

`).join("")}

</div>

<p style="margin-top:16px">
${sectionNarrative(section.title)}
</p>

</div>

`).join("")}

</div>

`

}).get();

}

function renderCalendar(){

const events=[
{
date:"This Week",
title:"Inflation Data",
description:"Review CPI, PPI and inflation trend direction."
},
{
date:"This Week",
title:"Central Bank Communication",
description:"Monitor policy tone, rate guidance and liquidity signals."
},
{
date:"This Month",
title:"Earnings Updates",
description:"Track corporate margins, revenue growth and forward guidance."
},
{
date:"This Month",
title:"Bond Market Review",
description:"Assess curve movement, credit spreads and refinancing conditions."
}
];

return new Card({

title:"Market Calendar",

subtitle:"Key financial events to monitor",

content:`

<div class="grid grid-2">

${events.map(event=>`

<div class="card">

<span class="badge">${escapeHTML(event.date)}</span>

<h3 style="margin-top:14px">${escapeHTML(event.title)}</h3>

<p style="margin-top:10px">${escapeHTML(event.description)}</p>

</div>

`).join("")}

</div>

`

}).get();

}

function renderBondStatsInsight(){

return new Card({

title:"BondStats Insight",

subtitle:"Daily synthesis framework",

content:`

<div class="stack">

<div class="card">

<h3>Core View</h3>

<p>
A strong daily market read should connect interest rates, inflation, liquidity, earnings, credit and currency dynamics.
No single data point should dominate the entire interpretation.
</p>

</div>

<div class="card">

<h3>Risk Lens</h3>

<p>
Watch whether market moves are driven by growth expectations, policy expectations, liquidity stress or valuation adjustment.
This distinction matters for portfolio positioning and scenario analysis.
</p>

</div>

<div class="card">

<h3>Finora Operating Principle</h3>

<p>
Interpret markets through structure, not noise: drivers, exposures, second-order effects, portfolio role and risk budget.
</p>

</div>

</div>

`

}).get();

}

function renderNotes(){

const notes=State.getValue("brief.notes")||"";

return new Card({

title:"Brief Notes",

subtitle:"Save your own daily market observations locally",

content:`

<textarea
id="brief-notes"
class="textarea"
placeholder="Write daily observations, central bank thoughts, market risks or portfolio implications..."
style="min-height:220px">${escapeHTML(notes)}</textarea>

`

}).get();

}

function bindBriefEvents(){

document.getElementById("refresh-brief")?.addEventListener("click",()=>{

renderBrief(document.getElementById("brief-view"));

toast("Brief refreshed");

});

document.getElementById("save-brief")?.addEventListener("click",()=>{

State.set("brief.notes",document.getElementById("brief-notes")?.value||"");

State.set("brief.lastGenerated",new Date().toISOString());

Storage.save();

toast("Brief saved");

renderBrief(document.getElementById("brief-view"));

});

}

function countSignals(){

return BRIEF_SECTIONS.reduce((sum,section)=>sum+section.items.length,0);

}

function sectionNarrative(title){

const map={

"Today’s Markets":"Use this section to connect cross-asset movement across equities, bonds, credit, currencies and commodities.",

"Central Banks":"Central bank expectations shape rates, financial conditions, currency behavior and risk appetite.",

"Bond Markets":"Bond markets often reveal expectations about inflation, growth, risk and liquidity before other markets.",

"Economy":"Macro data provides the operating environment for earnings, policy and portfolio risk.",

"Artificial Intelligence":"AI can influence productivity, capital expenditure, margins, labor demand and market leadership.",

"Future Finance":"Future finance themes may reshape settlement, banking, investing and digital infrastructure."

};

return map[title]||"Review this area as part of a complete daily financial intelligence workflow.";

}

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,char=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[char]));

}
