/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { newTabBtn } from "./elements.js";

newTabBtn.addEventListener("click", async () => {
    const url = await window.blinkr.getUrl();
    console.log(url);
    await window.blinkr.createTab(url);
    // Optionally, you can switch to the new tab immediately after creating it
    // window.blinkr.switchTab(newTabId);
});