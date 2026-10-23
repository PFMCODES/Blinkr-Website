/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

export const urlInput = document.getElementById('urlInput');
export const btnBack = document.getElementById('btnBack');
export const btnForward = document.getElementById('btnForward');
export const btnReload = document.getElementById('btnReload');
export const favicon = document.getElementById('favicon');
export const securityIcon = document.getElementById('securityIcon');
export const btnMinimize = document.getElementById('btnMinimize');
export const btnMaximize = document.getElementById('btnMaximize');
export const btnClose = document.getElementById('btnClose');
export const moreMenu = document.getElementById("menu");
export const appName = document.querySelector(".app-name");
export const settingsBtn = document.getElementById("settingBtn");
export const newTabBtn = document.getElementById("new-tab");
export const user = document.getElementById("user");
export const bookmarks = document.getElementById("bookmarks");
export const bookmark = document.getElementById("bookmark");
export const downloads = document.getElementById("downloads");
export const title = document.getElementById("title")

export const BookMarked = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V20C18.9999 20.1751 18.9539 20.3472 18.8665 20.4989C18.7791 20.6506 18.6533 20.7767 18.5019 20.8646C18.3504 20.9525 18.1785 20.9991 18.0034 20.9997C17.8283 21.0003 17.6561 20.9549 17.504 20.868L12.992 18.29C12.6899 18.1174 12.3479 18.0266 12 18.0266C11.6521 18.0266 11.3101 18.1174 11.008 18.29L6.496 20.868C6.34394 20.9549 6.17174 21.0003 5.99662 20.9997C5.8215 20.9991 5.64961 20.9525 5.49814 20.8646C5.34667 20.7767 5.22094 20.6506 5.13352 20.4989C5.0461 20.3472 5.00006 20.1751 5 20V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17Z" fill="var(--text-primary)"/>
</svg>`

export const NoBookMark = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V20C18.9999 20.1751 18.9539 20.3472 18.8665 20.4989C18.7791 20.6506 18.6533 20.7767 18.5019 20.8646C18.3504 20.9525 18.1785 20.9991 18.0034 20.9997C17.8283 21.0003 17.6561 20.9549 17.504 20.868L12.992 18.29C12.6899 18.1174 12.3479 18.0266 12 18.0266C11.6521 18.0266 11.3101 18.1174 11.008 18.29L6.496 20.868C6.34394 20.9549 6.17174 21.0003 5.99662 20.9997C5.8215 20.9991 5.64961 20.9525 5.49814 20.8646C5.34667 20.7767 5.22094 20.6506 5.13352 20.4989C5.0461 20.3472 5.00006 20.1751 5 20V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17Z" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// Variables

export const DEFAULT_FAVICON = getDefaultFavicon;

// functions

function getDefaultFavicon() {
    return localStorage.getItem("blinkr-theme") === "light" ? '../assets/images/default-favicon.svg' : '../assets/images/default-favicon-dark.svg'
}