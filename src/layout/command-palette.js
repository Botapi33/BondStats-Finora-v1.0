/*
=========================================================
BondStats Finora
Command Palette
Version 1.0.1
=========================================================
*/

import AppRouter from "../core/router.js";
import Storage from "../core/storage.js";
import { Events, on, emit } from "../core/events.js";

const COMMANDS=[
{
id:"dashboard",
label:"Go to Dashboard",
description:"Open the financial intelligence dashboard",
shortcut:"⌘1",
action:()=>AppRouter.navigate("dashboard")
},
{
id:"chat",
label:"Open AI Workspace",
description:"Start financial research with Finora AI",
shortcut:"⌘2",
action:()=>AppRouter.navigate("chat")
},
{
id:"portfolio",
label:"Open Portfolio Intelligence",
description:"Analyze allocation, risk and diversification",
shortcut:"⌘3",
action:()=>AppRouter.navigate("portfolio")
},
{
id:"research",
label:"Open Research Workspace",
description:"Manage notes, bookmarks and collections",
shortcut:"⌘4",
action:()=>AppRouter.navigate("research")
},
{
id:"learn",
label:"Open BondStats Learn",
description:"Study financial concepts and quizzes",
shortcut:"⌘5",
action:()=>AppRouter.navigate("learn")
},
{
id:"future",
label:"Open Future Lab",
description:"Explore AI, tokenization and future finance",
shortcut:"⌘6",
action:()=>AppRouter.navigate("future")
},
{
id:"brief",
label:"Open Daily Brief",
description:"Review macro, markets and BondStats insights",
shortcut:"⌘7",
action:()=>AppRouter.navigate("brief")
},
{
id:"settings",
label:"Open Settings",
description:"Configure the Finora workspace",
shortcut:"⌘,",
action:()=>AppRouter.navigate("settings")
},
{
id:"backup",
label:"Download Workspace Backup",
description:"Export all local data as JSON",
shortcut:"⌘E",
action:()=>Storage.downloadBackup()
},
{
id:"clear-search",
label:"Clear Search",
description:"Reset global search input",
shortcut:"Esc",
action:()=>{
const input=document.getElementById("global-search");
if(input){
input.value="";
input.dispatchEvent(new Event("input"));
}
}
}
];

class CommandPaletteManager{

constructor(){
this.root=null;
this.open=false;
this.query="";
this.selectedIndex=0;
}

initialize(){

this.root=document.getElementById("command-palette");

if(!this.root){
return;
}

this.render();
this.bind();

on(Events.ROUTE_CHANGE,()=>this.close());

document.addEventListener("finora:command",()=>this.toggle());

}

bind(){

document.addEventListener("keydown",event=>{

if(!this.open){
return;
}

if(event.key==="Escape"){
event.preventDefault();
this.close();
}

if(event.key==="ArrowDown"){
event.preventDefault();
this.selectedIndex=Math.min(this.selectedIndex+1,this.filteredCommands().length-1);
this.render();
}

if(event.key==="ArrowUp"){
event.preventDefault();
this.selectedIndex=Math.max(this.selectedIndex-1,0);
this.render();
}

if(event.key==="Enter"){
event.preventDefault();
this.executeSelected();
}

});

this.root.addEventListener("click",event=>{

if(event.target===this.root){
this.close();
}

});

}

toggle(){
this.open?this.close():this.show();
}

show(){

this.open=true;
this.query="";
this.selectedIndex=0;
this.root.classList.remove("hidden");
this.render();

requestAnimationFrame(()=>{
this.root.querySelector("input")?.focus();
});

}

close(){

if(!this.root)return;

this.open=false;
this.root.classList.add("hidden");

}

filteredCommands(){

if(!this.query){
return COMMANDS;
}

const q=this.query.toLowerCase();

return COMMANDS.filter(command=>
command.label.toLowerCase().includes(q)||
command.description.toLowerCase().includes(q)||
command.id.toLowerCase().includes(q)
);

}

executeSelected(){

const command=this.filteredCommands()[this.selectedIndex];

if(!command){
return;
}

command.action();

emit(Events.TOAST,{
message:command.label
});

this.close();

}

render(){

if(!this.root){
return;
}

const commands=this.filteredCommands();

this.root.innerHTML=`

<div class="command-panel">

<div class="command-search">

<input
type="text"
placeholder="Search commands..."
value="${escapeHTML(this.query)}"
aria-label="Search commands">

</div>

<div class="command-list">

${commands.length?commands.map((command,index)=>`

<button
class="command-item ${index===this.selectedIndex?"active":""}"
data-command="${command.id}">

<div>

<strong>${escapeHTML(command.label)}</strong>

<p>${escapeHTML(command.description)}</p>

</div>

<kbd>${escapeHTML(command.shortcut)}</kbd>

</button>

`).join(""):`

<div class="command-empty">
No commands found.
</div>

`}

</div>

</div>

`;

this.root.querySelector("input")?.addEventListener("input",event=>{

this.query=event.target.value;
this.selectedIndex=0;
this.render();

});

this.root.querySelectorAll(".command-item").forEach((button,index)=>{

button.addEventListener("click",()=>{

this.selectedIndex=index;
this.executeSelected();

});

});

}

}

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,character=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[character]));

}

const CommandPalette=new CommandPaletteManager();

export { CommandPalette };
export default CommandPalette;
