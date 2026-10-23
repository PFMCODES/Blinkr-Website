/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { urlInput, favicon, securityIcon, DEFAULT_FAVICON } from "./elements.js";
import { validateURL } from "./search.js";

function updateSecurityIcon(url) {
  securityIcon.className = 'security-icon';
  if (!url) return;
  if (url.startsWith('https://')) {
    securityIcon.classList.add('secure');
    securityIcon.addEventListener("mouseenter", () => {
    })
  } else if (url.startsWith('http://')) {
    securityIcon.classList.add('insecure');
    securityIcon.title = 'Not secure';
  }
}

function setFavicon(url) {
  if (!url) {
    setDefaultFavicon();
    return;
  }

  const img = new Image();

  img.onload = () => {
    favicon.classList.remove('default');
    favicon.classList.add('image');

    // remove mask when showing real favicon
    favicon.style.maskImage = 'none';
    favicon.style.webkitMaskImage = 'none';

    favicon.src = url;
  };

  img.onerror = () => {
    setDefaultFavicon();
  };

  img.src = url;
}

function setDefaultFavicon() {
  favicon.classList.remove('image');
  favicon.classList.add('default');

  favicon.src = ''; // remove image

  // explicitly set mask (important!)
  favicon.style.maskImage = `url("${DEFAULT_FAVICON()}")`;
  favicon.style.webkitMaskImage = `url("${DEFAULT_FAVICON()}")`;
}

// ── Address Bar ────────────────────────────────────────────
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    let val = urlInput.value.trim();
    const url = validateURL(val);
    console.log(val, url)
    if (url) window.blinkr.navigateTo(url);
    urlInput.blur();
  }
  if (e.key === 'Escape') {
    urlInput.blur();
  }
});

// Select all on focus
urlInput.addEventListener('focus', () => urlInput.select());
urlInput.addEventListener('click', () => urlInput.select());

export { setDefaultFavicon, updateSecurityIcon, setFavicon };