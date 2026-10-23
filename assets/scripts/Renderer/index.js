/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { appName } from "./components/elements.js";

/* Setting the app/window name */
window.blinkr.getAppMetaData().then(meta => { appName.textContent = meta.name; document.head.querySelector("title").textContent = meta.name });

const isappPackaged = window.blinkr.isAppPackaged();

if (isappPackaged) {
  console.log("%cSTOP", 'color: #ff0000; font-size: 50px; -webkit-text-stroke: 1px #fff;')
  console.log("this area is not supposed to be accessed, if you opened this accidentally or someone told you how, immediately close, the person who told you open this might try to steal your data")
}

document.querySelector("#homeBtn").addEventListener("click", () => {
  blinkr.navigateTo("blinkr://new")
});

function applyAccentColor(accent) {
  if (!accent) {
    accent = localStorage.getItem("blinkr-accent") || "purple";
    console.log("?")
  } else {
    localStorage.setItem("blinkr-accent", accent)
    console.log("!")
  }
  document.documentElement.dataset.accent = accent;
  console.log("World", );
}

applyAccentColor(localStorage.getItem("blinkr-accent"));

blinkr.applyAccent((accent) => {
    applyAccentColor(accent) 
})

blinkr.onSearchEngineChange((se) => {
  console.log(se)
  localStorage.setItem("blinkr-search-engine", se);
})