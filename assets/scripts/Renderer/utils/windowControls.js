import { btnClose, btnMaximize, btnMinimize, urlInput } from "./elements.js";

// ── Window Controls ────────────────────────────────────────
btnMinimize.addEventListener('click', () => window.blinkr.minimize());
btnMaximize.addEventListener('click', () => window.blinkr.maximize());
btnClose.addEventListener('click', () => window.blinkr.close());

/* handling url input value if window is opened fro _blank method */
window.addEventListener("DOMContentLoaded", async () => {
  let url = await window.blinkr.getUrl();
  if (url.includes("/blinkr-pages/") && url.endsWith(".html")) {
      let pageName = url.split("/blinkr-pages/")[1].split(".html")[0];
      urlInput.value = "blinkr://" + pageName;
  } else {
    urlInput.value = url
  }
  window.blinkr.themeChange(localStorage.getItem("blinkr-theme"), "https://google.com/");
})

const interactiveElements = document.querySelector('#toolbar');

[...interactiveElements.children].forEach(el => {
    el.addEventListener('mouseenter', () => {
        window.blinkr.setIgnoreMouse(false);
    });
    el.addEventListener('mouseleave', () => {
        window.blinkr.setIgnoreMouse(true, { forward: true });
    });
});

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