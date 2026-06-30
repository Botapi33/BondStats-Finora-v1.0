/*
=========================================================
BondStats Finora
AI Workspace
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { toast } from "../components/toast.js";

export function initializeAI(){

const root=document.getElementById("chat-view");

if(!root)return;

renderAI();

}

function renderAI(){

const root=document.getElementById("chat-view");

root.innerHTML=`

<div class="page fade-up">

<div class="section-header">

<div>
<h1 class="section-title gradient-text">AI Financial Workspace</h1>
<p class="section-description">
Research finance, macro, bonds, stocks, ETFs, portfolio management and future markets.
</p>
</div>

<button id="new-ai-chat" class="button button-primary">New Conversation</button>

</div>

<div class="grid grid-3">

<div class="card">
<h3>Conversations</h3>
<div id="conversation-list" class="stack" style="margin-top:18px"></div>
</div>

<div class="card" style="grid-column:span 2">
<h3>Finora Intelligence</h3>

<div id="chat-messages" class="stack" style="height:520px;overflow:auto;margin-top:18px"></div>

<div class="inline" style="margin-top:18px">
<textarea id="chat-input" class="textarea" placeholder="Ask Finora about markets, bonds, portfolios, risk or macro..." style="min-height:90px"></textarea>
<button id="send-ai-message" class="button button-primary">Send</button>
</div>

</div>

</div>

<div class="card">
<h3>Suggested Prompts</h3>
<div class="inline" style="margin-top:18px">
${prompts().map(prompt=>`
<button class="button button-secondary prompt-btn">${prompt}</button>
`).join("")}
</div>
</div>

</div>

`;

bindAI();

ensureConversation();

renderMessages();

renderConversations();

}

function bindAI(){

document.getElementById("new-ai-chat")?.addEventListener("click",()=>{

createConversation();

});

document.getElementById("send-ai-message")?.addEventListener("click",sendMessage);

document.getElementById("chat-input")?.addEventListener("keydown",event=>{

if(event.key==="Enter"&&!event.shiftKey){

event.preventDefault();

sendMessage();

}

});

document.querySelectorAll(".prompt-btn").forEach(button=>{

button.addEventListener("click",()=>{

document.getElementById("chat-input").value=button.textContent.trim();

sendMessage();

});

});

}

function ensureConversation(){

if(State.getValue("chat.conversations").length===0){

createConversation(false);

}

if(!State.getValue("chat.currentConversation")){

const first=State.getValue("chat.conversations")[0];

State.set("chat.currentConversation",first.id);

}

}

function createConversation(show=true){

const conversation={

id:crypto.randomUUID(),

title:"New Financial Conversation",

createdAt:new Date().toISOString(),

updatedAt:new Date().toISOString(),

pinned:false,

messages:[

{
role:"assistant",
content:"Welcome to BondStats Finora. Ask about bonds, stocks, ETFs, interest rates, inflation, risk, macroeconomics or portfolio construction.",
createdAt:new Date().toISOString()
}

]

};

const conversations=State.getValue("chat.conversations");

conversations.unshift(conversation);

State.set("chat.conversations",conversations);

State.set("chat.currentConversation",conversation.id);

Storage.save();

if(show)toast("New conversation created");

renderMessages();

renderConversations();

}

function currentConversation(){

return State.getValue("chat.conversations").find(

conversation=>conversation.id===State.getValue("chat.currentConversation")

);

}

function sendMessage(){

const input=document.getElementById("chat-input");

if(!input)return;

const text=input.value.trim();

if(!text)return;

const conversation=currentConversation();

if(!conversation)return;

conversation.messages.push({

role:"user",

content:text,

createdAt:new Date().toISOString()

});

conversation.title=text.split(" ").slice(0,8).join(" ");

conversation.updatedAt=new Date().toISOString();

input.value="";

Storage.save();

renderMessages();

generateResponse(text);

}

function generateResponse(prompt){

const conversation=currentConversation();

const response={

role:"assistant",

content:createAnswer(prompt),

createdAt:new Date().toISOString()

};

conversation.messages.push(response);

conversation.updatedAt=new Date().toISOString();

Storage.save();

renderMessages();

renderConversations();

}

function createAnswer(prompt){

const q=prompt.toLowerCase();

let topic="Financial Intelligence";

let body="A strong financial decision connects thesis, risk, time horizon, valuation, liquidity and diversification.";

if(q.includes("bond")||q.includes("yield")||q.includes("duration")){

topic="Fixed Income Intelligence";

body="Bond prices usually move inversely to yields. Duration measures sensitivity to interest-rate changes. Credit quality, maturity, inflation expectations and central bank policy are key drivers.";

}

if(q.includes("stock")||q.includes("equity")){

topic="Equity Intelligence";

body="Stocks represent ownership in companies. Earnings, growth expectations, margins, valuation multiples, interest rates and market sentiment drive equity behavior.";

}

if(q.includes("portfolio")||q.includes("allocation")||q.includes("risk")){

topic="Portfolio Intelligence";

body="Portfolio quality depends on allocation discipline, diversification, concentration risk, liquidity, currency exposure, investment horizon and rebalancing behavior.";

}

if(q.includes("inflation")){

topic="Inflation Intelligence";

body="Inflation reduces purchasing power and can affect rates, bond yields, margins, wages, commodities and real returns.";

}

if(q.includes("ai")||q.includes("artificial intelligence")){

topic="AI Finance Intelligence";

body="AI can improve productivity, research speed, automation, risk analysis and personalization while introducing model, data and governance risks.";

}

return `## ${topic}

${body}

### Key Framework

- Identify the main driver.
- Separate short-term noise from structural forces.
- Check second-order effects.
- Compare upside, downside and liquidity.
- Connect the topic to portfolio role.

### Risk Lens

| Dimension | Question |
|---|---|
| Liquidity | Can it be exited efficiently? |
| Concentration | Is exposure too narrow? |
| Macro | Is it sensitive to rates, inflation or growth? |
| Currency | Does FX matter? |
| Horizon | Does timing match the goal? |

### Finora Insight

Use this as educational analysis only. It is not financial advice.`;

}

function renderMessages(){

const target=document.getElementById("chat-messages");

const conversation=currentConversation();

if(!target||!conversation)return;

target.innerHTML=conversation.messages.map(message=>`

<div class="card">

<div class="inline" style="justify-content:space-between">
<strong>${message.role==="user"?"You":"Finora"}</strong>
<button class="button button-secondary copy-message">Copy</button>
</div>

<div class="ai-message" style="margin-top:14px">
${renderMarkdown(message.content)}
</div>

</div>

`).join("");

target.querySelectorAll(".copy-message").forEach((button,index)=>{

button.addEventListener("click",()=>{

navigator.clipboard?.writeText(conversation.messages[index].content);

toast("Message copied");

});

});

target.scrollTop=target.scrollHeight;

}

function renderConversations(){

const target=document.getElementById("conversation-list");

if(!target)return;

const conversations=State.getValue("chat.conversations");

target.innerHTML=conversations.map(conversation=>`

<button class="button button-secondary conversation-btn" data-id="${conversation.id}">
${conversation.title}
</button>

`).join("");

target.querySelectorAll(".conversation-btn").forEach(button=>{

button.addEventListener("click",()=>{

State.set("chat.currentConversation",button.dataset.id);

Storage.save();

renderMessages();

});

});

}

function renderMarkdown(text){

return String(text)

.replace(/^## (.*)$/gm,"<h3>$1</h3>")

.replace(/^### (.*)$/gm,"<h4>$1</h4>")

.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")

.replace(/\n/g,"<br>");

}

function prompts(){

return[

"Explain bond duration",

"Compare ETFs and mutual funds",

"Analyze portfolio concentration risk",

"Explain inflation like I am 5",

"How do interest rates affect stocks?",

"Create a recession stress checklist",

"Explain the yield curve",

"What is credit risk?"

];

}
