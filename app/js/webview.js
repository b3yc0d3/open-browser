const remote = require('electron').remote
const { ipcRenderer } = require('electron')
const Menu = remote.Menu

const remWindow = remote.getCurrentWindow()

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    console.log(e.path[0].localName)

    var menu = [
        {
            label: 'Reload',
            type: 'normal',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
                ipcRenderer.sendToHost('reload')
            },
            enabled: true
        },
        {
            type: 'separator'
        },
        {
            label: 'Copy',
            role: 'copy',
            visible: false
        },
        {
            label: 'Create QR Code',
            type: 'normal'
        },
        {
            label: 'View',
            role: 'viewMenu'
        },
        {
            type: 'separator'
        },
        {
            label: 'Inspect',
            type: 'normal',
            accelerator: 'CommandOrControl+Shift+I',
            click: (e) => {
                ipcRenderer.sendToHost('toggleDevTools')
            }
        }
    ]

    Menu.buildFromTemplate(menu).popup(remWindow)
})