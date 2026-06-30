/*
=========================================================
BondStats Finora
CSV Export Utilities
Version 1.0.0
=========================================================
*/

export function toCSV(rows=[]){

if(!Array.isArray(rows)||rows.length===0){

return "";

}

const headers=collectHeaders(rows);

const lines=[

headers.map(escapeCell).join(","),

...rows.map(row=>

headers.map(header=>escapeCell(row[header])).join(",")

)

];

return lines.join("\n");

}

export function downloadCSV(filename,rows=[]){

const csv=toCSV(rows);

const blob=new Blob([csv],{

type:"text/csv;charset=utf-8"

});

downloadBlob(filename,blob);

}

export function portfolioToCSV(assets=[]){

return toCSV(

assets.map(asset=>({

Name:asset.name||"",

Type:asset.type||"",

Allocation:asset.allocation||0,

Region:asset.region||"",

Sector:asset.sector||"",

Currency:asset.currency||"",

Risk:asset.risk||"",

Notes:asset.notes||"",

CreatedAt:asset.createdAt||"",

UpdatedAt:asset.updatedAt||""

}))

);

}

export function researchNotesToCSV(notes=[]){

return toCSV(

notes.map(note=>({

Title:note.title||"",

Body:note.body||"",

Tags:(note.tags||[]).join("; "),

Pinned:note.pinned?"Yes":"No",

CreatedAt:note.createdAt||"",

UpdatedAt:note.updatedAt||""

}))

);

}

export function bookmarksToCSV(bookmarks=[]){

return toCSV(

bookmarks.map(bookmark=>({

Title:bookmark.title||"",

Reference:bookmark.reference||"",

Tags:(bookmark.tags||[]).join("; "),

Pinned:bookmark.pinned?"Yes":"No",

CreatedAt:bookmark.createdAt||""

}))

);

}

export function analyticsToCSV(analytics={}){

const rows=[];

Object.entries(analytics).forEach(([section,value])=>{

if(value&&typeof value==="object"&&!Array.isArray(value)){

Object.entries(value).forEach(([name,amount])=>{

rows.push({

Section:section,

Name:name,

Value:amount

});

});

}else{

rows.push({

Section:"Metric",

Name:section,

Value:value

});

}

});

return toCSV(rows);

}

function collectHeaders(rows){

const headers=new Set();

rows.forEach(row=>{

Object.keys(row).forEach(key=>headers.add(key));

});

return [...headers];

}

function escapeCell(value){

const text=String(value??"");

const escaped=text.replaceAll('"','""');

return `"${escaped}"`;

}

function downloadBlob(filename,blob){

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=filename;

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);

}
