/*
=========================================================
BondStats Finora
Learn Intelligence
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { Card } from "../components/card.js";
import { Progress } from "../components/progress.js";
import { Badge } from "../components/badge.js";
import { toast } from "../components/toast.js";
import { createSafeId } from "../utils/compatibility.js";

const ARTICLES=[
{
id:"duration",
title:"Understanding Bond Duration",
level:"Intermediate",
minutes:8,
category:"Fixed Income",
summary:"Duration measures how sensitive a bond is to changes in interest rates."
},
{
id:"diversification",
title:"How Diversification Works",
level:"Beginner",
minutes:6,
category:"Portfolio",
summary:"Diversification spreads exposure across different assets, regions, sectors and risk drivers."
},
{
id:"yield-curve",
title:"Reading The Yield Curve",
level:"Advanced",
minutes:12,
category:"Macro",
summary:"The yield curve compares interest rates across maturities and can reveal market expectations."
},
{
id:"inflation",
title:"Inflation And Real Returns",
level:"Beginner",
minutes:7,
category:"Economics",
summary:"Inflation affects purchasing power, rates, margins, wages and real investment returns."
},
{
id:"credit-risk",
title:"Credit Risk Explained",
level:"Intermediate",
minutes:9,
category:"Fixed Income",
summary:"Credit risk is the possibility that a borrower fails to meet financial obligations."
},
{
id:"portfolio-risk",
title:"Portfolio Risk Frameworks",
level:"Advanced",
minutes:14,
category:"Risk",
summary:"Portfolio risk combines volatility, concentration, liquidity, currency and macro exposure."
}
];

const CONCEPTS=[
{
title:"Stocks",
description:"Ownership claims on companies driven by earnings, margins, growth and valuation."
},
{
title:"Bonds",
description:"Debt securities influenced by rates, credit quality, duration and inflation expectations."
},
{
title:"ETFs",
description:"Tradable funds that provide diversified exposure to markets, sectors or strategies."
},
{
title:"Central Banks",
description:"Institutions that influence money, liquidity, rates and financial conditions."
},
{
title:"GDP",
description:"A measure of economic output and growth across an economy."
},
{
title:"Options",
description:"Derivative contracts with asymmetric payoff, time decay and volatility sensitivity."
},
{
title:"Currencies",
description:"Exchange rates shaped by rates, inflation, growth, trade and capital flows."
},
{
title:"Commodities",
description:"Physical goods influenced by supply, demand, geopolitics and inflation."
}
];

let root=null;

export function initializeLearn(){

root=document.getElementById("learn-view");

if(!root){

return;

}

renderLearn();

document.addEventListener("finora-search",event=>{

if(State.getValue("ui.route")==="learn"){

renderLearn(event.detail||"");

}

});

}

function renderLearn(query=""){

if(!root)return;

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.appendChild(renderHeader());

page.appendChild(renderProgress());

page.appendChild(renderArticles(query));

page.appendChild(renderConcepts(query));

page.appendChild(renderSummaryGenerator());

page.appendChild(renderQuiz());

root.appendChild(page);

bindLearnEvents();

}

function renderHeader(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">Learn Intelligence</h1>

<p>
Master finance through curated concepts, structured summaries, quizzes and related learning paths.
</p>

</div>

<div class="inline">

<span class="badge">Articles</span>

<span class="badge">Quizzes</span>

<span class="badge">Concept Maps</span>

</div>

</div>

`

}).get();

}

function renderProgress(){

const completed=State.getValue("learn.completedArticles")||[];

const progress=ARTICLES.length?Math.round((completed.length/ARTICLES.length)*100):0;

const grid=document.createElement("div");

grid.className="grid grid-3";

grid.appendChild(new Card({

className:"metric-card",

content:`

<div class="metric-header">

<div>

<div class="metric-label">Learning Progress</div>

<div class="metric-value">${progress}%</div>

</div>

<div class="metric-icon">◎</div>

</div>

`

}).get());

grid.lastChild.appendChild(new Progress({

label:"Completed Articles",

value:progress

}).get());

grid.appendChild(metric("Completed",completed.length,"Finished lessons"));

grid.appendChild(metric("Available",ARTICLES.length,"Total lessons"));

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

<div class="metric-icon">✦</div>

</div>

<p>${escapeHTML(label)}</p>

`

}).get();

}

function renderArticles(query=""){

const articles=filteredArticles(query);

return new Card({

title:"Recommended BondStats Learn Articles",

subtitle:"Offline educational paths tailored for financial intelligence",

content:`

<div class="grid grid-3">

${articles.length?articles.map(article=>`

<div class="card">

<div class="inline">

<span class="badge">${escapeHTML(article.category)}</span>

<span class="badge">${escapeHTML(article.level)}</span>

</div>

<h3 style="margin-top:14px">${escapeHTML(article.title)}</h3>

<p style="margin-top:10px">${escapeHTML(article.summary)}</p>

<p style="margin-top:10px">${article.minutes} min read</p>

<button
class="button button-secondary"
style="margin-top:16px"
data-complete-article="${article.id}">
${isCompleted(article.id)?"Completed":"Mark Complete"}
</button>

</div>

`).join(""):`

<div class="card">
<p>No articles found.</p>
</div>

`}

</div>

`

}).get();

}

function renderConcepts(query=""){

const concepts=filteredConcepts(query);

return new Card({

title:"Related Financial Concepts",

subtitle:"Explore adjacent ideas and build stronger context",

content:`

<div class="grid grid-4">

${concepts.length?concepts.map(concept=>`

<div class="card">

${new Badge({text:"Concept"}).get().outerHTML}

<h3 style="margin-top:14px">${escapeHTML(concept.title)}</h3>

<p style="margin-top:10px">${escapeHTML(concept.description)}</p>

<button
class="button button-secondary"
style="margin-top:16px"
data-summary-topic="${escapeHTML(concept.title)}">
Explain
</button>

</div>

`).join(""):`

<div class="card">
<p>No concepts found.</p>
</div>

`}

</div>

`

}).get();

}

function renderSummaryGenerator(){

return new Card({

title:"Concept Summary Generator",

subtitle:"Create a concise educational explanation",

content:`

<div class="inline">

<select id="learn-summary-topic" class="select">

${CONCEPTS.map(concept=>`

<option value="${escapeHTML(concept.title)}">${escapeHTML(concept.title)}</option>

`).join("")}

</select>

<button id="generate-summary" class="button button-primary">
Generate Summary
</button>

</div>

<div id="summary-output" class="card" style="margin-top:20px">

<p>Select a concept and generate a structured summary.</p>

</div>

`

}).get();

}

function renderQuiz(){

return new Card({

title:"Quiz Generator",

subtitle:"Test your knowledge with local Finora questions",

content:`

<div class="inline">

<button id="generate-quiz" class="button button-primary">
Generate Quiz
</button>

<button id="reset-quiz-progress" class="button button-secondary">
Reset Quiz Progress
</button>

</div>

<div id="quiz-output" style="margin-top:20px">

<p>No quiz generated yet.</p>

</div>

`

}).get();

}

function bindLearnEvents(){

document.querySelectorAll("[data-complete-article]").forEach(button=>{

button.addEventListener("click",()=>{

const id=button.dataset.completeArticle;

const completed=State.getValue("learn.completedArticles")||[];

if(!completed.includes(id)){

completed.push(id);

State.set("learn.completedArticles",completed);

Storage.save();

toast("Article completed");

}

renderLearn();

});

});

document.querySelectorAll("[data-summary-topic]").forEach(button=>{

button.addEventListener("click",()=>{

generateSummary(button.dataset.summaryTopic);

});

});

document.getElementById("generate-summary")?.addEventListener("click",()=>{

generateSummary(document.getElementById("learn-summary-topic").value);

});

document.getElementById("generate-quiz")?.addEventListener("click",generateQuiz);

document.getElementById("reset-quiz-progress")?.addEventListener("click",()=>{

State.set("learn.completedQuizzes",[]);

Storage.save();

toast("Quiz progress reset");

renderLearn();

});

}

function generateSummary(topicTitle){

const concept=CONCEPTS.find(item=>item.title===topicTitle)||CONCEPTS[0];

const target=document.getElementById("summary-output");

if(!target)return;

target.innerHTML=`

<h3>${escapeHTML(concept.title)}</h3>

<p style="margin-top:10px">${escapeHTML(concept.description)}</p>

<hr style="margin:18px 0">

<h4>Why It Matters</h4>

<p>
${escapeHTML(concept.title)} matters because it connects financial decisions to risk, time horizon, liquidity, valuation and macro conditions.
</p>

<h4 style="margin-top:18px">Finora Learning Lens</h4>

<ul style="margin-top:10px;list-style:disc;padding-left:22px;color:var(--text-secondary)">
<li>What is the core driver?</li>
<li>How does it affect portfolio construction?</li>
<li>What risk does it introduce?</li>
<li>How does it connect to macro conditions?</li>
</ul>

`;

}

function generateQuiz(){

const output=document.getElementById("quiz-output");

if(!output)return;

const questions=[...ARTICLES].sort(()=>Math.random()-.5).slice(0,4);

const quizId=createSafeId();

output.innerHTML=`

<div class="stack">

${questions.map((article,index)=>`

<div class="card">

<h3>${index+1}. What is the best description of ${escapeHTML(article.title)}?</h3>

<div class="stack" style="margin-top:14px">

<button class="button button-secondary quiz-answer" data-correct="true" data-quiz="${quizId}">
${escapeHTML(article.summary)}
</button>

<button class="button button-secondary quiz-answer" data-quiz="${quizId}">
A guaranteed way to avoid all financial risk.
</button>

<button class="button button-secondary quiz-answer" data-quiz="${quizId}">
A product with fixed returns and no uncertainty.
</button>

</div>

</div>

`).join("")}

</div>

`;

document.querySelectorAll(".quiz-answer").forEach(button=>{

button.addEventListener("click",()=>{

if(button.dataset.correct){

button.classList.remove("button-secondary");

button.classList.add("button-primary");

toast("Correct");

const completed=State.getValue("learn.completedQuizzes")||[];

if(!completed.includes(quizId)){

completed.push(quizId);

State.set("learn.completedQuizzes",completed);

Storage.save();

}

}else{

toast("Try again","warning");

}

});

});

}

function filteredArticles(query=""){

const q=String(query).toLowerCase();

return ARTICLES.filter(article=>{

return !q||

article.title.toLowerCase().includes(q)||

article.category.toLowerCase().includes(q)||

article.level.toLowerCase().includes(q)||

article.summary.toLowerCase().includes(q);

});

}

function filteredConcepts(query=""){

const q=String(query).toLowerCase();

return CONCEPTS.filter(concept=>{

return !q||

concept.title.toLowerCase().includes(q)||

concept.description.toLowerCase().includes(q);

});

}

function isCompleted(id){

return (State.getValue("learn.completedArticles")||[]).includes(id);

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
