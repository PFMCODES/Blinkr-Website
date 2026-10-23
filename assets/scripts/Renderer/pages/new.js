/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { getFavicon } from "./util.js";
import "../components/search.js"

function updateClock() {
    const now = new Date();
    const dateOnly = new Intl.DateTimeFormat('en-IN', { dateStyle: 'short' }).format(now);
    const timeOnly = new Intl.DateTimeFormat('en-IN', { timeStyle: 'short' }).format(now);
    document.querySelector(".clock").innerHTML = `<p>${dateOnly}</p><p>${timeOnly}</p>`;
}
updateClock();
setInterval(updateClock, 1000);

const moreBtn = document.getElementById("more");
const pagesMenu = document.querySelector(".pages");

moreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pagesMenu.classList.toggle("k-hidden");
});

// Safe dismissal context wrapper closing the menu when clicking anywhere else
document.addEventListener("click", (e) => {
    if (!pagesMenu.classList.contains("k-hidden") && !pagesMenu.contains(e.target)) {
        pagesMenu.classList.add("k-hidden");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("shortcutsContainer");
    let draggedElement = null;

    container.addEventListener("dragstart", (e) => {
        draggedElement = e.target.closest(".shortcut-item");
        if (draggedElement) {
            // Set smooth trailing drag effect
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => draggedElement.classList.add("opacity-30", "scale-90"), 0);
        }
    });

    container.addEventListener("dragend", () => {
        if (draggedElement) {
            draggedElement.classList.remove("opacity-30", "scale-90");
            draggedElement = null;
        }
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault(); 
        if (!draggedElement) return;

        // Find valid matching sibling targets horizontally
        const siblings = [...container.querySelectorAll(".shortcut-item:not(.opacity-30)")];
        
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const boxCenter = box.left + box.width / 2; 
            return e.clientX < boxCenter;
        });

        if (nextSibling) {
            container.insertBefore(draggedElement, nextSibling);
        } else {
            container.appendChild(draggedElement);
        }
    });
});

const shortcutBtn = document.getElementById("add-shortcut");
const container = document.getElementById("shortcutsContainer");

// UNIFIED INITIALIZATION (Consolidated to run safely exactly once)
document.addEventListener("DOMContentLoaded", async () => {
    // Clear hardcoded placeholder elements cleanly
    container.innerHTML = "";
    
    try {
        const savedShortcuts = await window.blinkr.getShortcuts();
        console.log(savedShortcuts.shortcuts);
        if (Array.isArray(savedShortcuts.shortcuts)) {
            savedShortcuts.shortcuts.forEach(async shortcut => {
                // Pass loose parameters exactly as the factory expects them
                await renderShortcutDOM(shortcut.id, shortcut.name, shortcut.url);
            });
        }
    } catch (err) {
        console.error("Failed fetching bookmarks shortcuts database:", err);
    }
});

// Custom Prompt System Modal Window Logic
function prompt(title, fields) {
    return new Promise((resolve) => {
        let result;
        const promptOverlay = document.createElement("div");
        promptOverlay.className = "fixed inset-0 bg-black/50 z-[60] flex items-center justify-center";

        const promptBox = document.createElement("div");
        promptBox.className = "bk-card p-6 rounded-lg shadow-xl flex flex-col gap-4 min-w-[320px] w-[50%] bg-zinc-900 border border-zinc-800 text-white";
        
        const Header = document.createElement("h1");
        Header.className = "bk-heading-lg";
        Header.innerHTML = title;
        promptBox.append(Header);

        const inputFields = [];
        const answers = [];

        Object.keys(fields).forEach((msg) => {
            const fieldGroup = document.createElement("div");
            fieldGroup.className = "gap-1 w-full";

            const promptLabel = document.createElement("div");
            promptLabel.className = "text-m font-medium text-gray-300 mb-1";
            promptLabel.textContent = msg;

            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.value = fields[msg];
            inputField.className = "bk-input w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white mb-2";
            
            fieldGroup.appendChild(promptLabel);
            fieldGroup.appendChild(inputField);
            promptBox.appendChild(fieldGroup);
            inputFields.push(inputField);
        });

        // Inside your prompt() function factory...
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.className = "bk-btn bk-btn-primary bg-blue-600 text-white p-2 mt-2 rounded hover:bg-blue-700 transition-colors w-[100px] cursor-pointer ml-auto";

        submitButton.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // FRONTEND GUARD: Instantly disable the button UI elements to halt double clicks
            submitButton.disabled = true;
            submitButton.style.opacity = "0.5";
            submitButton.style.cursor = "not-allowed";
            submitButton.textContent = "Saving...";

            // Collect field array variables natively
            inputFields.forEach(input => answers.push(input.value.trim()));
            
            // Resolve the promise payload back to the main trigger routine execution scope
            resolve(answers);

            // Timeout delay handling logic before tearing down the overlay nodes 
            setTimeout(() => {
                promptOverlay.remove();
            }, 150); // Small visual grace window allowing thread context tasks to wrap up
        };

        promptOverlay.onclick = (e) => {
            if (e.target === promptOverlay) {
                resolve(null);
                promptOverlay.remove();
            }
        };

        promptBox.appendChild(submitButton);
        promptOverlay.appendChild(promptBox);
        document.body.appendChild(promptOverlay);

        if (inputFields.length > 0) inputFields[0].focus();
    });
}

