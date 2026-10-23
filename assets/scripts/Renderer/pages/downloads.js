/* ---------------------------------------------------------------------------------------------
 * Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
 * Licensed under the MIT License. See License(File) in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

const container = document.getElementById("container");
const emptyState = document.querySelector(".bk-empty");
let downloads = [];

// ── Icons ─────────────────────────────────────────────────────

const ICONS = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
    completed: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    cancelled: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5"/><path d="M2 13h10"/><path d="m5 10-3 3 3 3"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`
};

// ── Helpers ───────────────────────────────────────────────────

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatSpeed(bytesPerSecond) {
    if (!bytesPerSecond) return "";
    return formatBytes(bytesPerSecond) + "/s";
}

function getStateIcon(state) {
    if (state === "completed") return `<span style="display: flex; flex-direction: row; align-item: center; gap: 5px" class="dl-status completed">${ICONS.completed}</span>`;
    if (state === "cancelled" || state === "interrupted") return `<span class="dl-status cancelled">${ICONS.cancelled} Failed</span>`;
    return "";
}

// ── Render ────────────────────────────────────────────────────

function updateEmptyState() {
    const hasItems = container.querySelectorAll(".bk-card").length > 0;
    emptyState.style.display = hasItems ? "none" : "flex";
    container.style.display = hasItems ? "flex" : "none";
}

function renderDownload(download) {
    console.log(download);
    
    // Hide empty state if this is the first item
    if (container.style.display === "none" || emptyState.style.display !== "none") {
        container.style.display = "flex";
        emptyState.style.display = "none";
    }

    const isDone = download.state === "completed";
    const isFailed = download.state === "cancelled" || download.state === "interrupted";
    const isActive = !isDone && !isFailed;

    const card = document.createElement("div");
    card.className = "bk-card";
    card.style = "display: flex; flex-direction: row; align-item: center"
    card.dataset.downloadId = download.id;
    card.innerHTML = `
        <div style="display: flex; flex-direction: row; align-item: center; justify-content: space-between">
            <div class="bk-icon icon">
                ${download.icon || ICONS.file}
            </div>
            <div>
                <div class="bk-heading-lg" title="${download.name}">${download.name}</div>
            </div>
            <div class="bk-flex bk-items-center bk-gap-8">
                ${isDone ? `
                    <button class="bk-btn bk-btn-icon bk-btn bk-btn-secondary" data-action="open" title="Show in folder">
                        ${ICONS.folder}
                    </button>
                ` : ""}
                ${isActive ? `
                    <button class="bk-btn bk-btn-icon bk-btn bk-btn-secondary" data-action="pause" title="Pause/Resume">
                        ${download.paused ? ICONS.play : ICONS.pause}
                    </button>
                ` : ""}
                <button class="bk-btn bk-btn-icon bk-btn bk-btn-danger" data-action="remove" title="Remove">
                    ${ICONS.trash}
                </button>
            </div>
        </div>
        
        ${isActive ? `
            <div class="dl-progress-wrap">
                <div class="dl-progress-bar">
                    <div class="dl-progress-fill" style="width: ${download.progress || 0}%"></div>
                </div>
                <div class="dl-progress-meta">
                    <span class="dl-percent">${download.progress || 0}%</span>
                    <span class="dl-state">${download.paused ? "Paused" : "Downloading..."}</span>
                </div>
            </div>
        ` : `
            <div class="dl-status-wrap">
                ${getStateIcon(download.state)}
            </div>
        `}
    `;

    container.insertBefore(card, container.firstChild);
}

// ── Event Handlers ────────────────────────────────────────────

container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".bk-btn bk-btn-icon");
    if (!btn) return;

    const card = btn.closest(".bk-card");
    const id = card.dataset.downloadId;
    const action = btn.dataset.action;

    if (action === "pause") {
        const ok = await window.blinkr.pauseDownload(id);
        if (ok) {
            const isPaused = btn.innerHTML.includes("play");
            btn.innerHTML = isPaused ? ICONS.pause : ICONS.play;
            btn.title = isPaused ? "Pause" : "Resume";
            card.querySelector(".dl-state").textContent = isPaused ? "Downloading..." : "Paused";
        }
        return;
    }

    if (action === "remove") {
        const ok = await window.blinkr.removeDownload(id);
        if (ok) {
            card.style.opacity = "0";
            card.style.transform = "translateX(20px)";
            setTimeout(() => {
                card.remove();
                updateEmptyState();
            }, 200);
        }
        return;
    }

    if (action === "open") {
        // Use your existing IPC to open file location
        const dl = downloads.find(d => d.id === id);
        if (dl?.filepath) {
            await window.blinkr.showItemInFolder(dl.filepath);
        }
        return;
    }
});

// ── IPC Listeners ───────────────────────────────────────────

window.blinkr.newDownload((download) => {
    downloads.unshift(download);
    renderDownload(download);
});

window.blinkr.onDownloadProgress(({ id, progress }) => {
    const card = document.querySelector(`[data-download-id="${id}"]`);
    if (!card) return;

    const fill = card.querySelector(".dl-progress-fill");
    const percent = card.querySelector(".dl-percent");
    
    if (fill) fill.style.width = progress + "%";
    if (percent) percent.textContent = progress + "%";
});

window.blinkr.onDownloaded((id) => {
    const card = document.querySelector(`[data-download-id="${id}"]`);
    if (!card) return;

    // Replace progress bar with completed status
    const progressWrap = card.querySelector(".dl-progress-wrap");
    if (progressWrap) {
        progressWrap.outerHTML = `
            <div class="dl-status-wrap">
                ${getStateIcon("completed")}
            </div>
        `;
    }

    // Replace pause button with folder button
    const pauseBtn = card.querySelector(".bk-btn bk-btn-secondary");
    if (pauseBtn) {
        pauseBtn.outerHTML = `
            <button class="bk-btn bk-btn-icon bk-btn bk-btn-secondary" data-action="open" title="Show in folder">
                ${ICONS.folder}
            </button>
        `;
    }

    // Update state text
    const stateText = card.querySelector(".dl-state");
    if (stateText) stateText.textContent = "Completed";
});

// ── Init ────────────────────────────────────────────────────

async function init() {
    downloads = await window.blinkr.getDownloads() || [];
    
    if (downloads.length === 0) {
        container.style.display = "none";
        emptyState.style.display = "flex";
    } else {
        container.style.display = "flex";
        emptyState.style.display = "none";
        downloads.reverse().forEach(renderDownload);
    }
}

init();