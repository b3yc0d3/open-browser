const { app, BrowserWindow, Menu, session } = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const os = require('os')
const packJSON = require('./package.json')
const getos = require('getos')

//libs
const { adblocker } = require('./scripts/adblocker.js')

let win
var userAgent = `Mozilla/5.0 ({{OS_INFO}}; {{ARCH}}) Gecko/20100101 OB/{{HYPERO_VERSION}} Chrome/{{CHROME_VERSION}} Safari/537.36`
var AdBlocker = null

/* GLOBAL VARS */

getos((e, os_info) => {

    global.info = {
        name: packJSON.productName,
        user_agent: generateUA(userAgent),
        versions: {
            dusk: packJSON.version,
            javascript: process.versions.v8,
            chromium: process.versions.chrome,
            electron: process.versions.electron
        },
        os: {
            platform: `${os_info.os}`,
            codename: `${os_info.codename || '?'}`,
            name: `${os_info.dist}`,
            arch: os.arch()
        },
        repo: {
            url: packJSON.repository.url,
            type: packJSON.repository.type
        }
    }

})

//CUSTOM MENU
const customMenu = [{
    label: 'Debug',
    submenu: [
        {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+E',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
            }
        },
        {
            label: 'Chrome DevTools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+N' : 'Ctrl+Shift+N',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
        }
    ]
}]

//CREATE WINDOW
function createWindow() {
    win = new BrowserWindow({
        title: "Open Browser",
        icon: path.join(__dirname, "/app/images/open_browser_32x32.png"),
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
        }
    })

    // Load windows URL
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: "file:",
        slashes: true
    }), { userAgent: generateUA(userAgent) })

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

    /* Init custom Protocols */
    require('./scripts/protocols')

    /* Deep Integrated Blocker */
    AdBlocker = new adblocker(win, [__dirname + '/lists/list_01.json', __dirname + '/lists/list_02.json'])
    AdBlocker.start()
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

function generateUA(pattern) {
    var OS_arch = os.arch()

    var pat = pattern
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0

    pat = pat.replace('{{MOZ_VERSION}}', '5.0')
    pat = pat.replace('{{ARCH}}', OS_arch)
    pat = pat.replace('{{OS_INFO}}', OSVersion())
    pat = pat.replace('{{CHROME_VERSION}}', process.versions.chrome)
    pat = pat.replace('{{HYPERO_VERSION}}', packJSON.version)

    return pat
}

function OSVersion() {
    var OS_type = os.type()
    var OSVersion = ''

    if (OS_type == 'Windows_NT') { // Windows
        var os_rel = os.release().split('.')[0] + '.' + os.release().split('.')[1]

        switch (os_rel) {
            case '10.0': // Windows 10
                OSVersion += 'Windows 10'
                break;

            case '6.3': // Windows 8.1
                OSVersion += 'Windows 8.1'
                break;

            case '6.2': // Windows 8
                OSVersion += 'Windows 8'
                break;

            case '6.1': // Windows 7
                OSVersion += 'Windows 7'
                break;

            case '6.0': // Windows Vista
                OSVersion += 'Windows Vista'
                break;

            case '5.2': // Windows XP Professional x64 Edition
            case '5.1': // Windows XP
                OSVersion += 'Windows XP'
                break;

            case '4.90': // Windows ME
                OSVersion += 'Windows ME'
                break;

            case '5.0': // Windows 2000
                OSVersion += 'Windows 2000'
                break;

            case '4.10': // Windows 98
                OSVersion += 'Windows 98'
                break;

            case '4.0': // Windows NT 4.0
                OSVersion += 'Windows NT 4.0'
                break;

            case '4.00': // Windows 95
                OSVersion += 'Windows 95'
                break;

            case '3.51': // Windows NT 3.51
                OSVersion += 'Windows NT 3.51'
                break;

            case '3.5': // Windows NT 3.5
                OSVersion += 'Windows NT 3.5'
                break;

            case '3.2': // Windows 3.2
                OSVersion += 'Windows 3.2'
                break;

            case '3.11': // Windows for Workgroups 3.11
                OSVersion += 'Windows for Workgroups 3.11'
                break;

            case '3.1': // Windows NT 3.1
                OSVersion += 'Windows NT 3.1'
                break;

            case '3.10': // Windows 3.1
                OSVersion += 'Windows 3.1'
                break;

            case '3.0': // Windows 3.0
                OSVersion += 'Windows 3.0'
                break;

            case '2.11': // Windows 2.11
                OSVersion += 'Windows 2.11'
                break;

            case '2.10': // Windows 2.10
                OSVersion += 'Windows 2.10'
                break;

            case '2.03': // Windows 2.03
                OSVersion += 'Windows 2.03'
                break;

            case '1.04': // Windows 1.04
                OSVersion += 'Windows 1.04'
                break;

            case '1.03': // Windows 1.03
                OSVersion += 'Windows 1.03'
                break;

            case '1.02': // Windows 1.02
                OSVersion += 'Windows 1.02'
                break;

            case '1.01': // Windows 1.01
                OSVersion += 'Windows 1.0'
                break;

            default:
                break;
        }
    } else if (OS_type == 'Linux') { // Linux
        OSVersion = `Linux ${os.release().split('.')[0]}.${os.release().split('.')[1]}`
    } else if (OS_type == 'Darwin') { // macOS
        OSVersion = `macOS ${os.release().split(',')[0]}.${os.release().split(',')[1]}`
    }
    return OSVersion
}