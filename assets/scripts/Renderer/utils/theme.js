setInterval(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
}, 500);