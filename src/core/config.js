/*
=========================================================
BondStats Finora
Core Configuration
Version 1.0.0
=========================================================
*/

export const APP = Object.freeze({

name: "BondStats Finora",

shortName: "Finora",

version: "1.0.0",

author: "BondStats",

environment: "production",

offline: true,

debug: false

});

export const STORAGE = Object.freeze({

database: "bondstats-finora",

version: 1,

keys: {

settings: "finora.settings",

portfolio: "finora.portfolio",

workspace: "finora.workspace",

research: "finora.research",

notes: "finora.notes",

chat: "finora.chat",

history: "finora.history",

brief: "finora.dailybrief",

learn: "finora.learn"

}

});

export const ROUTES = Object.freeze([

"dashboard",

"chat",

"portfolio",

"research",

"learn",

"future",

"brief",

"settings"

]);

export const UI = Object.freeze({

sidebarWidth: 310,

topbarHeight: 74,

animationSpeed: 220,

mobileBreakpoint: 900,

desktopBreakpoint: 1400,

toastDuration: 2800,

glassBlur: 22,

maxWorkspaceWidth: 1800

});

export const PORTFOLIO = Object.freeze({

maxAssets: 5000,

allocationLimit: 100,

riskLevels: [

"Very Low",

"Low",

"Moderate",

"High",

"Very High"

],

assetTypes: [

"Stocks",

"Bonds",

"ETFs",

"Mutual Funds",

"REITs",

"Commodities",

"Gold",

"Cash",

"Crypto",

"Other"

]

});

export const AI = Object.freeze({

maxConversationLength: 500,

streamSpeed: 8,

defaultMode: "professional",

modes: [

"professional",

"student",

"investor",

"research",

"eli5"

]

});

export const COLORS = Object.freeze({

primary: "#00ff9c",

secondary: "#48ffd2",

background: "#040806",

surface: "#0c1713",

success: "#00ff9c",

warning: "#ffd166",

danger: "#ff6b81",

info: "#5ec9ff"

});

export const EVENTS = Object.freeze({

ROUTE_CHANGED: "finora:route",

STATE_CHANGED: "finora:state",

PORTFOLIO_UPDATED: "finora:portfolio",

CHAT_UPDATED: "finora:chat",

RESEARCH_UPDATED: "finora:research",

SETTINGS_UPDATED: "finora:settings",

THEME_CHANGED: "finora:theme"

});

export const DEFAULT_SETTINGS = Object.freeze({

theme: "dark",

accent: "emerald",

animations: true,

compactMode: false,

offlineMode: true,

showTooltips: true,

autoSave: true,

language: "en"

});