// Trigger Creation Dialog Modal
shortcutBtn.addEventListener("click", async () => {
    const result = await prompt("Add New Shortcut", { "Name": "", "URL": "" });
    if (result) {
        const [name, url] = result;
        if (name && url) {
            const id = "sc_" + Date.now(); 
            const finalUrl = url;

            // 1. Commit to filesystem storage backend database
            await window.blinkr.setShortcut({ id, name, url: finalUrl });
            
            // 2. Reflect on DOM instantly
            await renderShortcutDOM(id, name, finalUrl);
        }
    }
});

// Unified DOM Factory Pipeline Module Handler
async function renderShortcutDOM(id, name, url) {
    const iconUrl = getFavicon(url) || '../../assets/images/default-favicon.svg';
    
    const newShortcut = document.createElement("a");
    newShortcut.id = id;
    newShortcut.style.width = "112px";
    newShortcut.style.height = "112px";
    newShortcut.className = "bk-list-item group/item flex flex-col items-center justify-center rounded-xl relative transition-all duration-200 cursor-pointer";
    newShortcut.setAttribute("draggable", "true");
    newShortcut.href = url;
    
    // Base structure wrapping elements natively
    newShortcut.innerHTML = `
        <div class="overlay absolute top-1 right-1 !mr-[10px] h-[28px] w-[44px] flex opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
            <button class="edit-sc-btn p-1 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors" title="Edit Shortcut" style="padding-right: 6px; padding-left: 6px">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
            </button>
            <button class="delete-sc-btn flex items-center justify-center rounded-full text-zinc-400" style="padding-right: 6px; padding-left: 6px;" title="Delete Shortcut">
                <svg class="pointer-events-none wc-color" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--close-hover)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            </button>
        </div>
        <div class="shortcut-click-zone flex flex-col items-center w-full h-full justify-center pointer-events-auto">
            <div class="bk-icon favicon" style="width: 48px; height: 48px; max-width: 48px; max-height: 48px; padding: 12px; margin: 0; display: flex; align-items: center; justify-content: center; border-radius: 100%; background-color: var(--btn-hover);">
                <img id="icon" src="${iconUrl}" style="width: 24px; height: 24px;" onerror="this.src='../../assets/images/default-favicon.svg'">
            </div>
            <div class="bk-heading-sm mt-2 text-zinc-300 text-xs font-medium text-center truncate w-full max-w-[90px]" id="title">
                ${name}
            </div>
        </div>
    `;

    // Safe Intercept Delete Action Dispatcher
    newShortcut.querySelector(".delete-sc-btn").addEventListener("click", async (e) => {
        e.stopPropagation(); 
        e.preventDefault();
        const confirmed = await window.blinkr.removeShortcut(id);
            newShortcut.remove();
    });
    newShortcut.querySelector(".edit-sc-btn").addEventListener("click", async (e) => {
        e.stopPropagation(); 
        e.preventDefault();
        const result = await prompt("Edit Shortcut", { "Name": name, "URL": url });
        const [ n, u ] = result;
        const confirmed = await window.blinkr.editShortcut(id, n, u );
        console.log(confirmed)
        if (!confirmed) { alert("failed to edit shortcut, try again later"); return; };
        const icon = newShortcut.querySelector("#icon");
        const title = newShortcut.querySelector("#title");
        console.log({n, u});
        icon.src = getFavicon(u);
        title.textContent = n;
        newShortcut.href = u;
        name = n;
        url = u;
        console.log(newShortcut.href);
    });

    window.blinkr.setShortcut({ id, name, url }); // Ensure persistence in storage backend

    container.appendChild(newShortcut);
    const savedShortcuts = await window.blinkr.getShortcuts();
    console.log("Current Shortcuts in Storage:", savedShortcuts);
}

const searchbar = document.querySelector(".bk-search.bk-m-auto.bk-w-full");

// addInput(searchbar.getElementsByTagName("input"))