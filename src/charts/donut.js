/*
=========================================================
BondStats Finora
Canvas Donut Chart
Version 1.0.0
=========================================================
*/

import {
CanvasChart,
chartColor,
easeOutCubic
} from "./canvas.js";

export class DonutChart extends CanvasChart{

constructor(container,options={}){

super(container,{

height:320,

innerRadius:72,

outerRadius:112,

showLegend:true,

...options

});

}

draw(){

this.clear();

const data=this.data||[];

if(!data.length){

this.drawEmpty();

return;

}

const ctx=this.context;

const total=data.reduce((sum,item)=>sum+(Number(item.value)||0),0);

if(total<=0){

this.drawEmpty();

return;

}

const progress=easeOutCubic(this.progress);

const cx=this.width/2;

const cy=this.height/2-8;

let start=-Math.PI/2;

ctx.save();

data.forEach((item,index)=>{

const value=Number(item.value)||0;

const angle=(value/total)*Math.PI*2*progress;

ctx.beginPath();

ctx.strokeStyle=chartColor(index);

ctx.lineWidth=this.options.outerRadius-this.options.innerRadius;

ctx.lineCap="round";

ctx.arc(
cx,
cy,
(this.options.outerRadius+this.options.innerRadius)/2,
start,
start+angle
);

ctx.stroke();

start+=angle;

});

ctx.fillStyle="rgba(244,255,249,.96)";

ctx.font="800 32px Inter, system-ui";

ctx.textAlign="center";

ctx.fillText(
`${Math.round(total)}%`,
cx,
cy+10
);

ctx.fillStyle="rgba(186,210,199,.8)";

ctx.font="600 12px Inter, system-ui";

ctx.fillText(
"Total",
cx,
cy+34
);

ctx.restore();

if(this.options.showLegend){

this.drawLegend(data,total);

}

}

drawLegend(data,total){

const ctx=this.context;

const startY=this.height-54;

const itemWidth=this.width/Math.max(data.length,1);

ctx.save();

data.forEach((item,index)=>{

const x=itemWidth*index+itemWidth/2;

ctx.fillStyle=chartColor(index);

ctx.beginPath();

ctx.arc(x-28,startY,5,0,Math.PI*2);

ctx.fill();

ctx.fillStyle="rgba(186,210,199,.86)";

ctx.font="600 11px Inter, system-ui";

ctx.textAlign="left";

ctx.fillText(
String(item.label).slice(0,12),
x-18,
startY+4
);

});

ctx.restore();

}

drawEmpty(){

const ctx=this.context;

ctx.save();

ctx.strokeStyle="rgba(0,255,156,.18)";

ctx.lineWidth=28;

ctx.beginPath();

ctx.arc(this.width/2,this.height/2,82,0,Math.PI*2);

ctx.stroke();

ctx.fillStyle="rgba(186,210,199,.75)";

ctx.font="600 14px Inter, system-ui";

ctx.textAlign="center";

ctx.fillText(
"No chart data available",
this.width/2,
this.height/2+6
);

ctx.restore();

}

}

export function createDonutChart(container,data=[],options={}){

const chart=new DonutChart(container,options);

chart.setData(data);

return chart;

}
