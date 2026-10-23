/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const th = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem("blinkr-theme", t);
}
window.br = {};
window.br.th = th;

const themeToggle = document.getElementById('themeToggle');
// ── Theme ──────────────────────────────────────────────────
const savedTheme = localStorage.getItem('blinkr-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

blinkr.themeChange(savedTheme);

if (themeToggle) {
    console.log(themeToggle)
    themeToggle.addEventListener('click', async () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('blinkr-theme', next);
        themeToggle.disabled = true;
        await blinkr.themeChange(next);
        themeToggle.disabled = false;
    });
}
console.log(blinkr.onThemeChange, blinkr.onThemeChanged)
if (blinkr.onThemeChanged) blinkr.onThemeChanged(th)
if (blinkr.onThemeChange) blinkr.onThemeChange(th)