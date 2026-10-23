/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

import { downloads } from "../components/elements.js";
import { setHeight } from "../components/windowControls.js";
import { addCloseAni } from "../pages/util.js"
const container = document.querySelector("div.rest div.downloads.bk-list")
addCloseAni(container)
const icon = downloads.querySelector('svg');


document.getElementById("download-close-btn").addEventListener('click', () => {
    container.close()
    setHeight(96)
});

let numberOfDownloads = 0;

window.blinkr.newDownload((d) => {
    console.log("from new download, ", numberOfDownloads, d)
    container.style.display = "flex";
    numberOfDownloads++
    downloads.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 21" fill="none">
<style>
@keyframes kf_Group_1_transform_0 {
  0% {
    transform: translateX(7px) translateY(3px) translateX(0px) translateY(0px);
  }
  52.06% {
    transform: translateX(7px) translateY(3px) translateX(0.098px) translateY(21.009px);
  }
  52.9% {
    transform: translateX(7px) translateY(3px) translateX(50.705px) translateY(19.768px);
  }
  53.2% {
    transform: translateX(7px) translateY(3px) translateX(50.705px) translateY(3.133px);
  }
  53.7% {
    transform: translateX(7px) translateY(3px) translateX(-0.151px) translateY(-19.461px);
  }
  100% {
    transform: translateX(7px) translateY(2px) translateX(0px) translateY(0px);
  }
}
#Group_1 {
  transform-origin: 0 0;
  animation: kf_Group_1_transform_0 1s linear infinite;
}
@keyframes kf_Vector_2_stroke_0 {
  0% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    stroke: currentColor;
  }
  100% {
    stroke: currentColor;
  }
}
#Vector_2 {
  animation: kf_Vector_2_stroke_0 1s linear infinite;
}
@keyframes kf_Vector_3_stroke_0 {
  0% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    stroke: currentColor;
  }
  100% {
    stroke: currentColor;
  }
}
#Vector_3 {
  animation: kf_Vector_3_stroke_0 1s linear infinite;
}
</style>
<g id="downloading-animation" clip-path="url(#clip0_52_49)">
<animate attributeName="height" values="23; 23" keyTimes="0; 1" dur="1s" calcMode="linear" repeatCount="indefinite"/>
<g id="Group_2" transform="translate(3 15)">
<path id="Vector" d="M18 0V4C18 4.53043 17.7893 5.03914 17.4142 5.41421C17.0391 5.78929 16.5304 6 16 6H2C1.46957 6 0.960859 5.78929 0.585786 5.41421C0.210714 5.03914 0 4.53043 0 4V0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g id="Group_1" transform="translate(7 3)">
<path id="Vector_2" transform="translate(5)" d="M0 12V0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Vector_3" transform="translate(0 7)" d="M0 0L5 5L10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
<defs>
<clipPath id="clip0_52_49">
<rect width="24" height="22" fill="currentColor"/>
</clipPath>
</defs>
</svg>`
    downloads.title = "click to view Download(s)";
    const id = renderDownload(d)
    const item = container.querySelector(`#download-${id}`);
    setHeight((numberOfDownloads * 68) + 64);

});

window.blinkr.onDownloadProgress(({ id, progress }) => {
    console.log(id, progress);
    const progressbar = document.querySelector(`#progress-${id}`);
    progressbar.querySelector(".progress-fill").style.width = `${progress}%`;
    progressbar.title = `${progress}%`
});

window.blinkr.onDownloaded((id) => {
    downloads.innerHTML = "";
    downloads.appendChild(icon);
    document.getElementById(`progress-${id}`).remove();
    document.getElementById(`show-on-complete-${id}`).style.display = "flex";
    document.getElementById(`hide-on-complete-${id}`).style.display = "none";
    const item = container.querySelector(`#download-${id}`);
    const icon = downloads.querySelector('svg');
    
    setTimeout(() => {
        downloads.title = '';
        item.remove();
        container.style.display = "none";
        setHeight(0);
    }, 5000)
});

