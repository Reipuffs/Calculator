"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('electron-app');
});
// Expose any APIs you need in the renderer process here
electron_1.contextBridge.exposeInMainWorld('electron', {
    version: process.versions.electron,
    platform: process.platform,
    isDesktopApp: true,
    windowControls: {
        minimize: () => electron_1.ipcRenderer.send('window:minimize'),
        toggleMaximize: () => electron_1.ipcRenderer.send('window:maximize-toggle'),
        close: () => electron_1.ipcRenderer.send('window:close'),
    },
});
