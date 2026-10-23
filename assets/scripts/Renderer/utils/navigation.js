import { btnBack, btnReload, btnForward, urlInput, settingsBtn } from "./elements.js";
import { isValidUrl } from "./url.js";
import { setFavicon, updateSecurityIcon } from "./urlBar.js";

// ── Nav Buttons ────────────────────────────────────────────
btnBack.addEventListener('click', () => window.blinkr.goBack() );
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
window.blinkr.onUrlChanged((url) => {
  if (document.activeElement !== urlInput) {
    if (url.includes("/blinkr-pages/") && url.endsWith(".html")) {
        let pageName = url.split("/blinkr-pages/")[1].split(".html")[0].replace("/index", "");
        urlInput.value = "blinkr://" + pageName;
    } else if (url === "about:blank") {
      return;
    } else {
      urlInput.value = url;
    }
  }
  updateSecurityIcon(url);
});

window.blinkr.onTitleChanged((title) => {
  document.title = title ? `${title} — Blinkr` : 'Blinkr';
});

window.blinkr.onFaviconChanged((faviconUrl) => {
    const url = isValidUrl(faviconUrl)
  if (url) {
        setFavicon(faviconUrl);
    } else {
        setFavicon(DEFAULT_FAVICON);
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

settingsBtn.addEventListener("click", () => {
    window.blinkr.openSettings()
});