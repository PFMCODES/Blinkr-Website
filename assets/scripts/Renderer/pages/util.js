/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { DEFAULT_FAVICON } from "../components/elements.js";

export function getFavicon(targetUrl) {
    try {
        // Blinkr internal pages
        if (targetUrl.startsWith("blinkr://")) {
            const page = targetUrl.replace("blinkr://", "").split("/")[0];
            const s = localStorage.getItem("blinkr-theme") === "dark" ? "-dark" : "";

            const internalIcons = {
                new: "../../assets/images/new-page-favicon.svg",
                settings: "../../assets/images/settings-favicon.svg",
                history: "../../assets/images/history-favicon.svg",
                bookmarks: "../../assets/images/bookmarks-favicon.svg",
                downloads: "../../assets/images/downloads-favicon.svg",
                mambo: "../../assets/images/sigma-mambo.png",
                gugugaga: "../../assets/images/gugugaga.png"
            };

            return internalIcons[page] ??
                `../../assets/images/default-favicon${s}.svg`;
        }

        // Normal websites
        const urlObj = new URL(
            targetUrl.startsWith("http")
                ? targetUrl
                : "https://" + targetUrl
        );

        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
        return DEFAULT_FAVICON();
    }
}

export function limitString(str, maxLength) {
  // Check if the string actually exceeds the maximum length allowed
  if (str.length > maxLength) {
    // Cut the string short to leave room for the 3-dot ellipsis
    return str.slice(0, maxLength - 3) + "...";
  }
  // Return the original string untouched if it is within limits
  return str;
}

export function capitalize(str) {
    str = str.trim()
    str = str.split("");
    str[0] = str[0].toUpperCase();
    str = str.join();
    str = str.replaceAll(",", "")
    return str;
}

export function toTime(ts) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return formatter.format(new Date(ts));
}

export function timeAgo(ts) {
    const date = new Date(ts);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);

        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
}

export function addCloseAni(el) {
    el.close = () => {
        el.classList.add("close-ani");

        el.addEventListener("animationend", () => {
            el.style.display = "none"
        });
    }
}