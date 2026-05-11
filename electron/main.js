"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url_1 = require("url");
let mainWindow = null;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        resizable: true,
        backgroundColor: '#f4f7f8',
        icon: path.join(__dirname, '../assets/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const startUrl = process.env.ELECTRON_START_URL ||
        (0, url_1.pathToFileURL)(path.join(__dirname, '../dist/index.html')).toString();
    mainWindow.loadURL(startUrl);
    // Open DevTools in development
    if (!electron_1.app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
const getWindowFromEvent = (event) => {
    return electron_1.BrowserWindow.fromWebContents(event.sender);
};
electron_1.ipcMain.on('window:minimize', (event) => {
    getWindowFromEvent(event)?.minimize();
});
electron_1.ipcMain.on('window:maximize-toggle', (event) => {
    const window = getWindowFromEvent(event);
    if (!window) {
        return;
    }
    if (window.isMaximized()) {
        window.unmaximize();
    }
    else {
        window.maximize();
    }
});
electron_1.ipcMain.on('window:close', (event) => {
    getWindowFromEvent(event)?.close();
});
const createMenu = () => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        electron_1.app.quit();
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    role: 'toggleDevTools',
                },
            ],
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
};
electron_1.app.on('ready', () => {
    createWindow();
    createMenu();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
