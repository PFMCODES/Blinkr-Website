/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { btnBack, btnReload, btnForward, urlInput, settingsBtn, DEFAULT_FAVICON, user, bookmarks, bookmark, downloads, BookMarked, NoBookMark, title } from "./elements.js";
import { setFavicon, updateSecurityIcon } from "./urlBar.js";
import { isValidUrl } from "./search.js";
import { limitString } from "../pages/util.js"

// ── Nav Buttons ────────────────────────────────────────────
btnBack.addEventListener('click', () => window.blinkr.goBack());
btnForward.addEventListener('click', () => {
    window.blinkr.url
    window.blinkr.goForward()
});
btnReload.addEventListener('click', () => {
  if (document.body.classList.contains('loading')) {
    window.blinkr.stopLoading();
  } else {
    window.blinkr.reload();
  }
});
// ── IPC Events ─────────────────────────────────────────────
window.blinkr.onUrlChanged(async (url) => {
    const startUrl = await window.blinkr.getUrl();
    console.log(url);

    if (document.activeElement !== urlInput) {
      window.blinkr.themeChange(localStorage.getItem("blinkr-theme"));
      const is404 = url.includes("blinkr://errors/NOT FOUND") || url.includes("NOT FOUND.html");
      const isNewPage = url === startUrl || url.includes("new.html") || url.includes("blinkr://new");
    if (isNewPage) {
        urlInput.value = "";
        return;
    }
    if (is404) return;
    if (url.includes("/blinkr-pages/") && url.endsWith(".html")) {
        let pageName = url.split("/blinkr-pages/")[1].split(".html")[0].replace("/index", "");
        urlInput.value = "blinkr://" + pageName;
        const id = crypto.randomUUID();
        localStorage.setItem("currentTab", JSON.stringify({url, id}));
    } else if (url === "about:blank") {
      return;
    } else {
      urlInput.value = url;
    }
    }
    updateSecurityIcon(url);
    updateBookMarkIcon(url)
});

window.blinkr.onTitleChanged((t)=> {
  t = limitString(t, 50)
  document.title = t ? `${t} — Blinkr` : 'Blinkr';
  title.innerText = t
});

window.blinkr.onFaviconChanged((faviconUrl) => {
    const url = isValidUrl(faviconUrl)
    if (url) {
          setFavicon(faviconUrl);
    } else {
        setFavicon(DEFAULT_FAVICON());
    }
});

window.blinkr.onLoadingChanged((loading) => {
  document.body.classList.toggle('loading', loading);
});

window.blinkr.onNavStateChanged(({ canGoBack, canGoForward }) => {
  btnBack.disabled = !canGoBack;
  btnForward.disabled = !canGoForward;
});

window.blinkr.onLoadError(({ errorCode, errorDescription, url }) => {
  console.warn('Load error:', errorCode, errorDescription, url);
});

/* Button CLick Handling */

settingsBtn.addEventListener("click", async () => {
    await window.blinkr.navigateTo("blinkr://settings/");
});

downloads.addEventListener("click", async () => {
    await window.blinkr.navigateTo("blinkr://downloads");
});

user.addEventListener("click", async () => {
  await window.blinkr.navigateTo('https://pfmcodes.onrender.com/authentication/apps/Blinkr.html')
});

bookmarks.addEventListener("click", async () => {
  await window.blinkr.navigateTo('blinkr://bookmarks');
});

bookmark.addEventListener("click", await updateBookMark);

async function updateBookMark() {
     const CURL = await blinkr.getCurrentURL();
     const bookmarks = await blinkr.getBookMarks();

     const isBookmarked = bookmarks.find((b) => b.url === CURL);
      if (isBookmarked) {
        await removeBookMark(isBookmarked.timestamp);
      } else {
        await addBookMark(CURL);
      }
      await updateBookMarkIcon();
}

async function addBookMark(url) {
    await blinkr.bookmark({
      url,
      timestamp: new Date().toISOString()
    });
}

async function removeBookMark(timestamp) {
    await blinkr.removeBookMark(timestamp);
}

async function updateBookMarkIcon() {
     const CURL = await blinkr.getCurrentURL();
     const bookmarks = await blinkr.getBookMarks();

     const isBookmarked = bookmarks.find((b) => b.url === CURL);
      if (isBookmarked) {
          bookmark.innerHTML = BookMarked;
      } else { 
        bookmark.innerHTML = NoBookMark;
      }
}