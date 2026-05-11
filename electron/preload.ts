import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('electron-app');
});

// Expose any APIs you need in the renderer process here
contextBridge.exposeInMainWorld('electron', {
  version: process.versions.electron,
  platform: process.platform,
  isDesktopApp: true,
  windowControls: {
    minimize: () => ipcRenderer.send('window:minimize'),
    toggleMaximize: () => ipcRenderer.send('window:maximize-toggle'),
    close: () => ipcRenderer.send('window:close'),
  },
});
