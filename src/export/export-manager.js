/*
=========================================================
BondStats Finora
Export Manager
Version 1.0.0
=========================================================
*/

import State from "../core/state.js";
import Storage from "../core/storage.js";
import { toast } from "../components/toast.js";

import {
downloadCSV,
portfolioToCSV,
researchNotesToCSV,
bookmarksToCSV,
analyticsToCSV
} from "./csv-export.js";

import {
printCurrentWorkspace,
portfolioReport,
researchReport,
briefReport
} from "./pdf-export.js";

import { calculateAnalytics } from "../portfolio/analytics.js";

export function initializeExportManager(){

document.addEventListener("click",event=>{

const target=event.target.closest("[data-export]");

if(!target){

return;

}

const type=target.dataset.export;

runExport(type);

});

}

export function runExport(type){

switch(type){

case"portfolio-csv":

exportPortfolioCSV();

break;

case"portfolio-json":

exportPortfolioJSON();

break;

case"portfolio-report":

exportPortfolioReport();

break;

case"research-csv":

exportResearchCSV();

break;

case"research-json":

exportResearchJSON();

break;

case"research-report":

exportResearchReport();

break;

case"brief-report":

exportBriefReport();

break;

case"workspace-backup":

exportWorkspaceBackup();

break;

case"print":

printCurrentWorkspace();

break;

default:

toast("Unknown export type","warning");

}

}

export function exportPortfolioCSV(){

const assets=State.getValue("portfolio.assets")||[];

if(!assets.length){

toast("No portfolio assets to export","warning");

return;

}

const csv=portfolioToCSV(assets);

downloadText(

"bondstats-finora-portfolio.csv",

csv,

"text/csv;charset=utf-8"

);

toast("Portfolio CSV exported");

}

export function exportPortfolioJSON(){

const assets=State.getValue("portfolio.assets")||[];

downloadJSON(

"bondstats-finora-portfolio.json",

{

exportedAt:new Date().toISOString(),

assets,

analytics:calculateAnalytics()

}

);

toast("Portfolio JSON exported");

}

export function exportPortfolioReport(){

portfolioReport(

State.getValue("portfolio.assets")||[],

calculateAnalytics()

);

toast("Portfolio report opened");

}

export function exportResearchCSV(){

const notes=State.getValue("research.notes")||[];

const bookmarks=State.getValue("research.bookmarks")||[];

const csv=[

"# Notes",

researchNotesToCSV(notes),

"",

"# Bookmarks",

bookmarksToCSV(bookmarks)

].join("\n");

downloadText(

"bondstats-finora-research.csv",

csv,

"text/csv;charset=utf-8"

);

toast("Research CSV exported");

}

export function exportResearchJSON(){

downloadJSON(

"bondstats-finora-research.json",

{

exportedAt:new Date().toISOString(),

notes:State.getValue("research.notes")||[],

bookmarks:State.getValue("research.bookmarks")||[],

collections:State.getValue("research.collections")||[]

}

);

toast("Research JSON exported");

}

export function exportResearchReport(){

researchReport(

State.getValue("research.notes")||[],

State.getValue("research.bookmarks")||[]

);

toast("Research report opened");

}

export function exportBriefReport(){

briefReport(

State.getValue("brief")||{}

);

toast("Brief report opened");

}

export function exportWorkspaceBackup(){

Storage.downloadBackup();

toast("Workspace backup downloaded");

}

export function exportAnalyticsCSV(){

const csv=analyticsToCSV(

calculateAnalytics()

);

downloadText(

"bondstats-finora-analytics.csv",

csv,

"text/csv;charset=utf-8"

);

toast("Analytics CSV exported");

}

export function downloadJSON(filename,data){

downloadText(

filename,

JSON.stringify(data,null,2),

"application/json;charset=utf-8"

);

}

export function downloadText(filename,content,type="text/plain;charset=utf-8"){

const blob=new Blob([content],{type});

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=filename;

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);

}

export function createExportButtons(){

return`

<div class="grid grid-3">

<button class="button button-secondary" data-export="portfolio-csv">
Portfolio CSV
</button>

<button class="button button-secondary" data-export="portfolio-json">
Portfolio JSON
</button>

<button class="button button-secondary" data-export="portfolio-report">
Portfolio Report
</button>

<button class="button button-secondary" data-export="research-json">
Research JSON
</button>

<button class="button button-secondary" data-export="workspace-backup">
Workspace Backup
</button>

<button class="button button-secondary" data-export="print">
Print
</button>

</div>

`;

}
