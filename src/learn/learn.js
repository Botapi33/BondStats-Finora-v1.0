/*
=========================================================
BondStats Finora
Learn Intelligence
Version 1.1.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { Card } from "../components/card.js";
import { Progress } from "../components/progress.js";
import { toast } from "../components/toast.js";
import { createSafeId } from "../utils/compatibility.js";

const ARTICLES=[
{
id:"duration",
title:"Understanding Bond Duration",
level:"Intermediate",
minutes:8,
category:"Fixed Income",
summary:"Duration measures how sensitive a bond is to changes in interest rates.",
content:[
"Bond duration is one of the most important fixed-income concepts.",
"Duration estimates how much a bond price may move when interest rates change. The higher the duration, the more sensitive the bond usually is to rate changes.",
"If yields rise, bond prices usually fall. If yields fall, bond prices usually rise.",
"Longer maturity usually means higher duration. Lower coupons usually increase duration. Higher duration means greater interest-rate sensitivity.",
"Example: A bond with a duration of 7 may lose roughly 7% if yields rise by 1 percentage point, all else equal.",
"Finora Insight: Duration helps investors understand whether a bond position is defensive, income-focused or highly sensitive to rate cycles."
]
},
{
id:"diversification",
title:"How Diversification Works",
level:"Beginner",
minutes:6,
category:"Portfolio",
summary:"Diversification spreads exposure across different assets, regions, sectors and risk drivers.",
content:[
"Diversification means not depending on one single asset, sector, region or risk factor.",
"A diversified portfolio can still lose money, but it may reduce the impact of one weak area.",
"Good diversification includes asset classes, sectors, regions, currencies, liquidity profiles and investment horizons.",
"Owning many assets is not enough. True diversification means owning assets with different economic drivers.",
"Finora Insight: Diversification is strongest when portfolio parts behave differently under different conditions."
]
},
{
id:"yield-curve",
title:"Reading The Yield Curve",
level:"Advanced",
minutes:12,
category:"Macro",
summary:"The yield curve compares interest rates across maturities and can reveal market expectations.",
content:[
"The yield curve shows interest rates for bonds with different maturities.",
"A normal curve usually slopes upward because longer-term bonds often require higher yields.",
"A flat curve means short and long yields are similar. An inverted curve means short yields are above long yields.",
"The curve can reflect expectations about growth, inflation and central bank policy.",
"Finora Insight: The yield curve is not a crystal ball, but it is one of the most important macro signals in bond markets."
]
},
{
id:"inflation",
title:"Inflation And Real Returns",
level:"Beginner",
minutes:7,
category:"Economics",
summary:"Inflation affects purchasing power, rates, margins, wages and real investment returns.",
content:[
"Inflation means prices rise over time.",
"If your investment earns 4% but inflation is 3%, the real return is roughly 1%.",
"Inflation affects purchasing power, interest rates, bond yields, company margins, consumer demand and central bank policy.",
"Some assets may handle inflation better than others, especially businesses with pricing power or real assets.",
"Finora Insight: Always think in real returns, not only nominal returns."
]
},
{
id:"credit-risk",
title:"Credit Risk Explained",
level:"Intermediate",
minutes:9,
category:"Fixed Income",
summary:"Credit risk is the possibility that a borrower fails to meet financial obligations.",
content:[
"Credit risk is the risk that a borrower may not repay debt as promised.",
"In bonds, credit risk affects yield. Higher-risk borrowers usually need to pay higher yields.",
"Credit risk depends on debt levels, cash flow, profitability, the economic cycle, interest rates and refinancing conditions.",
"Credit spreads show the extra yield investors demand for taking credit risk.",
"Finora Insight: Credit risk often looks calm until financial conditions tighten."
]
},
{
id:"portfolio-risk",
title:"Portfolio Risk Frameworks",
level:"Advanced",
minutes:14,
category:"Risk",
summary:"Portfolio risk combines volatility, concentration, liquidity, currency and macro exposure.",
content:[
"Portfolio risk is more than price volatility.",
"A strong risk framework reviews concentration risk, sector risk, geographic risk, currency risk, liquidity risk, duration risk, credit risk and scenario risk.",
"The goal is not to remove all risk. The goal is to understand which risks are intentional and which are accidental.",
"Finora Insight: A portfolio should have a clear reason for every major risk it carries."
]
}
];

const CONCEPTS=[
{title:"Stocks",description:"Ownership claims on companies driven by earnings, margins, growth and valuation."},
{title:"Bonds",description:"Debt securities influenced by rates, credit quality, duration and inflation expectations."},
{title:"ETFs",description:"Tradable funds that provide diversified exposure to markets, sectors or strategies."},
{title:"Central Banks",description:"Institutions that influence money, liquidity, rates and financial conditions."},
{title:"GDP",description:"A measure of economic output and growth across an economy."},
{title:"Options",description:"Derivative contracts with asymmetric payoff, time decay and volatility sensitivity."},
{title:"Currencies",description:"Exchange rates shaped by rates, inflation, growth, trade and capital flows."},
{title:"Commodities",description:"Physical goods influenced by supply, demand, geopolitics and inflation."}
];

let root=null;
let activeArticleId=null;

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

root=document.getElementById("learn-view");

if(!root){
return;
}

root.innerHTML="";

const page=document.createElement("div");
page.className="page fade-up";

page.appendChild(renderHeader());
page.appendChild(renderProgressCards());
page.appendChild(renderArticles(query));

if(activeArticleId){
page.appendChild(renderArticleReader(activeArticleId));
}

page.appendChild(renderConcepts(query));
page.appendChild(renderSummaryGenerator());
page.appendChild(renderQuizGenerator());

root.appendChild(page);

bindEvents();

}

function renderHeader(){

return new Card({
className:"hero-card",
content:`
<div class="hero">
<div>
<h1 class="gradient-text">Learn Intelligence</h1>
<p>Master finance through curated concepts, full articles, summaries, quizzes and structured learning paths.</p>
</div>
<div class="inline">
<span class="badge">Articles</span>
<span class="badge">Reader</span>
<span class="badge">Quizzes</span>
</div>
</div>
`
}).get();

}

function renderProgressCards(){

const completed=getCompleted();
const progress=ARTICLES.length?Math.round((completed.length/ARTICLES.length)*100):0;

const grid=document.createElement("div");
grid.className="grid grid-3";

const progressCard=new Card({
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
}).get();

progressCard.appendChild(new Progress({
label:"Completed Articles",
value:progress
}).get());

grid.appendChild(progressCard);

grid.appendChild(new Card({
className:"metric-card",
content:`
<div class="metric-header">
<div>
<div class="metric-label">Completed</div>
<div class="metric-value">${completed.length}</div>
</div>
<div class="metric-icon">✓</div>
</div>
<p>Finished lessons</p>
`
}).get());

grid.appendChild(new Card({
className:"metric-card",
content:`
<div class="metric-header">
<div>
<div class="metric-label">Available</div>
<div class="metric-value">${ARTICLES.length}</div>
</div>
<div class="metric-icon">◈</div>
</div>
<p>Total lessons</p>
`
}).get());

return grid;

}

function renderArticles(query=""){

const articles=filterArticles(query);

return new Card({
title:"Recommended BondStats Learn Articles",
subtitle:"Click Open Article to read. Mark Complete also opens the article.",
content:`
<div class="grid grid-3">
${articles.length?articles.map(article=>articleCard(article)).join(""):`<div class="card"><p>No articles found.</p></div>`}
</div>
`
}).get();

}

function articleCard(article){

return`
<div class="card">
<div class="inline">
<span class="badge">${escapeHTML(article.category)}</span>
<span class="badge">${escapeHTML(article.level)}</span>
</div>

<h3 style="margin-top:14px">${escapeHTML(article.title)}</h3>

<p style="margin-top:10px">${escapeHTML(article.summary)}</p>

<p style="margin-top:10px">${article.minutes} min read</p>

<div class="inline" style="margin-top:16px">
<button class="button button-primary" type="button" data-open-article="${article.id}">
Open Article
</button>

<button class="button button-secondary" type="button" data-complete-article="${article.id}">
${isCompleted(article.id)?"Completed":"Mark Complete"}
</button>
</div>
</div>
`;

}

function renderArticleReader(articleId){

const article=getArticle(articleId);

if(!article){
activeArticleId=null;
return document.createElement("div");
}

return new Card({
title:article.title,
subtitle:`${article.category} • ${article.level} • ${article.minutes} min read`,
content:`
<article class="article-reader" id="article-reader">
<div class="inline" style="margin-bottom:20px">
<span class="badge">${escapeHTML(article.category)}</span>
<span class="badge">${escapeHTML(article.level)}</span>

<button class="button button-primary" type="button" data-complete-article="${article.id}">
${isCompleted(article.id)?"Completed":"Mark Complete"}
</button>

<button class="button button-secondary" type="button" data-close-article>
Close Article
</button>
</div>

${article.content.map(paragraph=>`
<p style="margin-top:14px">${escapeHTML(paragraph)}</p>
`).join("")}

<div class="card" style="margin-top:24px">
<h3>Key Takeaways</h3>
<ul style="margin-top:12px;list-style:disc;padding-left:22px;color:var(--text-secondary)">
<li>Understand the main driver behind the concept.</li>
<li>Connect it to portfolio construction and risk.</li>
<li>Use it as educational analysis, not financial advice.</li>
</ul>
</div>
</article>
`
}).get();

}

function renderConcepts(query=""){

const concepts=filterConcepts(query);

return new Card({
title:"Related Financial Concepts",
subtitle:"Explore adjacent ideas and build stronger context",
content:`
<div class="grid grid-4">
${concepts.length?concepts.map(concept=>`
<div class="card">
<span class="badge">Concept</span>
<h3 style="margin-top:14px">${escapeHTML(concept.title)}</h3>
<p style="margin-top:10px">${escapeHTML(concept.description)}</p>
<button class="button button-secondary" type="button" style="margin-top:16px" data-summary-topic="${escapeHTML(concept.title)}">
Explain
</button>
</div>
`).join(""):`<div class="card"><p>No concepts found.</p></div>`}
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

<button id="generate-summary" class="button button-primary" type="button">
Generate Summary
</button>
</div>

<div id="summary-output" class="card" style="margin-top:20px">
<p>Select a concept and generate a structured summary.</p>
</div>
`
}).get();

}

function renderQuizGenerator(){

return new Card({
title:"Quiz Generator",
subtitle:"Test your knowledge with local Finora questions",
content:`
<div class="inline">
<button id="generate-quiz" class="button button-primary" type="button">
Generate Quiz
</button>

<button id="reset-quiz-progress" class="button button-secondary" type="button">
Reset Quiz Progress
</button>
</div>

<div id="quiz-output" style="margin-top:20px">
<p>No quiz generated yet.</p>
</div>
`
}).get();

}

function bindEvents(){

document.querySelectorAll("[data-open-article]").forEach(button=>{

button.addEventListener("click",event=>{

event.preventDefault();
openArticle(button.dataset.openArticle);

});

});

document.querySelectorAll("[data-complete-article]").forEach(button=>{

button.addEventListener("click",event=>{

event.preventDefault();

const id=button.dataset.completeArticle;

completeArticle(id);
openArticle(id);

});

});

document.querySelectorAll("[data-close-article]").forEach(button=>{

button.addEventListener("click",event=>{

event.preventDefault();

activeArticleId=null;
renderLearn();

});

});

document.querySelectorAll("[data-summary-topic]").forEach(button=>{

button.addEventListener("click",event=>{

event.preventDefault();
generateSummary(button.dataset.summaryTopic);

});

});

document.getElementById("generate-summary")?.addEventListener("click",event=>{

event.preventDefault();
generateSummary(document.getElementById("learn-summary-topic")?.value||CONCEPTS[0].title);

});

document.getElementById("generate-quiz")?.addEventListener("click",event=>{

event.preventDefault();
generateQuiz();

});

document.getElementById("reset-quiz-progress")?.addEventListener("click",event=>{

event.preventDefault();

State.set("learn.completedQuizzes",[]);
Storage.save();
toast("Quiz progress reset");

});

}

function openArticle(id){

if(!getArticle(id)){
toast("Article not found","danger");
return;
}

activeArticleId=id;
renderLearn();

setTimeout(()=>{

document.getElementById("article-reader")?.scrollIntoView({
behavior:"smooth",
block:"start"
});

},80);

}

function completeArticle(id){

const completed=getCompleted();

if(!completed.includes(id)){

completed.push(id);
State.set("learn.completedArticles",completed);
Storage.save();
toast("Article completed");

}

}

function generateSummary(topicTitle){

const concept=CONCEPTS.find(item=>item.title===topicTitle)||CONCEPTS[0];
const target=document.getElementById("summary-output");

if(!target){
return;
}

target.innerHTML=`
<h3>${escapeHTML(concept.title)}</h3>
<p style="margin-top:10px">${escapeHTML(concept.description)}</p>

<hr style="margin:18px 0">

<h4>Why It Matters</h4>
<p>${escapeHTML(concept.title)} connects financial decisions to risk, time horizon, liquidity, valuation and macro conditions.</p>

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

if(!output){
return;
}

const questions=[...ARTICLES].sort(()=>Math.random()-.5).slice(0,4);
const quizId=createSafeId();

output.innerHTML=`
<div class="stack">
${questions.map((article,index)=>`
<div class="card">
<h3>${index+1}. What best describes ${escapeHTML(article.title)}?</h3>

<div class="stack" style="margin-top:14px">
<button class="button button-secondary quiz-answer" type="button" data-correct="true" data-quiz="${quizId}">
${escapeHTML(article.summary)}
</button>

<button class="button button-secondary quiz-answer" type="button" data-quiz="${quizId}">
A guaranteed way to avoid all financial risk.
</button>

<button class="button button-secondary quiz-answer" type="button" data-quiz="${quizId}">
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

const completed=State.getValue("learn.completedQuizzes")||[];

if(!completed.includes(quizId)){
completed.push(quizId);
State.set("learn.completedQuizzes",completed);
Storage.save();
}

toast("Correct");

}else{

toast("Try again","warning");

}

});

});

}

function getArticle(id){

return ARTICLES.find(article=>article.id===id);

}

function getCompleted(){

const completed=State.getValue("learn.completedArticles");

return Array.isArray(completed)?completed:[];

}

function isCompleted(id){

return getCompleted().includes(id);

}

function filterArticles(query=""){

const q=String(query||"").toLowerCase();

return ARTICLES.filter(article=>
!q||
article.title.toLowerCase().includes(q)||
article.category.toLowerCase().includes(q)||
article.level.toLowerCase().includes(q)||
article.summary.toLowerCase().includes(q)
);

}

function filterConcepts(query=""){

const q=String(query||"").toLowerCase();

return CONCEPTS.filter(concept=>
!q||
concept.title.toLowerCase().includes(q)||
concept.description.toLowerCase().includes(q)
);

}

function escapeHTML(value){

return String(value??"").replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[char]));

}
