/*
=========================================================
BondStats Finora
Canvas Line Chart
Version 1.0.0
=========================================================
*/

import {
CanvasChart,
chartColor,
easeOutCubic
} from "./canvas.js";

export class LineChart extends CanvasChart{

constructor(container,options={}){

super(container,{

height:320,

lineWidth:4,

pointRadius:5,

showArea:true,

showPoints:true,

...options

});

}

draw(){

this.clear();

this.drawGrid();

const data=this.data||[];

if(!data.length){

this.drawEmpty();

return;

}

const ctx=this.context;

const values=data.map(item=>Number(item.value)||0);

const max=Math.max(...values,1);

const min=Math.min(...values,0);

const range=Math.max(max-min,1);

const padding=this.options.padding;

const chartWidth=this.width-padding*2;

const chartHeight=this.height-padding*2;

const progress=easeOutCubic(this.progress);

const points=data.map((item,index)=>{

const x=padding+(chartWidth/(data.length-1||1))*index;

const normalized=(Number(item.value)-min)/range;

const y=this.height-padding-normalized*chartHeight*progress;

return{x,y,value:item.value,label:item.label};

});

ctx.save();

if(this.options.showArea){

const gradient=ctx.createLinearGradient(0,padding,0,this.height-padding);

gradient.addColorStop(0,"rgba(0,255,156,.22)");

gradient.addColorStop(1,"rgba(0,255,156,0)");

ctx.beginPath();

points.forEach((point,index)=>{

if(index===0){

ctx.moveTo(point.x,point.y);

}else{

ctx.lineTo(point.x,point.y);

}

});

ctx.lineTo(points[points.length-1].x,this.height-padding);

ctx.lineTo(points[0].x,this.height-padding);

ctx.closePath();

ctx.fillStyle=gradient;

ctx.fill();

}

ctx.beginPath();

points.forEach((point,index)=>{

if(index===0){

ctx.moveTo(point.x,point.y);

}else{

ctx.lineTo(point.x,point.y);

}

});

ctx.strokeStyle=chartColor(0);

ctx.lineWidth=this.options.lineWidth;

ctx.lineCap="round";

ctx.lineJoin="round";

ctx.stroke();

if(this.options.showPoints){

points.forEach(point=>{

ctx.beginPath();

ctx.arc(point.x,point.y,this.options.pointRadius,0,Math.PI*2);

ctx.fillStyle="#020403";

ctx.fill();

ctx.lineWidth=3;

ctx.strokeStyle=chartColor(1);

ctx.stroke();

});

}

ctx.fillStyle="rgba(186,210,199,.82)";

ctx.font="600 11px Inter, system-ui";

ctx.textAlign="center";

points.forEach((point,index)=>{

if(index%Math.ceil(points.length/5)===0||index===points.length-1){

ctx.fillText(

String(point.label).slice(0,8),

point.x,

this.height-10

);

}

});

ctx.restore();

}

drawEmpty(){

const ctx=this.context;

ctx.save();

ctx.fillStyle="rgba(186,210,199,.75)";

ctx.font="600 14px Inter, system-ui";

ctx.textAlign="center";

ctx.fillText(

"No line data available",

this.width/2,

this.height/2

);

ctx.restore();

}

}

export function createLineChart(container,data=[],options={}){

const chart=new LineChart(container,options);

chart.setData(data);

return chart;

}
