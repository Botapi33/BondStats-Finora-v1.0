/*
=========================================================
BondStats Finora
Canvas Bar Chart
Version 1.0.0
=========================================================
*/

import {
CanvasChart,
chartColor,
roundedRect,
easeOutCubic
} from "./canvas.js";

export class BarChart extends CanvasChart{

constructor(container,options={}){

super(container,{

height:320,

barRadius:10,

showLabels:true,

showValues:true,

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

const padding=this.options.padding;

const chartWidth=this.width-padding*2;

const chartHeight=this.height-padding*2;

const max=Math.max(...data.map(item=>Number(item.value)||0),1);

const gap=14;

const barWidth=Math.max(

18,

(chartWidth-(data.length-1)*gap)/data.length

);

ctx.save();

data.forEach((item,index)=>{

const value=Number(item.value)||0;

const progress=easeOutCubic(this.progress);

const height=(value/max)*chartHeight*progress;

const x=padding+index*(barWidth+gap);

const y=this.height-padding-height;

const gradient=ctx.createLinearGradient(0,y,0,y+height);

gradient.addColorStop(0,chartColor(index));

gradient.addColorStop(1,"rgba(0,255,156,.28)");

ctx.fillStyle=gradient;

roundedRect(

ctx,

x,

y,

barWidth,

height,

this.options.barRadius

);

ctx.fill();

if(this.options.showValues){

ctx.fillStyle="rgba(244,255,249,.92)";

ctx.font="700 12px Inter, system-ui";

ctx.textAlign="center";

ctx.fillText(

`${value.toFixed(0)}%`,

x+barWidth/2,

Math.max(18,y-8)

);

}

if(this.options.showLabels){

ctx.fillStyle="rgba(186,210,199,.82)";

ctx.font="600 11px Inter, system-ui";

ctx.textAlign="center";

ctx.fillText(

String(item.label).slice(0,10),

x+barWidth/2,

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

"No chart data available",

this.width/2,

this.height/2

);

ctx.restore();

}

}

export function createBarChart(container,data=[],options={}){

const chart=new BarChart(container,options);

chart.setData(data);

return chart;

}
