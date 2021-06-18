/*
 * Created on Tue Jan 29 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: main.js
 * Description: creates browser window
*/

const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

//libs
const { menuDebug, menuWindow, menuView, menuTools } = require('./menu.js')
const { DeepIntegratedBlocker } = require('./scripts/deep_integrated_blocker.js')
const { GlobalPrivacyControl } = require('./scripts/privacy.js')
const { CustomHeader } = require('./scripts/custom_header.js')
const { ExtensionManager } = require('./scripts/extension_manager')

let win
var DIB = null

//CUSTOM MENU
const customMenu = []
customMenu.push(menuWindow)
customMenu.push(menuView)
customMenu.push(menuTools)
customMenu.push(menuDebug)

//CREATE WINDOW
function createWindow() {
    win = new BrowserWindow({
        title: "Open Browser",
        icon: path.join(__dirname, "/app/images/linux/appicon_x64.png"),
        show: false,
        frame: true,
        minHeight: 500,
        minWidth: 800,
        enableRemoteModule: true,
        offscreen: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true,
            webSecurity: false,
            contextIsolation: false
        }
    })

    // Load windows URL
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: "file:",
        slashes: true
    }), {})

    // On Ready
    win.once('ready-to-show', () => {
        win.maximize()
        win.show()
    })

}

//#region App
app.on('ready', () => {
    createWindow()
    var menu = Menu.buildFromTemplate(customMenu)
    win.setMenu(menu)
    win.setProgressBar(0.5)

    /* Init custom Protocols */
    require('./scripts/protocols')

    /* Deep Integrated Blocker */
    DIB = new DeepIntegratedBlocker(win,
        ['/lists/list_01.json',
            '/lists/list_02.json',
            '/lists/list_03.json',
            '/lists/porn.json'])
    DIB.start()

    /* Privacy Handlers */
    GPC = new GlobalPrivacyControl(win)
    GPC.start()

    /* Custom headers */
    CH = new CustomHeader(win)
    CH.init({
        'User-Agent': global.browser.info.user_agent
    })

    /* Extension Manager */
    /*EM = new ExtensionManager(win.webContents.session)
    EM.load(global.browser.paths.extensions)

    global.browser.ExtensionManager = EM*/
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('browser-window-created', function (e, window) {
    window.setMenu(null)
})

//#endregion