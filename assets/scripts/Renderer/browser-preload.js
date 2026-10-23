/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, Kore Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('blinkr', {
  // Navigation
  navigateTo: (url) => ipcRenderer.send('BROWSERVIEW-navigate-to', url),
  
  // App Data
  getUserMetaData: () => ipcRenderer.invoke('BROWSERVIEW-get-user-meta-data'),
  getAppMetaData: () => ipcRenderer.invoke('BROWSERVIEW-get-app-meta-data'),
  getUrl: () => ipcRenderer.invoke("BROWSERVIEW-startUrl"),
  enableThemeChange: () => ipcRenderer.invoke("BROWSERVIEW-enable-theme-change"),
  isAppPackaged: () => ipcRenderer.invoke('BROWSERVIEW-app-packed'),
  
  // Theme
  themeChange: (theme) => ipcRenderer.send("theme-change", theme),
  onThemeChanged: (cb) => ipcRenderer.on('on-theme-change', (_, t) => cb(t)),
  
  // History
  getHistory: () => ipcRenderer.invoke('BROWSERVIEW-get-history'),
  removeHistoryItem: (id) => ipcRenderer.invoke('BROWSERVIEW-remove-history-item', id),
  clearHistory: () => ipcRenderer.invoke('BROWSERVIEW-clear-history'),
  
  // Bookmarks
  getBookmarks: () => ipcRenderer.invoke('BROWSERVIEW-get-bookmarks'),
  addBookmark: (bookmark) => ipcRenderer.send('BROWSERVIEW-add-bookmark', bookmark),
  removeBookmark: (url) => ipcRenderer.send('BROWSERVIEW-remove-bookmark', url),
  
  // Shortcuts
  getShortcuts: () => ipcRenderer.invoke('BROWSERVIEW-get-shortcuts'),
  setShortcut: (shortcut) => ipcRenderer.invoke('BROWSERVIEW-set-shortcut', shortcut),
  editShortcut: (id, n, u) => ipcRenderer.invoke("BROWSERVIEW-edit-shortcut", id, n, u),
  removeShortcut: (shortcutId) => ipcRenderer.invoke('BROWSERVIEW-remove-shortcut', shortcutId),
  
  // Downloads
  getDownloads: () => ipcRenderer.invoke("get-downloads"),
  removeDownload: (id) => ipcRenderer.invoke("remove-download", id),
  pauseDownload: (id) => ipcRenderer.invoke("pause-download", id),
  
  // Favicon
  getFavicon: (url) => ipcRenderer.invoke("BROWSERVIEW-get-favicon", url),
  
  // File operations
  openFile: (filePath) => ipcRenderer.invoke("open-file", filePath),
  showItemInFolder: (filePath) => ipcRenderer.invoke("show-item-in-folder", filePath),
  
  // Event listeners
  newDownload: (cb) => ipcRenderer.on("new-download", (_, download) => cb(download)),
  onDownloaded: (cb) => ipcRenderer.on("download-complete", (_, download) => cb(download)),
  onDownloadProgress: (cb) => ipcRenderer.on("download-progress", (_, download) => cb(download)),
  applyAccent: (accent) => ipcRenderer.invoke("BROWSERVIEW-applyaccent", accent),
  changeSearchEngine: (se) => ipcRenderer.invoke("BROWSERVIEW-search-engine", se)
});