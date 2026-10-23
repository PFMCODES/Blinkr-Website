/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { validateURL } from "../components/search.js";
import { capitalize, getFavicon, limitString, timeAgo, toTime } from "./util.js";

const container = document.querySelector("#container");
const LM = document.getElementById("last-modified");

document.addEventListener("DOMContentLoaded", async () => {
    const bookmarks = await window.blinkr.getBookmarks();
    console.log(bookmarks)

    bookmarks.forEach(b => {
        LM.innerText = "last Updated " + timeAgo(bookmarks[0].timestamp);
        const Url = new URL(b.url)
        const icon = getFavicon(validateURL(b.url));
        container.insertAdjacentHTML('afterbegin', `<div class="bk-card bk-grid-3 bk-grid bk-hover" data-bk-hover="none" id="bk-bookmark-${CSS.escape(b.timestamp)}" title="${toTime(b.timestamp)} or ${timeAgo(b.timestamp)}">
            <div class="bk-card-image">
                <img  src="${icon ? icon : `../../assets/images/default-favicon${localStorage.getItem("blinkr-theme") === "dark" ? "-dark" : "" }`}" alt="favicon" class="bk-favicon bk-icon">
            </div>
            <span>
                <div class="text-4xl w-[300px]">${Url.host === "" ? validateURL(b.url).startsWith("blinkr://") ? capitalize(validateURL(b.url).replace("blinkr://", "")) + " Page" : "Unknown" : Url.host }</div>
                <div class="bk-section-title">${limitString(validateURL(b.url), 60)}</div>
            </span>
            <span class="bk-flex bk-gap-0">
                <button class="bk-btn bk-btn-sm bk-hover" id="open-${CSS.escape(b.timestamp)}" data-bk-hover="pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </button>
                <button class="bk-btn bk-btn-sm" id="copy-${CSS.escape(b.timestamp)}" data-bk-hover="pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
                <button class="bk-btn bk-btn-sm" id="remove-${CSS.escape(b.timestamp)}" data-bk-hover="pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </span>
        </div>`);
        console.log(window.blinkr)
        const open = () => {
            try {
                window.blinkr.navigateTo(validateURL(b.url));
            } catch (err) {
                throw new Error(err);
            }
        }
        const copy = () => {
            try {
                const c = new Clipboard();
                c.writeText(validateURL(b.url))
           } catch (err) {
                throw new Error(err);
           }
        };
        const remove = async () => {
            console.log("remove triggered of ", validateURL(b.url))
            try {
                const isBookMarkedRemoved = await window.blinkr.removeBookmark(b.timestamp)
                console.log(isBookMarkedRemoved)
                if (isBookMarkedRemoved) {
                    document.getElementById(`bk-bookmark-${CSS.escape(b.timestamp)}`).remove()
                }
            } catch (err) {
                throw new Error(err);
            }
        }
        document.getElementById(`open-${CSS.escape(b.timestamp)}`).addEventListener("click", open);
        document.getElementById(`copy-${CSS.escape(b.timestamp)}`).addEventListener("click", copy);
        document.getElementById(`copy-${CSS.escape(b.timestamp)}`).addEventListener("click", remove);
    });
})