const { app, BrowserWindow, ipcMain, ipcRenderer} = require('electron');
const request = require('request');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const url = require('url');
const rpc = require("./rpc.js");
const admZip = require('adm-zip');

const clientId = "1205866839662657597";
let win;
let downloadedFilePath;
let openedProcess = null;

async function createWindow() {
    win = new BrowserWindow({
        width: 808,
        height: 512,
        icon: path.resolve(__dirname, "img/icon.png"),
        resizable: false,
        webPreferences: {
            devTools: false,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });

    await win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })).then();

    ipcMain.emit('check-game-exists');

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

rpc.login({ clientId }).catch(console.error);
rpc.setActivity().catch(console.error);

ipcMain.on('open-file', () => {
    const exePath = 'C:/Games/GGDash/GGDash.exe';

    if (fs.existsSync(exePath)) {
        if (openedProcess && !openedProcess.killed) {
            console.log('The program is already running');
        } else {
            openedProcess = execFile(exePath, { cwd: 'C:/Games/GGDash/' }, (error) => {
                if (error) {
                    console.error(`execFile error: ${error}`);
                }
            });

            openedProcess.on('exit', () => {
                openedProcess = null;
            });
        }
    } else {
        console.error(`File doesn't exist: ${exePath}`);
    }
});

let downloadInProgress = false;
let isDownloading = false;
const exePath = 'C:/Games/GGDash/GGDash.exe';

ipcMain.on('check-game-exists', (event) => {
    const gameExists = fs.existsSync(exePath);
    if (gameExists) {
        win.webContents.send('game-exists');
    } else {
        win.webContents.send('game-not-exists');
    }
});

ipcMain.on('download-file', (event, fileUrl, filePath) => {
    if (isDownloading) {
        return;
    }

    isDownloading = true;

    if (fs.existsSync(exePath)) {
        win.webContents.send('download-complete');
        isDownloading = false;
        return;
    }

    const stream = fs.createWriteStream(filePath);

    request.get(fileUrl)
        .on('error', (err) => {
            isDownloading = false;
            console.error(`Request error: ${err}`);
            win.webContents.send('download-error', err.message);
        })
        .on('response', (response) => {
            const totalLength = parseInt(response.headers['content-length']);
            let receivedBytes = 0;

            response.on('data', (chunk) => {
                receivedBytes += chunk.length;
                const progress = Math.floor((receivedBytes * 100) / totalLength);
                win.webContents.send('download-progress', progress);
            });
        })
        .pipe(stream)
        .on('finish', function () {
            downloadedFilePath = filePath;
            win.webContents.send('download-complete');

            const zip = new admZip(filePath);
            zip.extractAllTo("C:/Games", true);

            fs.unlinkSync(filePath);
            isDownloading = false;
        });
});