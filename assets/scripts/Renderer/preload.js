/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('blinkr', {   
  // Tabs
  createTab: (url) => ipcRenderer.send('create-tab', url),

  // Navigation
  navigateTo: (url) => ipcRenderer.send('navigate-to', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  stopLoading: () => ipcRenderer.send('stop-loading'),
  // View Switching & window dragging
  setIgnoreMouse: (ignore, options) => ipcRenderer.send('set-ignore-mouse', ignore, options),
  startDrag: () => ipcRenderer.send('window-start-drag'),
  stopDrag: () => ipcRenderer.send('window-stop-drag'),
  setHeight: (height) => ipcRenderer.send("set-height", height),
  // Window Controls
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  maximized: () => ipcRenderer.invoke("window-maximized"),
  unmaximize: () => ipcRenderer.send("window-unmaximize"),
  close: () => ipcRenderer.send("window-close"),
  // App Data Requests
  getAppMetaData: () => ipcRenderer.invoke('get-app-meta-data'),
  getUrl: () => ipcRenderer.invoke("startUrl"),
  enableThemeChange: () => ipcRenderer.invoke("enable-theme-change"),
  getCurrentURL: () => ipcRenderer.invoke("get-current-url"),
  isAppPackaged: () => ipcRenderer.invoke('app-packed'),
  // app features
  bookmark: (bookmark) => ipcRenderer.invoke("new-bookmark", bookmark),
  getBookMarks: () => ipcRenderer.invoke("get-bookmarks"),
  removeBookMark: (timestamp) => ipcRenderer.invoke("remove-bookmark", timestamp),
  getDownloads: () => ipcRenderer.invoke("get-downloads"),
  removeDownload: (id) => ipcRenderer.invoke("remove-download", id),
  pauseDownload: (id) => ipcRenderer.invoke("pause-download", id),
  openFile: (filePath) =>
        ipcRenderer.invoke("open-file", filePath),
  showItemInFolder: (path) =>
    ipcRenderer.invoke("show-item-in-folder", path),

  // Event listeners
  newDownload: (cb) => ipcRenderer.on("new-download", (_event, download) => cb(download)),
  onDownloaded: (cb) => ipcRenderer.on("download-complete", (_, download) => cb(download)),
  onDownloadProgress: (cb) => ipcRenderer.on("download-progress", (_, download) => cb(download)),
  onUrlChanged: (cb) => ipcRenderer.on('url-changed', (_, url) => cb(url)),
  onTitleChanged: (cb) => ipcRenderer.on('title-changed', (_, title) => cb(title)),
  onFaviconChanged: (cb) => ipcRenderer.on('favicon-changed', (_, favicon) => cb(favicon)),
  getFavicon: (url) => ipcRenderer.invoke("get-favicon", url),
  onLoadingChanged: (cb) => ipcRenderer.on('loading-changed', (_, loading) => cb(loading)),
  onNavStateChanged: (cb) => ipcRenderer.on('nav-state-changed', (_, state) => cb(state)),
  onLoadError: (cb) => ipcRenderer.on('load-error', (_, err) => cb(err)),
  onWindowStateChanged: (cb) => ipcRenderer.on('window-state-changed', (_, state) => cb(state)),
  onThemeChange: (cb) => ipcRenderer.on('on-theme-change', (_, t) => cb(t)),
  themeChange: (theme) => ipcRenderer.send("theme-change", theme),
  sendLocation: (location) => ipcRenderer.send("location-change", location),
  applyAccent: (cb) => ipcRenderer.on("applyaccent", (_, accent) => cb(accent)),
  onSearchEngineChange: (cb) => ipcRenderer.on("search-engine", (_, se) => cb(se))
});