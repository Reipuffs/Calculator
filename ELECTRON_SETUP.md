# Electron Desktop App Setup

Your calculator app is now configured to run as a desktop application on Windows, macOS, and Linux!

## How to Use

### Development Mode
Run the app in development with DevTools open:

```bash
npm run dev:electron
```

This will:
1. Compile the Electron main process
2. Start the webpack dev server on `http://localhost:3000`
3. Launch the Electron window pointing to the dev server
4. Open DevTools for debugging

### Build for Desktop

#### Quick Build (development)
```bash
npm run build:electron:dev
```

This builds the app and shows the output directory without packaging.

#### Full Production Build
```bash
npm run build:electron
```

This will:
1. Compile Electron files
2. Build optimized webpack bundle
3. Package native installers for:
   - **Windows**: `.exe` installer and portable `.exe`
   - **macOS**: `.dmg` installer
   - **Linux**: `.AppImage` and `.deb` packages

The packaged installers will be in the `dist/` folder.

## Project Structure

```
calculator/
├── electron/
│   ├── main.ts          # Electron main process (handles window creation)
│   ├── preload.ts       # Preload script for secure IPC
│   ├── main.js          # Compiled main.ts
│   └── preload.js       # Compiled preload.ts
├── src/                 # Your existing web app code
├── dist/                # Built app files
└── package.json         # Updated with Electron config
```

## Features Included

✅ **Multi-platform Support**: Windows, macOS, Linux  
✅ **Development Mode**: Hot reload with DevTools  
✅ **Application Menu**: Standard File, Edit, View menus  
✅ **Secure Context Isolation**: Modern Electron security best practices  
✅ **Auto-reload in Dev**: Webpack dev server integration  

## What Changed

- Added Electron and electron-builder dependencies
- Added `electron/main.ts` and `electron/preload.ts`
- Updated `package.json` with Electron configuration and build scripts
- Main entry point changed to `electron/main.js`

## Next Steps

1. Test development mode: `npm run dev:electron`
2. Make any UI/UX changes in the `src/` folder (works as before)
3. When ready, build with `npm run build:electron`
4. Distribute the installers from the `dist/` folder

## Customization

- **App Icon**: Update `assets/icon.png` to customize the app icon
- **App Name**: Change `productName` in `package.json` build section
- **Window Size**: Edit `width` and `height` in `electron/main.ts`
- **App ID**: Change `appId` in `package.json` build section (for Windows app identification)

## Troubleshooting

**Port 3000 already in use**: Kill the process with `lsof -i :3000 | grep node | awk '{print $2}' | xargs kill`

**Compilation errors**: Run `npm run type-check` to validate TypeScript
