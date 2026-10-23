import { urlInput, favicon, securityIcon } from "./elements.js";

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
  favicon.style.maskImage = `url("${DEFAULT_FAVICON}")`;
  favicon.style.webkitMaskImage = `url("${DEFAULT_FAVICON}")`;
}

// ── Address Bar ────────────────────────────────────────────
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = urlInput.value.trim();
    if (val) window.blinkr.navigateTo(val);
    urlInput.blur();
  }
  if (e.key === 'Escape') {
    urlInput.blur();
  }
});

// Select all on focus
urlInput.addEventListener('focus', () => urlInput.select());

export { setDefaultFavicon, updateSecurityIcon, setFavicon };