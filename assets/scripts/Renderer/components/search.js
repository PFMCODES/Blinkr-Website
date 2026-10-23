/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const searchEngines = {
    "Google": "www.google.com/search",
    "DuckDuckGo": "www.duckduckgo.com/?q=",
    "Bing": "www.bing.com/search?q=",
    "Brave": "search.brave.com/search?q=",
    "Ecosia": "www.ecosia.com/search?q="
}

const input = document.querySelector("input#input");

addInput(input);

function addInput(input) {
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                search(input.value.trim());
            }
        });
    }
}

function search(value) {
    const url = validateURL(value);
    window.location.href = url;
}

export function validateURL(url) {
    let result = String(url).trim();

    if (!result) return "";

    // Already a valid Blinkr URL
    if (result.startsWith("blinkr://")) {
      result = url.replace(/[/\\]+$/, "");
      return result;
    }

    // Convert Blinkr page file path -> blinkr:// URI
    const match = result.match(/[/\\]blinkr-pages[/\\](.+?)\.html$/i);

    if (match) {
        return "blinkr://" + match[1].replace(/\\/g, "/");
    }

    // Already has a protocol
    if (
        result.startsWith("http://") ||
        result.startsWith("https://") ||
        result.startsWith("file://")
    ) {
        return result;
    }

    // Looks like a domain/IP/localhost
    if (
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/.test(result) ||
        /^localhost(?::\d+)?(?:\/.*)?$/i.test(result) ||
        /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/.*)?$/.test(result)
    ) {
        return "http://" + result;
    }

    // Search query
    return `https://${searchEngines[localStorage.getItem("blinkr-search-engine") || "Google"]}` + encodeURIComponent(result);
}

export function isValidUrl(input) {
  if (!input || typeof input !== 'string') return false;

  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'file:' || url.protocol === 'blinkr:';
  } catch {
    return false;
  }
}