/*
=========================================================
BondStats Finora
Table Component
Version 1.0.0
=========================================================
*/

export class Table{

constructor(options={}){

this.options={

columns:[],

rows:[],

emptyMessage:"No data available.",

striped:false,

hover:true,

compact:false,

className:"",

onRowClick:null,

...options

};

this.element=this.create();

}

create(){

const wrapper=document.createElement("div");

wrapper.className=`table-wrapper ${this.options.className}`.trim();

const table=document.createElement("table");

table.className="table";

if(this.options.striped){

table.classList.add("table-striped");

}

if(this.options.compact){

table.classList.add("table-compact");

}

const thead=document.createElement("thead");

const headRow=document.createElement("tr");

this.options.columns.forEach(column=>{

const th=document.createElement("th");

th.textContent=column.label||column;

headRow.appendChild(th);

});

thead.appendChild(headRow);

table.appendChild(thead);

const tbody=document.createElement("tbody");

table.appendChild(tbody);

wrapper.appendChild(table);

this.tbody=tbody;

this.renderRows();

return wrapper;

}

renderRows(){

this.tbody.innerHTML="";

if(this.options.rows.length===0){

const row=document.createElement("tr");

const cell=document.createElement("td");

cell.colSpan=this.options.columns.length;

cell.className="table-empty";

cell.textContent=this.options.emptyMessage;

row.appendChild(cell);

this.tbody.appendChild(row);

return;

}

this.options.rows.forEach((item,index)=>{

const row=document.createElement("tr");

if(this.options.hover){

row.classList.add("table-hover-row");

}

this.options.columns.forEach(column=>{

const td=document.createElement("td");

const key=column.key||column;

const value=item[key];

if(column.render){

const result=column.render(value,item,index);

if(result instanceof HTMLElement){

td.appendChild(result);

}else{

td.innerHTML=result;

}

}else{

td.textContent=value??"";

}

row.appendChild(td);

});

if(typeof this.options.onRowClick==="function"){

row.style.cursor="pointer";

row.addEventListener("click",()=>{

this.options.onRowClick(item,index);

});

}

this.tbody.appendChild(row);

});

}

setRows(rows=[]){

this.options.rows=rows;

this.renderRows();

}

addRow(row){

this.options.rows.push(row);

this.renderRows();

}

clear(){

this.options.rows=[];

this.renderRows();

}

mount(parent){

if(typeof parent==="string"){

parent=document.querySelector(parent);

}

parent?.appendChild(this.element);

return this;

}

destroy(){

this.element.remove();

}

get(){

return this.element;

}

}

export function createTable(options){

return new Table(options);

}
