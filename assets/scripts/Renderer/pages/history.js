/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { getFavicon, limitString, timeAgo, toTime } from "./util.js";
import { validateURL } from "../components/search.js"

const br = window.blinkr;

let allHistory = [];
let currentFilter = '';

function renderHistory(items) {
    const historyListEl = document.querySelector("#history-list");
    const emptyDescEl = document.querySelector(".bk-empty");

    historyListEl.innerHTML = '';

    if (!items || items.length === 0) {
        emptyDescEl.style.display = "flex";
        historyListEl.style.display = "none";
        return;
    }

    emptyDescEl.style.display = "none";
    historyListEl.style.display = "block";

    items.forEach((item, id) => {
        const validatedUrl = validateURL(item.url);
        const host = new URL(validatedUrl).hostname;
        const icon = getFavicon(validatedUrl);
        const s = localStorage.getItem("blinkr-theme") === "dark" ? "-dark" : "";

        historyListEl.insertAdjacentHTML("beforeend", `
            <div class="history-item bk-list-item bk-btn-sm bk-flex" 
                 style="display: flex; align-items: center; justify-content: space-between; flex-direction: row; height: fit-content; padding: 10px 20px; cursor: pointer;" 
                 data-id="${id}" id="hi_${id}">
                <a title="${toTime(item.timestamp)} or ${timeAgo(item.timestamp)}" href="${validatedUrl}">
                    <div style="display: flex; flex-direction: row; gap: 8px; align-items: center;">
                        <img src="${icon ? icon : `../../assets/images/default-favicon${s}.svg`}" 
                             onerror="this.src = '../../assets/images/default-favicon${s}.svg'" 
                             alt="favicon" class="bk-favicon">
                        <div style="width: fit-content; gap: 4px;">
                            <div class="bk-heading-large">${host}</div>
                            <div class="bk-text-muted">${limitString(validatedUrl, 60)}</div>
                        </div>
                    </div>
                </a>
                <button class="bk-btn bk-btn-sm bk-btn-danger remove-history-btn" 
                        style="width: fit-content; border: none; border-radius: 50px; height: 40px" 
                        data-id="${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" color="var(--close-hover)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--close-hover)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        `);
    });

    // Attach remove handlers
    document.querySelectorAll('.remove-history-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            await br.removeHistoryItem(id);
            
            // Remove from local data and re-render
            allHistory.splice(id, 1);
            filterAndRender(currentFilter);
        });
    });
    document.getElementById("search-count").textContent = items.length + " Results Found";
}

function filterAndRender(query) {
    currentFilter = query.toLowerCase().trim();
    
    const filtered = currentFilter 
        ? allHistory.filter(item => {
            const url = validateURL(item.url).toLowerCase();
            const host = new URL(validateURL(item.url)).hostname.toLowerCase();
            return url.includes(currentFilter) || host.includes(currentFilter);
          })
        : [...allHistory];
    
    renderHistory(filtered);
}

function createSearchBar() {
    const container = document.querySelector('.content');
    const existingSearch = document.getElementById('history-search-wrapper');
    if (existingSearch) return; // Already injected

    document.body.style.paddingTop = '0px'; // Remove any top padding to accommodate sticky search bar

    const searchHTML = `
        <div id="history-search-wrapper" style="
            position: sticky;
            top: 0;
            z-index: 10000000000000000000;
            padding: 16px 20px;
            background: var(--bg-navbar);
            display: flex;
            gap: 10px;
            align-items: center;
        ">
            <div style="
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
            ">
                <svg style="
                    position: absolute;
                    left: 12px;
                    width: 16px;
                    height: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>
                <input 
                    type="text" 
                    id="history-search" 
                    placeholder="Search history..." 
                    style="
                        width: 100%;
                        height: 40px;
                        padding: 0 36px 0 36px;
                        border-radius: var(--radius-lg, 12px);
                        border: 1px solid var(--border);
                        background: var(--bg-address);
                        color: var(--text-primary);
                        font-size: 14px;
                        outline: none;
                        transition: border-color 0.2s, background 0.2s;
                    "
                >
                <button id="clear-search" style="
                    position: absolute;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <button id="clear-all-history" class="bk-btn bk-btn-sm" style="
                height: 40px;
                padding: 0 16px;
                border-radius: var(--radius-lg, 12px);
                border: 1px solid var(--border);
                background: var(--bg-address);
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 13px;
                white-space: nowrap;
                transition: background 0.2s, color 0.2s;
            ">
                Clear All
            </button>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', searchHTML);

    const searchInput = document.getElementById('history-search');
    const clearBtn = document.getElementById('clear-search');
    const clearAllBtn = document.getElementById('clear-all-history');

    // Live filter on input
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        clearBtn.style.display = val ? 'flex' : 'none';
        filterAndRender(val);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterAndRender('');
        searchInput.focus();
    });

    // Enter to navigate to first result
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstItem = document.querySelector('.history-item a');
            if (firstItem) {
                window.location.href = firstItem.getAttribute('href');
            }
        }
    });

    // Focus styles
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'var(--accent)';
        searchInput.style.background = 'var(--bg-address-focus)';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'var(--border)';
        searchInput.style.background = 'var(--bg-address)';
    });

    // Clear all history
    clearAllBtn.addEventListener('click', async () => {
        await br.clearHistory();
        allHistory = [];
        filterAndRender('');
    });

    // Hover effects for clear all
    clearAllBtn.addEventListener('mouseenter', () => {
        clearAllBtn.style.background = 'var(--btn-hover)';
        clearAllBtn.style.color = 'var(--accent)';
    });
    clearAllBtn.addEventListener('mouseleave', () => {
        clearAllBtn.style.background = 'var(--bg-address)';
        clearAllBtn.style.color = 'var(--text-secondary)';
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    allHistory = await br.getHistory() || [];
    console.log({ history: allHistory });

    createSearchBar();
    filterAndRender('');
});