/*
=========================================================
BondStats Finora
Canvas Chart Core
Version 1.0.0
=========================================================
*/

export class CanvasChart{

constructor(container,options={}){

this.container=typeof container==="string"

?document.querySelector(container)

:container;

this.options={

height:280,

padding:36,

animationDuration:700,

background:"transparent",

...options

};

this.canvas=document.createElement("canvas");

this.context=this.canvas.getContext("2d");

this.pixelRatio=window.devicePixelRatio||1;

this.animationFrame=null;

this.progress=0;

this.data=[];

this.resizeObserver=null;

this.initialize();

}

initialize(){

if(!this.container){

throw new Error("CanvasChart requires a valid container.");

}

this.canvas.className="finora-canvas-chart";

this.canvas.setAttribute("role","img");

this.container.innerHTML="";

this.container.appendChild(this.canvas);

this.resize();

this.resizeObserver=new ResizeObserver(()=>{

this.resize();

this.draw();

});

this.resizeObserver.observe(this.container);

}

resize(){

const width=this.container.clientWidth||320;

const height=this.options.height;

this.canvas.width=width*this.pixelRatio;

this.canvas.height=height*this.pixelRatio;

this.canvas.style.width=`${width}px`;

this.canvas.style.height=`${height}px`;

this.context.setTransform(

this.pixelRatio,

0,

0,

this.pixelRatio,

0,

0

);

this.width=width;

this.height=height;

}

setData(data=[]){

this.data=data;

this.animate();

}

animate(){

cancelAnimationFrame(this.animationFrame);

const start=performance.now();

const duration=this.options.animationDuration;

const tick=now=>{

const elapsed=now-start;

this.progress=Math.min(1,elapsed/duration);

this.draw();

if(this.progress<1){

this.animationFrame=requestAnimationFrame(tick);

}

};

this.animationFrame=requestAnimationFrame(tick);

}

clear(){

this.context.clearRect(

0,

0,

this.width,

this.height

);

if(this.options.background!=="transparent"){

this.context.fillStyle=this.options.background;

this.context.fillRect(

0,

0,

this.width,

this.height

);

}

}

drawGrid(){

const ctx=this.context;

const lines=5;

ctx.save();

ctx.strokeStyle="rgba(255,255,255,.055)";

ctx.lineWidth=1;

for(let i=0;i<=lines;i++){

const y=this.options.padding+

((this.height-this.options.padding*2)/lines)*i;

ctx.beginPath();

ctx.moveTo(this.options.padding,y);

ctx.lineTo(this.width-this.options.padding,y);

ctx.stroke();

}

ctx.restore();

}

draw(){

this.clear();

}

destroy(){

cancelAnimationFrame(this.animationFrame);

this.resizeObserver?.disconnect();

this.canvas.remove();

}

}

export function createCanvas(container,options){

return new CanvasChart(container,options);

}

export function chartColor(index){

const colors=[

"#00ff9c",

"#42ffd0",

"#66c9ff",

"#ffd166",

"#ff5f7a",

"#a78bfa",

"#00c875",

"#ff9f43"

];

return colors[index%colors.length];

}

export function roundedRect(ctx,x,y,width,height,radius){

const r=Math.min(radius,width/2,height/2);

ctx.beginPath();

ctx.moveTo(x+r,y);

ctx.arcTo(x+width,y,x+width,y+height,r);

ctx.arcTo(x+width,y+height,x,y+height,r);

ctx.arcTo(x,y+height,x,y,r);

ctx.arcTo(x,y,x+width,y,r);

ctx.closePath();

}

export function easeOutCubic(value){

return 1-Math.pow(1-value,3);

}
