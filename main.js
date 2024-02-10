const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');
const rpc = require("./rpc.js");
const clientId = "1205866839662657597";

let win;

function createWindow() {
    win = new BrowserWindow({
        width : 808,
        height: 512,
        icon: __dirname + "/img/icon.png",
        resizable: false,
        webPreferences: {
            devTools: false
        },
        autoHideMenuBar: true
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   app.quit();
});

rpc.login({ clientId }).catch(console.error);
rpc.setActivity();