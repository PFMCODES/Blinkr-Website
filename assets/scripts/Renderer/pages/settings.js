/* ---------------------------------------------------------------------------------------------
 * Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
 * Licensed under the MIT License. See License(File) in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

const br = window.blinkr;

// ── Search Engine ─────────────────────────────────────────────
function renderSearchEngine(container) {
    const engines = [
        { name: "Google", url: "https://www.google.com/search?q=" },
        { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
        { name: "Bing", url: "https://www.bing.com/search?q=" },
        { name: "Brave", url: "https://search.brave.com/search?q=" },
        { name: "Ecosia", url: "https://www.ecosia.org/search?q=" },
    ];

    const current = localStorage.getItem("blinkr-search-engine") || "Google";
    
    if (container) {
        container.innerHTML = engines.map(e => `
            <label class="engine-option ${e.name === current ? "active" : ""}">
                <input type="radio" name="search-engine" value="${e.name}" 
                       ${e.name === current ? "checked" : ""}>
                <div class="engine-info">
                    <span class="engine-name">${e.name}</span>
                    <span class="engine-url bk-text-muted">${e.url}</span>
                </div>
                <div class="radio-indicator"></div>
            </label>
        `).join("");

        container.querySelectorAll('input[name="search-engine"]').forEach(radio => {
            radio.addEventListener("change", (e) => {
                localStorage.setItem("blinkr-search-engine", e.target.value);
                container.querySelectorAll(".engine-option").forEach(opt => opt.classList.remove("active"));
                const p = e.target.closest(".engine-option")
                p.classList.add("active");
                window.blinkr.changeSearchEngine(p.querySelector("input").value.trim())
            });
        });
    }
}
if ( document.documentElement.dataset["page"] == "Search") {
    renderSearchEngine(
        document.getElementById("settings-content")
    );
} else if (document.documentElement.dataset["page"] == "History") {
    renderHistory(document.getElementById("settings-content"))
}

// Called by index.html to initialize a section when shown
window.renderSection = function(sectionName) {
    if (sectionName == "About") window.location.href = "../version.html";
    else window.location.href = "./" + sectionName + ".html"
};

// ── Downloads ───────────────────────────────────────────────

function renderDownloads(container) {
    const askDownload = localStorage.getItem("blinkr-ask-download") === "true";
    const pathEl = document.getElementById("download-path-text");
    const askCheckbox = document.getElementById("ask-download-location");
    
    if (pathEl) {
        pathEl.textContent = localStorage.getItem("blinkr-download-path") || "Default (Downloads folder)";
    }
    
    if (askCheckbox) {
        askCheckbox.checked = askDownload;
    }

    if (askCheckbox) {
        askCheckbox.addEventListener("change", (e) => {
            localStorage.setItem("blinkr-ask-download", e.target.checked);
        });
    }

    const changePathBtn = document.getElementById("change-download-path");
    if (changePathBtn) {
        changePathBtn.addEventListener("click", async () => {
            const path = await br.getDownloadPath?.();
            if (path) {
                localStorage.setItem("blinkr-download-path", path);
                if (pathEl) pathEl.textContent = path;
            }
        });
    }
}

// ── History ───────────────────────────────────────────────────

function renderHistory(container) {
    container.innerHTML = `
        <div class="settings-section">
            <h2 class="bk-heading-xl" style="margin-bottom: 24px;">History</h2>
            
            <div class="setting-card danger-zone">
                <div class="setting-header">
                    <h3 class="bk-heading-large">Clear Browsing Data</h3>
                    <p class="bk-text-muted">Remove all browsing history from this device</p>
                </div>
                <div class="setting-body">
                    <button class="bk-btn bk-btn-danger" id="clear-history-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                        Clear History
                    </button>
                </div>
            </div>

            <div class="setting-card danger-zone">
                <div class="setting-header">
                    <h3 class="bk-heading-large">View All History</h3>
                    <p class="bk-text-muted">See all of the saved history</p>
                </div>
                <div class="setting-body">
                    <button class="bk-btn bk-btn-primary" onclick="location.href='../history.html'">
                        See History
                    </button>
                </div>
            </div>
        </div>
    `;

    container.querySelector("#clear-history-btn").addEventListener("click", async () => {
        if (confirm("Are you sure you want to clear all browsing history? This cannot be undone.")) {
            await br.clearHistory();
            showToast("History cleared successfully");
        }
    });

    const clearBtn = container.querySelector("#clear-history-button")

    clearBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to clear all browsing history? This cannot be undone.")) {
            await br.clearHistory();
            showToast("History cleared successfully");
        }
    });
}

// ── Bookmarks ─────────────────────────────────────────────────

function renderBookmarks(container) {
    const showBar = localStorage.getItem("blinkr-bookmarks-bar") !== "false";
    const checkbox = document.getElementById("show-bookmarks-bar");
    
    if (checkbox) {
        checkbox.checked = showBar;
        checkbox.addEventListener("change", (e) => {
            localStorage.setItem("blinkr-bookmarks-bar", e.target.checked);
        });
    }
}

// ── Privacy & Security ──────────────────────────────────────

function renderPrivacy(container) {
    const blockTrackers = localStorage.getItem("blinkr-block-trackers") === "true";
    const clearCookies = localStorage.getItem("blinkr-clear-cookies") === "true";
    
    const blockCheckbox = document.getElementById("block-trackers");
    const cookiesCheckbox = document.getElementById("clear-cookies-exit");
    
    if (blockCheckbox) {
        blockCheckbox.checked = blockTrackers;
        blockCheckbox.addEventListener("change", (e) => {
            localStorage.setItem("blinkr-block-trackers", e.target.checked);
        });
    }
    
    if (cookiesCheckbox) {
        cookiesCheckbox.checked = clearCookies;
        cookiesCheckbox.addEventListener("change", (e) => {
            localStorage.setItem("blinkr-clear-cookies", e.target.checked);
        });
    }
}

// ── About ───────────────────────────────────────────────────

async function renderAbout(container) {
    window.location.href = "../version.html";
}

// ── Toast Notification ────────────────────────────────────────

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "bk-toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-lg);
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ── Accent Color ──────────────────────────────────────────────

function applyAccentColor(accent) {
    if (accent) {
        localStorage.setItem("blinkr-accent", accent);
    } else {
        accent = localStorage.getItem("blinkr-accent") || "purple";
    }
    document.body.dataset.accent = accent;
    if (window.blinkr && window.blinkr.applyAccent) {
        window.blinkr.applyAccent(accent);
    }
}

// Initialize accent color on load
applyAccentColor();

// ── Export ───────────────────────────────────────────────────


