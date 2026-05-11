"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose any APIs you need in the renderer process here
electron_1.contextBridge.exposeInMainWorld('electron', {
    version: process.versions.electron,
});
