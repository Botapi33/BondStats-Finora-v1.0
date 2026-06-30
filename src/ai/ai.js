/*
=========================================================
BondStats Finora
AI Workspace
Version 1.1.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { toast } from "../components/toast.js";
import { createSafeId, copyText } from "../utils/compatibility.js";

let root=null;
let isGenerating=false;
let stopRequested=false;

const SUGGESTED_PROMPTS=[
"Explain bond duration",
"Compare ETFs and mutual funds",
"Analyze portfolio concentration risk",
"Explain inflation like I am 5",
"How do interest rates affect stocks?",
"Create a recession stress checklist",
"Explain the yield curve",
"What is credit risk?"
];

export function initializeAI(){

root=document.getElementById("chat-view");

if(!root){
return;
}

ensureChatState();

renderAI();

document.addEventListener("finora-search",event=>{

if(State.getValue("ui.route")==="chat"){
renderConversationList(event.detail||"");
}

});

}

function ensureChatState(){

if(!State.getValue("chat")){
State.set("chat",{conversations:[],currentConversation:null,streaming:false,history:[]});
}

if(!Array.isArray(State.getValue("chat.conversations"))){
State.set("chat.conversations",[]);
}

if(State.getValue("chat.conversations").length===0){
createConversation(false);
}

if(!State.getValue("chat.currentConversation")){
State.set("chat.currentConversation",State.getValue("chat.conversations")[0].id);
}

Storage.save();

}

function renderAI(){

root=document.getElementById("chat-view");

if(!root)return;

ensureChatState();

root.innerHTML=`

<div class="page fade-up">

<div class="section-header">

<div>
<h1 class="section-title gradient-text">AI Financial Workspace</h1>
<p class="section-description">
Research finance, macro, bonds, stocks, ETFs, portfolio management, risk and future markets.
</p>
</div>

<div class="inline">
<button id="new-ai-chat" class="button button-secondary" type="button">New Conversation</button>
<button id="export-ai-chat" class="button button-secondary" type="button">Export Chat</button>
</div>

</div>

<div class="grid grid-3">

<div class="card">
<h3>Conversations</h3>
<div id="conversation-list" class="stack" style="margin-top:18px"></div>
</div>

<div class="card" style="grid-column:span 2">

<div class="inline" style="justify-content:space-between">
<h3>Finora Intelligence</h3>
<div class="inline">
<button id="stop-ai-generation" class="button button-secondary" type="button">Stop</button>
<button id="regenerate-ai-response" class="button button-secondary" type="button">Regenerate</button>
</div>
</div>

<div id="chat-messages" class="stack" style="height:520px;overflow:auto;margin-top:18px"></div>

<div class="chat-input-area" style="display:flex;gap:12px;margin-top:18px;align-items:flex-end">

<textarea
id="chat-input"
class="textarea"
placeholder="Ask Finora about markets, bonds, portfolios, risk or macro..."
style="min-height:96px;flex:1"></textarea>

<button id="send-ai-message" class="button button-primary" type="button">
Send
</button>

</div>

</div>

</div>

<div class="card">
<h3>Suggested Prompts</h3>
<div class="inline" style="margin-top:18px">
${SUGGESTED_PROMPTS.map(prompt=>`
<button class="button button-secondary prompt-btn" type="button" data-prompt="${escapeHTML(prompt)}">${escapeHTML(prompt)}</button>
`).join("")}
</div>
</div>

</div>

`;

bindAIEvents();

renderConversationList();

renderMessages();

}

function bindAIEvents(){

document.getElementById("new-ai-chat")?.addEventListener("click",()=>{

createConversation(true);
renderAI();

});

document.getElementById("send-ai-message")?.addEventListener("click",()=>{

sendMessage();

});

document.getElementById("chat-input")?.addEventListener("keydown",event=>{

if(event.key==="Enter"&&!event.shiftKey){

event.preventDefault();
sendMessage();

}

});

document.getElementById("stop-ai-generation")?.addEventListener("click",()=>{

stopRequested=true;
toast("Generation stopped","warning");

});

document.getElementById("regenerate-ai-response")?.addEventListener("click",()=>{

regenerateLastResponse();

});

document.getElementById("export-ai-chat")?.addEventListener("click",()=>{

exportCurrentConversation();

});

document.querySelectorAll(".prompt-btn").forEach(button=>{

button.addEventListener("click",()=>{

const input=document.getElementById("chat-input");

if(!input)return;

input.value=button.dataset.prompt;
input.focus();
sendMessage();

});

});

}

function createConversation(showToast=true){

const conversation={
id:createSafeId(),
title:"New Financial Conversation",
createdAt:new Date().toISOString(),
updatedAt:new Date().toISOString(),
pinned:false,
messages:[
{
role:"assistant",
content:"Welcome to BondStats Finora. Ask me about bonds, stocks, ETFs, interest rates, inflation, risk, macroeconomics or portfolio construction.",
createdAt:new Date().toISOString()
}
]
};

const conversations=State.getValue("chat.conversations")||[];

conversations.unshift(conversation);

State.set("chat.conversations",conversations);
State.set("chat.currentConversation",conversation.id);

Storage.save();

if(showToast){
toast("New conversation created");
}

return conversation;

}

function getCurrentConversation(){

const conversations=State.getValue("chat.conversations")||[];
const currentId=State.getValue("chat.currentConversation");

return conversations.find(conversation=>conversation.id===currentId)||conversations[0];

}

function saveConversation(conversation){

const conversations=State.getValue("chat.conversations")||[];

const updated=conversations.map(item=>item.id===conversation.id?conversation:item);

State.set("chat.conversations",updated);
Storage.save();

}

async function sendMessage(){

if(isGenerating){
toast("Finora is already generating","warning");
return;
}

const input=document.getElementById("chat-input");

if(!input){
return;
}

const text=input.value.trim();

if(!text){
toast("Enter a question first","warning");
return;
}

let conversation=getCurrentConversation();

if(!conversation){
conversation=createConversation(false);
}

conversation.messages.push({
role:"user",
content:text,
createdAt:new Date().toISOString()
});

conversation.title=deriveTitle(text);
conversation.updatedAt=new Date().toISOString();

input.value="";

saveConversation(conversation);
renderConversationList();
renderMessages();

await generateResponse(text);

}

async function generateResponse(prompt){

let conversation=getCurrentConversation();

if(!conversation)return;

isGenerating=true;
stopRequested=false;

const assistantMessage={
role:"assistant",
content:"",
createdAt:new Date().toISOString(),
citations:createCitations(prompt)
};

conversation.messages.push(assistantMessage);
saveConversation(conversation);
renderMessages();

const answer=createFinancialAnswer(prompt);

for(const char of answer){

if(stopRequested){
break;
}

assistantMessage.content+=char;

conversation.updatedAt=new Date().toISOString();

saveConversation(conversation);
renderMessages(false);

await sleep(5);

}

isGenerating=false;
stopRequested=false;

saveConversation(conversation);
renderConversationList();
renderMessages();

}

function regenerateLastResponse(){

if(isGenerating)return;

const conversation=getCurrentConversation();

if(!conversation)return;

const lastUser=[...conversation.messages].reverse().find(message=>message.role==="user");

if(!lastUser){
toast("No user message to regenerate","warning");
return;
}

for(let i=conversation.messages.length-1;i>=0;i--){

if(conversation.messages[i].role==="assistant"){
conversation.messages.splice(i,1);
break;
}

}

saveConversation(conversation);
renderMessages();

generateResponse(lastUser.content);

}

function renderConversationList(query=""){

const target=document.getElementById("conversation-list");

if(!target)return;

const currentId=State.getValue("chat.currentConversation");

let conversations=State.getValue("chat.conversations")||[];

if(query){

const q=String(query).toLowerCase();

conversations=conversations.filter(conversation=>
conversation.title.toLowerCase().includes(q)||
conversation.messages.some(message=>message.content.toLowerCase().includes(q))
);

}

if(!conversations.length){

target.innerHTML=`<p>No conversations found.</p>`;
return;

}

target.innerHTML=conversations.map(conversation=>`

<button
class="button button-secondary conversation-btn ${conversation.id===currentId?"active":""}"
type="button"
data-conversation="${conversation.id}">
${escapeHTML(conversation.title)}
</button>

`).join("");

target.querySelectorAll("[data-conversation]").forEach(button=>{

button.addEventListener("click",()=>{

State.set("chat.currentConversation",button.dataset.conversation);
Storage.save();
renderConversationList();
renderMessages();

});

});

}

function renderMessages(autoScroll=true){

const target=document.getElementById("chat-messages");

if(!target)return;

const conversation=getCurrentConversation();

if(!conversation){

target.innerHTML=`<p>No conversation selected.</p>`;
return;

}

target.innerHTML=conversation.messages.map((message,index)=>`

<div class="card ai-bubble ${message.role}">

<div class="inline" style="justify-content:space-between">

<strong>${message.role==="user"?"You":"Finora"}</strong>

<div class="inline">
<small>${new Date(message.createdAt).toLocaleTimeString()}</small>
<button class="button button-secondary copy-ai-message" type="button" data-message-index="${index}">
Copy
</button>
</div>

</div>

<div class="ai-message" style="margin-top:14px">
${renderMarkdown(message.content)}
</div>

${message.citations?.length?`

<div class="grid grid-2" style="margin-top:16px">

${message.citations.map(citation=>`

<div class="card">
<strong>${escapeHTML(citation.title)}</strong>
<p style="margin-top:8px">${escapeHTML(citation.description)}</p>
</div>

`).join("")}

</div>

`:""}

</div>

`).join("");

target.querySelectorAll("[data-message-index]").forEach(button=>{

button.addEventListener("click",()=>{

const index=Number(button.dataset.messageIndex);
const message=conversation.messages[index];

if(!message)return;

copyText(message.content)
.then(()=>toast("Message copied"))
.catch(()=>toast("Copy failed","warning"));

});

});

if(autoScroll){
target.scrollTop=target.scrollHeight;
}

}

function createFinancialAnswer(prompt){

const q=prompt.toLowerCase();
const mode=State.getValue("user.mode")||"professional";

let topic="Financial Intelligence";
let explanation="A strong financial decision connects thesis, probability, downside risk, liquidity, valuation, time horizon and portfolio role.";

if(includesAny(q,["bond","bonds","yield","duration","coupon","fixed income"])){
topic="Fixed Income Intelligence";
explanation="Bond prices usually move inversely to yields. Duration measures sensitivity to interest-rate changes. Credit quality, maturity, inflation expectations and central bank policy are key drivers.";
}

if(includesAny(q,["stock","stocks","equity","shares","earnings"])){
topic="Equity Intelligence";
explanation="Stocks represent ownership in companies. Earnings, growth expectations, margins, valuation multiples, interest rates and market sentiment drive equity behavior.";
}

if(includesAny(q,["etf","fund","mutual fund","index"])){
topic="ETF & Fund Intelligence";
explanation="ETFs and funds package multiple securities into one vehicle. They can improve diversification, simplify exposure and reduce single-security risk.";
}

if(includesAny(q,["portfolio","allocation","diversification","risk","rebalance"])){
topic="Portfolio Intelligence";
explanation="Portfolio quality depends on allocation discipline, diversification, concentration risk, liquidity, currency exposure, investment horizon and rebalancing behavior.";
}

if(includesAny(q,["inflation","cpi","prices"])){
topic="Inflation Intelligence";
explanation="Inflation reduces purchasing power and can affect interest rates, bond yields, company margins, wages, commodities and real returns.";
}

if(includesAny(q,["central bank","fed","ecb","rates","monetary policy"])){
topic="Central Bank Intelligence";
explanation="Central banks influence financial conditions through policy rates, liquidity, balance sheet tools and communication.";
}

if(includesAny(q,["ai","artificial intelligence","technology"])){
topic="AI Finance Intelligence";
explanation="AI can improve productivity, research speed, automation, risk analysis and personalization while introducing model, data and governance risks.";
}

let styleLine="Here is a professional financial breakdown.";

if(mode==="student"){
styleLine="I will explain this step by step in simple language.";
}

if(mode==="investor"){
styleLine="I will focus on portfolio implications, risk and decision quality.";
}

if(mode==="research"){
styleLine="I will structure this as a research note with drivers, risks and open questions.";
}

if(mode==="eli5"){
styleLine="Imagine finance as a machine that moves money, risk and time between people.";
}

return `## ${topic}

${styleLine}

${explanation}

### Key Points

- Identify the main driver: rates, growth, inflation, liquidity, earnings, credit quality or sentiment.
- Separate short-term market noise from structural financial logic.
- Consider second-order effects because financial systems are connected.
- Avoid treating one metric as a complete decision framework.
- Connect every analysis to portfolio role and risk budget.

### Practical Interpretation

The useful question is not only "what happens next?" but also:

- What exposure do I actually own?
- What risk am I being paid to take?
- What could go wrong?
- What would make the thesis invalid?
- How does this fit the total portfolio?

### Risk Lens

| Risk Area | What To Watch |
|---|---|
| Liquidity | Can the asset be sold or rebalanced efficiently? |
| Duration | How sensitive is it to interest rates or time horizon? |
| Concentration | Is too much exposure tied to one sector, region or factor? |
| Currency | Does FX movement change the outcome? |
| Macro | Is the asset exposed to inflation, growth or central bank shifts? |

### Finora Insight

A strong financial decision should connect thesis, probability, downside risk, liquidity, time horizon and portfolio role.

This is educational analysis only and does not constitute financial advice.`;

}

function createCitations(prompt){

const q=prompt.toLowerCase();

const citations=[];

if(includesAny(q,["bond","yield","duration","fixed income"])){
citations.push({
title:"Fixed Income Framework",
description:"Duration, yield, credit quality and maturity are core bond risk dimensions."
});
}

if(includesAny(q,["portfolio","allocation","risk"])){
citations.push({
title:"Portfolio Construction Framework",
description:"Allocation, diversification, concentration and liquidity define portfolio structure."
});
}

if(includesAny(q,["inflation","rates","central bank"])){
citations.push({
title:"Macro Framework",
description:"Inflation, policy rates and liquidity shape financial conditions."
});
}

if(!citations.length){
citations.push({
title:"Finora Knowledge Base",
description:"Offline educational finance framework generated locally."
});
}

return citations;

}

function renderMarkdown(markdown){

let html=escapeHTML(markdown);

html=html.replace(/^### (.*)$/gm,"<h4>$1</h4>");
html=html.replace(/^## (.*)$/gm,"<h3>$1</h3>");
html=html.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
html=html.replace(/`([^`]+)`/g,"<code>$1</code>");
html=html.replace(/^- (.*)$/gm,"<li>$1</li>");
html=html.replace(/(<li>.*<\/li>)/gs,"<ul>$1</ul>");
html=html.replace(/\n/g,"<br>");

html=renderSimpleTables(html);

return html;

}

function renderSimpleTables(html){

if(!html.includes("|")){
return html;
}

const lines=html.split("<br>");
const output=[];
let tableLines=[];

for(const line of lines){

if(line.includes("|")){
tableLines.push(line);
}else{

if(tableLines.length){
output.push(convertTable(tableLines));
tableLines=[];
}

output.push(line);

}

}

if(tableLines.length){
output.push(convertTable(tableLines));
}

return output.join("<br>");

}

function convertTable(lines){

if(lines.length<3){
return lines.join("<br>");
}

const rows=lines.filter(line=>!line.includes("---")).map(line=>
line.split("|").map(cell=>cell.trim()).filter(Boolean)
);

if(rows.length<2){
return lines.join("<br>");
}

const header=rows[0];
const body=rows.slice(1);

return`
<div class="table-wrapper" style="margin-top:12px">
<table class="table">
<thead>
<tr>${header.map(cell=>`<th>${cell}</th>`).join("")}</tr>
</thead>
<tbody>
${body.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join("")}</tr>`).join("")}
</tbody>
</table>
</div>
`;

}

function exportCurrentConversation(){

const conversation=getCurrentConversation();

if(!conversation){
toast("No conversation to export","warning");
return;
}

const content=conversation.messages.map(message=>
`${message.role.toUpperCase()}\n${message.content}`
).join("\n\n---\n\n");

const blob=new Blob([content],{type:"text/plain;charset=utf-8"});
const url=URL.createObjectURL(blob);
const link=document.createElement("a");

link.href=url;
link.download=`finora-chat-${conversation.id}.txt`;

document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);

toast("Conversation exported");

}

function deriveTitle(text){

return text.split(/\s+/).slice(0,7).join(" ")||"Financial Conversation";

}

function includesAny(text,terms){

return terms.some(term=>text.includes(term));

}

function sleep(ms){

return new Promise(resolve=>setTimeout(resolve,ms));

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
