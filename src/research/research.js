/*
=========================================================
BondStats Finora
Research Workspace
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { Card } from "../components/card.js";
import { Table } from "../components/table.js";
import { Badge } from "../components/badge.js";
import { toast } from "../components/toast.js";
import { createSafeId } from "../utils/compatibility.js";

let root=null;

export function initializeResearch(){

root=document.getElementById("research-view");

if(!root){

return;

}

renderResearch();

document.addEventListener("finora-search",event=>{

if(State.getValue("ui.route")==="research"){

renderResearch(event.detail||"");

}

});

}

function renderResearch(query=""){

if(!root)return;

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.appendChild(renderHeader());

page.appendChild(renderEditor());

page.appendChild(renderOverview(query));

page.appendChild(renderNotes(query));

page.appendChild(renderBookmarks(query));

page.appendChild(renderCollections());

root.appendChild(page);

bindResearchEvents();

}

function renderHeader(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">Research Workspace</h1>

<p>
Capture market ideas, save references, organize research collections and keep everything available offline.
</p>

</div>

<div class="inline">

<span class="badge">Notes</span>

<span class="badge">Bookmarks</span>

<span class="badge">Collections</span>

</div>

</div>

`

}).get();

}

function renderEditor(){

return new Card({

title:"Create Research Note",

subtitle:"Save market observations, thesis notes and financial references",

content:`

<form id="research-note-form" class="grid grid-2">

<input class="input" name="title" placeholder="Research Title" required>

<input class="input" name="tags" placeholder="Tags separated by commas">

<textarea class="textarea" name="body" placeholder="Write your research note..." required style="grid-column:1/-1"></textarea>

<div class="inline" style="grid-column:1/-1">

<button class="button button-primary" type="submit">
Save Note
</button>

<button class="button button-secondary" type="reset">
Clear
</button>

</div>

</form>

<hr style="margin:24px 0">

<form id="research-bookmark-form" class="grid grid-2">

<input class="input" name="title" placeholder="Bookmark Title" required>

<input class="input" name="reference" placeholder="Source, URL or reference" required>

<input class="input" name="tags" placeholder="Tags separated by commas">

<div class="inline">

<button class="button button-secondary" type="submit">
Save Bookmark
</button>

</div>

</form>

`

}).get();

}

function renderOverview(query=""){

const notes=filteredNotes(query);

const bookmarks=filteredBookmarks(query);

const collections=State.getValue("research.collections")||[];

const grid=document.createElement("div");

grid.className="grid grid-4";

grid.appendChild(metricCard("Notes",notes.length,"Research notes"));
grid.appendChild(metricCard("Bookmarks",bookmarks.length,"Saved references"));
grid.appendChild(metricCard("Collections",collections.length,"Research folders"));
grid.appendChild(metricCard("Pinned",pinnedItems().length,"Priority items"));

return grid;

}

function metricCard(title,value,label){

return new Card({

className:"metric-card",

content:`

<div class="metric-header">

<div>

<div class="metric-label">${escapeHTML(title)}</div>

<div class="metric-value">${escapeHTML(value)}</div>

</div>

<div class="metric-icon">◫</div>

</div>

<p>${escapeHTML(label)}</p>

`

}).get();

}

function renderNotes(query=""){

const notes=filteredNotes(query);

const table=new Table({

columns:[

{
key:"title",
label:"Title"
},

{
key:"body",
label:"Summary",
render:value=>escapeHTML(String(value).slice(0,160))
},

{
key:"tags",
label:"Tags",
render:value=>(value||[]).map(tag=>`<span class="badge">${escapeHTML(tag)}</span>`).join(" ")
},

{
key:"pinned",
label:"Pinned",
render:value=>value?"Yes":"No"
},

{
key:"id",
label:"Actions",
render:id=>`
<button class="button button-secondary" data-pin-note="${id}">Pin</button>
<button class="button button-secondary" data-delete-note="${id}">Delete</button>
`
}

],

rows:notes,

emptyMessage:"No research notes found."

});

return new Card({

title:"Research Notes",

subtitle:"Searchable local research archive",

content:table.get()

}).get();

}

function renderBookmarks(query=""){

const bookmarks=filteredBookmarks(query);

const table=new Table({

columns:[

{
key:"title",
label:"Title"
},

{
key:"reference",
label:"Reference"
},

{
key:"tags",
label:"Tags",
render:value=>(value||[]).map(tag=>`<span class="badge">${escapeHTML(tag)}</span>`).join(" ")
},

{
key:"pinned",
label:"Pinned",
render:value=>value?"Yes":"No"
},

{
key:"id",
label:"Actions",
render:id=>`
<button class="button button-secondary" data-pin-bookmark="${id}">Pin</button>
<button class="button button-secondary" data-delete-bookmark="${id}">Delete</button>
`
}

],

rows:bookmarks,

emptyMessage:"No bookmarks found."

});

return new Card({

title:"Bookmarks",

subtitle:"Saved references and research sources",

content:table.get()

}).get();

}

function renderCollections(){

const collections=State.getValue("research.collections")||[];

return new Card({

title:"Collections",

subtitle:"Create research folders for long-term projects",

content:`

<form id="collection-form" class="inline">

<input class="input" name="name" placeholder="Collection name" required>

<button class="button button-secondary" type="submit">
Create Collection
</button>

</form>

<div class="grid grid-3" style="margin-top:20px">

${collections.length?collections.map(collection=>`

<div class="card">

<div class="inline" style="justify-content:space-between">

<strong>${escapeHTML(collection.name)}</strong>

<button class="button button-secondary" data-delete-collection="${collection.id}">
Delete
</button>

</div>

<p style="margin-top:10px">
Created ${new Date(collection.createdAt).toLocaleDateString()}
</p>

</div>

`).join(""):`

<div class="card">
<p>No collections created yet.</p>
</div>

`}

</div>

`

}).get();

}

function bindResearchEvents(){

document.getElementById("research-note-form")?.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(new FormData(event.target));

const note={

id:createSafeId(),

title:data.title.trim(),

body:data.body.trim(),

tags:parseTags(data.tags),

pinned:false,

createdAt:new Date().toISOString(),

updatedAt:new Date().toISOString()

};

if(!note.title||!note.body){

toast("Title and note body required","danger");

return;

}

const notes=State.getValue("research.notes")||[];

notes.unshift(note);

State.set("research.notes",notes);

Storage.save();

toast("Research note saved");

renderResearch();

});

document.getElementById("research-bookmark-form")?.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(new FormData(event.target));

const bookmark={

id:createSafeId(),

title:data.title.trim(),

reference:data.reference.trim(),

tags:parseTags(data.tags),

pinned:false,

createdAt:new Date().toISOString()

};

if(!bookmark.title||!bookmark.reference){

toast("Bookmark title and reference required","danger");

return;

}

const bookmarks=State.getValue("research.bookmarks")||[];

bookmarks.unshift(bookmark);

State.set("research.bookmarks",bookmarks);

Storage.save();

toast("Bookmark saved");

renderResearch();

});

document.getElementById("collection-form")?.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(new FormData(event.target));

const name=data.name.trim();

if(!name){

toast("Collection name required","danger");

return;

}

const collections=State.getValue("research.collections")||[];

collections.unshift({

id:createSafeId(),

name,

items:[],

createdAt:new Date().toISOString()

});

State.set("research.collections",collections);

Storage.save();

toast("Collection created");

renderResearch();

});

document.querySelectorAll("[data-delete-note]").forEach(button=>{

button.addEventListener("click",()=>{

State.set(

"research.notes",

(State.getValue("research.notes")||[]).filter(item=>item.id!==button.dataset.deleteNote)

);

Storage.save();

toast("Note deleted");

renderResearch();

});

});

document.querySelectorAll("[data-delete-bookmark]").forEach(button=>{

button.addEventListener("click",()=>{

State.set(

"research.bookmarks",

(State.getValue("research.bookmarks")||[]).filter(item=>item.id!==button.dataset.deleteBookmark)

);

Storage.save();

toast("Bookmark deleted");

renderResearch();

});

});

document.querySelectorAll("[data-delete-collection]").forEach(button=>{

button.addEventListener("click",()=>{

State.set(

"research.collections",

(State.getValue("research.collections")||[]).filter(item=>item.id!==button.dataset.deleteCollection)

);

Storage.save();

toast("Collection deleted");

renderResearch();

});

});

document.querySelectorAll("[data-pin-note]").forEach(button=>{

button.addEventListener("click",()=>togglePinned("research.notes",button.dataset.pinNote));

});

document.querySelectorAll("[data-pin-bookmark]").forEach(button=>{

button.addEventListener("click",()=>togglePinned("research.bookmarks",button.dataset.pinBookmark));

});

}

function togglePinned(path,id){

const items=State.getValue(path)||[];

const updated=items.map(item=>item.id===id?{...item,pinned:!item.pinned}:item);

State.set(path,updated);

Storage.save();

toast("Pinned status updated");

renderResearch();

}

function parseTags(value){

return String(value||"")

.split(",")

.map(tag=>tag.trim())

.filter(Boolean);

}

function filteredNotes(query=""){

const q=String(query).toLowerCase();

return (State.getValue("research.notes")||[]).filter(note=>{

return !q||

note.title.toLowerCase().includes(q)||

note.body.toLowerCase().includes(q)||

(note.tags||[]).some(tag=>tag.toLowerCase().includes(q));

});

}

function filteredBookmarks(query=""){

const q=String(query).toLowerCase();

return (State.getValue("research.bookmarks")||[]).filter(bookmark=>{

return !q||

bookmark.title.toLowerCase().includes(q)||

bookmark.reference.toLowerCase().includes(q)||

(bookmark.tags||[]).some(tag=>tag.toLowerCase().includes(q));

});

}

function pinnedItems(){

return[

...(State.getValue("research.notes")||[]).filter(item=>item.pinned),

...(State.getValue("research.bookmarks")||[]).filter(item=>item.pinned)

];

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
