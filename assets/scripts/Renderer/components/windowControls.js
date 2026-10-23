/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { btnClose, btnMaximize, btnMinimize, urlInput } from "./elements.js";
import { validateURL } from "./search.js";

// ── Window Controls ────────────────────────────────────────
btnMinimize.addEventListener('click', () => window.blinkr.minimize());
btnMaximize.addEventListener('click', async () => {
  const maximized = await blinkr.maximized();
  if (maximized) blinkr.unmaximize?.();
  else blinkr.maximize();
});
btnClose.addEventListener('click', () => window.blinkr.close());

/* handling url input value if window is opened fro _blank method */
window.addEventListener("DOMContentLoaded", async () => {
  let url = validateURL(await window.blinkr.getUrl());
  window.blinkr.themeChange(localStorage.getItem("blinkr-theme"));
    const is404 =
      url.includes("404.html") ||
      url.includes("blinkr://404");
  const isNewPage =
      url.includes("new.html") ||
      url.includes("blinkr://new");
  if (isNewPage) {
      urlInput.value = "";
      return;
  }
  if (is404) return;
  if (url.includes("/blinkr-pages/") && url.endsWith(".html")) {
      let pageName = url.split("/blinkr-pages/")[1].split(".html")[0];
      urlInput.value = "blinkr://" + pageName;
  } else {
    urlInput.value = url;
  }
})

const toolbar = document.getElementById('toolbar');
const rest = document.querySelector('.rest');

setHeight(0);

export function setHeight(height) {
    if (typeof height !== "number") {
      throw new Error("line 57, from FUNCTION setHeight: parameter height must be an integer");
      return false;
    }
    window.blinkr.setHeight(96 + height);
    document.body.style.maxHeight = "96px"
    console.log("succesfully setted height to ", 96 + height);
    return true;
}

const titlebarDrag = document.querySelector('.titlebar-drag');

titlebarDrag.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // left click only
  window.blinkr.startDrag();
});

titlebarDrag.addEventListener('mouseup', () => {
  window.blinkr.stopDrag();
});

// Also stop if mouse leaves the window entirely
document.addEventListener('mouseup', () => {
  window.blinkr.stopDrag();
});