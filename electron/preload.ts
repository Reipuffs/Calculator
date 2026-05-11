import { contextBridge } from 'electron';

// Expose any APIs you need in the renderer process here
contextBridge.exposeInMainWorld('electron', {
  version: process.versions.electron,
});
