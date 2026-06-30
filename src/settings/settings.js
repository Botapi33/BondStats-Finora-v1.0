/*
=========================================================
BondStats Finora
Settings Workspace
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { Card } from "../components/card.js";
import { toast } from "../components/toast.js";
import { compatibilityReport } from "../utils/compatibility.js";

export function initializeSettings(){

const root=document.getElementById("settings-view");

if(!root){

return;

}

renderSettings(root);

}

function renderSettings(root){

const settings=State.getValue("settings")||{};

root.innerHTML="";

const page=document.createElement("div");

page.className="page fade-up";

page.appendChild(renderHeader());

page.appendChild(renderPreferences(settings));

page.appendChild(renderDataTools());

page.appendChild(renderSystemInfo());

root.appendChild(page);

bindSettingsEvents();

}

function renderHeader(){

return new Card({

className:"hero-card",

content:`

<div class="hero">

<div>

<h1 class="gradient-text">Settings</h1>

<p>
Configure the Finora workspace, manage local data and review offline system compatibility.
</p>

</div>

<div class="inline">

<span class="badge">Offline</span>

<span class="badge">LocalStorage</span>

<span class="badge">PWA Ready</span>

</div>

</div>

`

}).get();

}

function renderPreferences(settings){

return new Card({

title:"Workspace Preferences",

subtitle:"Local settings saved on this device",

content:`

<form id="settings-form" class="grid grid-2">

<label class="form-group">

<span class="form-label">Theme</span>

<select class="select" name="theme">

<option value="dark" ${settings.theme==="dark"?"selected":""}>Emerald Dark</option>

<option value="compact" ${settings.theme==="compact"?"selected":""}>Compact Dark</option>

</select>

</label>

<label class="form-group">

<span class="form-label">Workspace Mode</span>

<select class="select" name="mode">

<option value="professional" ${State.getValue("user.mode")==="professional"?"selected":""}>Professional</option>

<option value="student" ${State.getValue("user.mode")==="student"?"selected":""}>Student</option>

<option value="investor" ${State.getValue("user.mode")==="investor"?"selected":""}>Investor</option>

<option value="research" ${State.getValue("user.mode")==="research"?"selected":""}>Research</option>

<option value="eli5" ${State.getValue("user.mode")==="eli5"?"selected":""}>Explain Like I’m 5</option>

</select>

</label>

<label class="form-group">

<span class="form-label">Animations</span>

<select class="select" name="animations">

<option value="true" ${settings.animations!==false?"selected":""}>Enabled</option>

<option value="false" ${settings.animations===false?"selected":""}>Reduced</option>

</select>

</label>

<label class="form-group">

<span class="form-label">Compact Mode</span>

<select class="select" name="compactMode">

<option value="false" ${settings.compactMode!==true?"selected":""}>Disabled</option>

<option value="true" ${settings.compactMode===true?"selected":""}>Enabled</option>

</select>

</label>

<div class="inline" style="grid-column:1/-1">

<button class="button button-primary" type="submit">
Save Settings
</button>

</div>

</form>

`

}).get();

}

function renderDataTools(){

return new Card({

title:"Data Management",

subtitle:"Export, backup or reset local Finora data",

content:`

<div class="grid grid-3">

<button id="download-backup" class="button button-secondary">
Download Backup
</button>

<button id="print-workspace" class="button button-secondary">
Print Workspace
</button>

<button id="reset-workspace" class="button button-secondary">
Reset Local Data
</button>

</div>

<p style="margin-top:18px">
All Finora data is stored locally in your browser. No external server is used.
</p>

`

}).get();

}

function renderSystemInfo(){

const report=compatibilityReport();

return new Card({

title:"System Compatibility",

subtitle:"Browser capability report",

content:`

<div class="grid grid-2">

${infoRow("LocalStorage",report.localStorage)}

${infoRow("Canvas",report.canvas)}

${infoRow("Service Worker",report.serviceWorker)}

${infoRow("Clipboard",report.clipboard)}

${infoRow("Crypto IDs",report.cryptoId)}

${infoRow("Online",report.online)}

</div>

<div class="card" style="margin-top:20px">

<h3>User Agent</h3>

<p style="margin-top:10px">${escapeHTML(report.userAgent)}</p>

</div>

`

}).get();

}

function infoRow(label,value){

return`

<div class="card">

<div class="inline" style="justify-content:space-between">

<strong>${escapeHTML(label)}</strong>

<span class="badge ${value?"badge-success":"badge-warning"}">

${value?"Supported":"Limited"}

</span>

</div>

</div>

`;

}

function bindSettingsEvents(){

document.getElementById("settings-form")?.addEventListener("submit",event=>{

event.preventDefault();

const data=Object.fromEntries(new FormData(event.target));

State.set("settings.theme",data.theme);

State.set("settings.animations",data.animations==="true");

State.set("settings.compactMode",data.compactMode==="true");

State.set("user.mode",data.mode);

document.documentElement.dataset.theme=data.theme;

document.documentElement.dataset.compact=data.compactMode;

Storage.save();

toast("Settings saved");

});

document.getElementById("download-backup")?.addEventListener("click",()=>{

Storage.downloadBackup();

toast("Backup downloaded");

});

document.getElementById("print-workspace")?.addEventListener("click",()=>{

window.print();

});

document.getElementById("reset-workspace")?.addEventListener("click",()=>{

const confirmed=confirm("Reset all local BondStats Finora data? This cannot be undone.");

if(!confirmed){

return;

}

Storage.clear();

toast("Local data reset");

setTimeout(()=>location.reload(),500);

});

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
