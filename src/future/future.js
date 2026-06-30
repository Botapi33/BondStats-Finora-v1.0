/*
=========================================================
BondStats Finora
Future Intelligence
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import { Card } from "../components/card.js";
import { Badge } from "../components/badge.js";

const TOPICS=[

{
title:"Artificial Intelligence",
category:"Technology",
impact:"Very High",
description:"AI is reshaping financial research, portfolio management, compliance, investment analysis and productivity."
},

{
title:"Tokenization",
category:"Digital Assets",
impact:"High",
description:"Tokenized securities may transform settlement, ownership and global capital markets."
},

{
title:"CBDCs",
category:"Central Banking",
impact:"High",
description:"Central Bank Digital Currencies could change payments, monetary policy and banking."
},

{
title:"Climate Finance",
category:"ESG",
impact:"High",
description:"Climate regulation and sustainable investing continue influencing capital allocation."
},

{
title:"Future Banking",
category:"Finance",
impact:"High",
description:"Digital banks, embedded finance and AI assistants redefine customer experience."
},

{
title:"Quantum Computing",
category:"Technology",
impact:"Emerging",
description:"Future computing power may transform optimization, cryptography and financial modelling."
},

{
title:"Autonomous Investing",
category:"AI",
impact:"Emerging",
description:"AI-driven portfolio construction and autonomous agents will increasingly support investors."
},

{
title:"Digital Identity",
category:"Infrastructure",
impact:"Medium",
description:"Secure digital identity systems can improve compliance, onboarding and fraud prevention."
}

];

export function initializeFuture(){

const root=document.getElementById("future-view");

if(!root){

return;

}

renderFuture(root);

}

function renderFuture(root){

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.append(

hero(),

futureTopics(),

futureTimeline(),

futureOpportunities(),

futureRisks()

);

root.appendChild(page);

}

function hero(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">

Future Intelligence

</h1>

<p>

Explore technologies, macro trends and structural changes that may influence financial markets over the next decade.

</p>

</div>

<div class="inline">

<span class="badge">AI</span>
<span class="badge">Finance</span>
<span class="badge">Innovation</span>

</div>

</div>

`

}).get();

}

function futureTopics(){

return new Card({

title:"Future Themes",

subtitle:"Long-term structural developments",

content:`

<div class="grid grid-2">

${TOPICS.map(topic=>`

<div class="card">

${new Badge({

text:topic.category

}).get().outerHTML}

<h3 style="margin-top:16px">

${topic.title}

</h3>

<p style="margin-top:12px">

${topic.description}

</p>

<div style="margin-top:18px">

<strong>Expected Impact:</strong>

${topic.impact}

</div>

</div>

`).join("")}

</div>

`

}).get();

}

function futureTimeline(){

const milestones=[

["2025","AI copilots become standard investment tools."],
["2027","Tokenized financial products gain wider adoption."],
["2030","AI-assisted portfolio management becomes mainstream."],
["2035","Digital finance ecosystems become globally connected."]
];

return new Card({

title:"Illustrative Timeline",

subtitle:"Possible long-term evolution",

content:`

<div class="stack">

${milestones.map(([year,text])=>`

<div class="card">

<div class="inline">

<strong>${year}</strong>

</div>

<p style="margin-top:12px">

${text}

</p>

</div>

`).join("")}

</div>

`

}).get();

}

function futureOpportunities(){

return new Card({

title:"Opportunities",

subtitle:"Potential areas of innovation",

content:`

<ul>

<li>AI-powered financial planning</li>
<li>Real-time risk intelligence</li>
<li>Personalized investing</li>
<li>Autonomous compliance</li>
<li>Digital capital markets</li>
<li>Instant settlement</li>
<li>Global tokenized assets</li>

</ul>

`

}).get();

}

function futureRisks(){

return new Card({

title:"Strategic Risks",

subtitle:"Challenges to monitor",

content:`

<ul>

<li>AI governance</li>
<li>Cybersecurity</li>
<li>Regulatory uncertainty</li>
<li>Market concentration</li>
<li>Model risk</li>
<li>Geopolitical fragmentation</li>
<li>Digital infrastructure dependency</li>

</ul>

`

}).get();

}
