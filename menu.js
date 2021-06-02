module.exports.menuWindow = {
    label: 'Window',
    submenu: [
        { // New Tab
            label: 'New Tab',
            accelerator: 'CmdOrCtrl+T',
            enabled: true,
            click(item, focusedWindow) {
                focusedWindow.webContents.send("tab", "new")
            }
        },
        { // New Window
            label: 'New Window',
            accelerator: 'CmdOrCtrl+N',
            enabled: false,
            click(item, focusedWindow) {
                // TODO: add new window
            }
        },
        { // Open File
            label: 'Open File...',
            accelerator: 'CmdOrCtrl+O',
            enabled: false,
            click(item, focusedWindow) {
                // TODO: add new tab
            }
        },
        { // Open Address...
            label: 'Open Address...',
            accelerator: 'Alt+D',
            enabled: false,
            click(item, focusedWindow) {
                // TODO: add new tab
            }
        },
        {
            type: 'separator'
        },
        { // Close Window
            label: 'Close Window',
            accelerator: 'CmdOrCtrl+Shift+W',
            click(item, focusedWindow) {
                focusedWindow.close()
            }
        },
        { // Close Tab
            label: 'Close Tab',
            accelerator: 'CmdOrCtrl+W',
            enabled: true,
            click(item, focusedWindow) {
                focusedWindow.webContents.send("tab", "close")
            }
        }
    ]
}

module.exports.menuDebug = {
    label: 'Debug',
    submenu: [
        { // Reload
            label: 'Reload',
            accelerator: 'CmdOrCtrl+Shift+R',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
            }
        },
        { // Open DevTools
            label: 'Open DevTools',
            accelerator: 'CmdOrCtrl+Shift+D',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
        }
    ]
}

module.exports.menuView = {
    label: 'View',
    submenu: [
        {
            label: 'Reload this Page',
            accelerator: 'CmdOrCtrl+R',
            click(item, focusedWindow) {
                focusedWindow.webContents.send("tab", "reload")
            }
        }
    ]
}

module.exports.menuTools = {
    label: 'Tools',
    submenu: [
        { // Downloads
            label: 'Downloads',
            accelerator: 'CmdOrCtrl+J',
            enabled: false
        },
        { // History
            label: 'Histroy',
            accelerator: 'CmdOrCtrl+H',
            enabled: false
        },
        { // Extensions
            label: 'Extenstions',
            enabled: false
        },
        {
            type: 'separator'
        },
        { // clear browser data
            label: 'Clear browser data',
            accelerator: 'CmdOrCtrl+Shift+C',
            enabled: false
        },
        {
            type: 'separator'
        },
        { // show source text
            label: 'Show Source Text',
            accelerator: 'CmdOrCtrl+U',
            enabled: false
        },
        { // show source text
            label: 'DevTools',
            accelerator: 'CmdOrCtrl+Shift+I',
            enabled: true,
            click(item, focusedWindow) {
                focusedWindow.webContents.send("tab", "toggleDevTools")
            }
        },
    ]
}