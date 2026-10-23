/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

setInterval(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
}, 500);