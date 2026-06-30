document.addEventListener("DOMContentLoaded",async()=>{

try{

const module=await import("./boot.js");

await module.bootFinora();

}catch(error){

console.error("[Finora Startup Error]",error);

const boot=document.getElementById("boot-screen");

if(boot){

boot.innerHTML=`

<div style="
max-width:720px;
padding:32px;
border-radius:24px;
background:rgba(10,25,18,.92);
border:1px solid rgba(0,255,156,.25);
color:white;
font-family:system-ui;
text-align:left;
">

<h1>BondStats Finora</h1>

<h2 style="margin-top:18px;color:#ff5f7a">
Startup Error
</h2>

<p style="margin-top:14px;color:#bad2c7">
${escapeHTML(error.message)}
</p>

<pre style="
margin-top:18px;
white-space:pre-wrap;
font-size:13px;
color:#9fb5ac;
background:#020403;
padding:16px;
border-radius:14px;
overflow:auto;
">${escapeHTML(error.stack||"")}</pre>

<button onclick="location.reload()" style="
margin-top:20px;
padding:14px 18px;
border-radius:14px;
border:0;
background:#00ff9c;
font-weight:800;
">
Reload
</button>

</div>

`;

}

}

});

function escapeHTML(value){

return String(value||"").replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[char]));

}