function renderDownload(downloadObject) {
    const { name, url, icon, id, filepath } = downloadObject;
    console.log(downloadObject)
    container.insertAdjacentHTML("beforeEnd", `<div class="bk-list-item" id="download-${id}">
        <div class="left">
            <div>
                <p class="file-name">
                ${icon}
                ${name}
                </p>
            </div>
            <div id="hide-on-complete-${id}" style="display: flex;" title="cancel">
                <button class="bk-btn bk-btn-secondary bk-btn-icon" id="cancel-download-${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                </button>
            </div>
            <div id="show-on-complete-${id}" style="display: none;">
                <button class="bk-btn bk-btn-secondary bk-btn-icon" title="show in folder" id="show-in-folder-downloaded-file-${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-output-icon lucide-folder-output"><path d="M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5"/><path d="M2 13h10"/><path d="m5 10-3 3 3 3"/></svg>
                </button>
                <button class="bk-btn bk-btn-secondary bk-btn-icon" title="open file" id="open-downloaded-file-${id}">
                    <svg width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5374 13.7813C10.5373 13.5467 10.6011 13.3163 10.7222 13.1132C10.8434 12.9102 11.0176 12.7417 11.2274 12.6248C11.4372 12.508 11.675 12.4469 11.917 12.4477C12.1589 12.4485 12.3963 12.5111 12.6052 12.6294L20.8525 17.2944C21.0607 17.4115 21.2335 17.5795 21.3536 17.7817C21.4738 17.9839 21.5372 18.2131 21.5374 18.4464C21.5376 18.6798 21.4746 18.9091 21.3548 19.1114C21.235 19.3138 21.0625 19.4821 20.8546 19.5996L12.6052 24.2659C12.3963 24.3842 12.1589 24.4469 11.917 24.4477C11.675 24.4484 11.4372 24.3873 11.2274 24.2705C11.0176 24.1536 10.8434 23.9852 10.7222 23.7821C10.6011 23.5791 10.5373 23.3486 10.5374 23.114V13.7813Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.0127 0.000976562C11.4553 0.00210081 11.8948 0.0885763 12.3057 0.258789L12.459 0.327148C12.8124 0.494586 13.1346 0.721791 13.4111 0.999023L16.998 4.58594L17.0137 4.60254L17.207 4.81445L17.2236 4.83301C17.4374 5.09232 17.6114 5.3829 17.7402 5.69336C17.912 6.10735 18.0005 6.55135 18 7V15.6621L16 14.5303V8H12C11.4694 8 10.9609 7.78904 10.5859 7.41406C10.211 7.03909 10 6.53057 10 6V2H3C2.73493 2 2.4806 2.10534 2.29297 2.29297C2.10535 2.48059 2.00001 2.73492 2 3V19C2 19.2651 2.10534 19.5194 2.29297 19.707C2.4806 19.8947 2.73492 20 3 20H10.4941V22H3C2.20421 22 1.44142 21.6836 0.878906 21.1211C0.316405 20.5586 0 19.7958 0 19V3C7.05196e-06 2.20423 0.316397 1.44142 0.878906 0.878906C1.44141 0.316405 2.20422 0 3 0H11C11.0043 0 11.0085 0.000871079 11.0127 0.000976562ZM16.915 6.37793C16.9524 6.52568 16.9218 6.68238 16.8291 6.80371C16.7345 6.9274 16.5874 7 16.4316 7H16.5C16.7761 7 17 7.22386 17 7.5V6.99902C17.0003 6.78864 16.9692 6.58048 16.915 6.37793ZM12 6H15.584L12 2.41602V6ZM10.5 1C10.7761 1 11 1.22386 11 1.5V1.56738C11 1.41176 11.0727 1.26453 11.1963 1.16992C11.3168 1.07784 11.4723 1.04687 11.6191 1.08301C11.4181 1.03 11.2107 1.00072 11.001 1.00098C10.9978 1.00098 10.9944 1.00006 10.9912 1H10.5Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="right">
            <div class="progress-track" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" id="progress-${id}">
                <div class="progress-fill" style="width: 0%;"></div>
            </div>
        </div>
    </div>`);
    const him = document.getElementById(`download-${id}`)
    document.getElementById(`cancel-download-${id}`).addEventListener("click", async () => {
        const ok = await window.blinkr.removeDownload(id)
        if (ok) {
            him.remove();
            numberOfDownloads--;
            if (numberOfDownloads === 0) {
                document.querySelector(".rest .downloads.bk-list").style.display = "none";
            }
        }
    });
    him.addEventListener("click", async () => await window.blinkr.navigateTo("blinkr://downloads"));
    document.getElementById(`open-downloaded-file-${id}`).addEventListener("click", async () => await window.blinkr.openFile(filepath));
    document.getElementById(`show-in-folder-downloaded-file-${id}`).addEventListener("click", async () => await window.blinkr.showItemInFolder(filepath));

    return id;
}