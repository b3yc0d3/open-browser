const remote = require('electron').remote
const { ipcRenderer } = require('electron')
const Menu = remote.Menu

const remWindow = remote.getCurrentWindow()

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    var selectedElement = e.path[0]
    var selectedElementParent = e.path[1]

    var isLink = selectedElement.localName === 'a'
    var isParentLink = selectedElementParent.localName === 'a'
    var linkSrc = (isLink ? selectedElement.href : null)
    var parentLinkSrc = (isParentLink ? selectedElementParent.href : null)

    var isImage = selectedElement.localName === 'img'
    var imageSrc = (isImage ? selectedElement.currentSrc : null)


    var menu = [
        { /* reload page */
            label: 'Reload',
            type: 'normal',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
                location.reload()
            },
            visible: !isImage,
            enabled: !isImage,
            icon: 'app/images/icons/refresh.png'
        },
        { /* Copy Link */
            label: 'Open Link in New Tab',
            type: 'normal',
            click: () => {
                if (isLink) {
                    openInNewTab(linkSrc)
                }
                if (isParentLink) {
                    openInNewTab(parentLinkSrc)
                }
            },
            enabled: isLink || isParentLink,
            visible: isLink || isParentLink
        },
        {
            type: 'separator',
            visible: isLink || isParentLink
        },
        { /* Copy Link */
            label: 'Copy Link',
            type: 'normal',
            click: () => {
                if (isLink) {
                    copyTextToClipboard(linkSrc)
                }
                if (isParentLink) {
                    copyTextToClipboard(parentLinkSrc)
                }
            },
            enabled: isLink || isParentLink,
            visible: isLink || isParentLink
        },
        {
            type: 'separator',
            visible: isLink || isParentLink
        },
        { /* open image in new tab */
            label: 'Open Image in New Tab',
            type: 'normal',
            click: () => {
                openInNewTab(imageSrc)
            },
            enabled: isImage,
            visible: isImage
        },
        { /* save image as */
            label: 'Save Image As...',
            type: 'normal',
            click: () => {

            },
            enabled: false,
            visible: isImage
        },
        { /* copy image */
            label: 'Copy Image',
            type: 'normal',
            click: () => {

            },
            enabled: false,
            visible: isImage
        },
        { /* copy image link */
            label: 'Copy Image Link',
            type: 'normal',
            click: () => {
                copyTextToClipboard(imageSrc)
            },
            enabled: isImage,
            visible: isImage
        },
        {
            type: 'separator'
        },
        {
            label: 'Create QR Code',
            type: 'normal',
            accelerator: 'CommandOrControl+Q',
            icon: 'app/images/icons/qr_code.png'
        },
        {
            type: 'separator'
        },
        { /* open devtools */
            label: 'Inspect',
            type: 'normal',
            accelerator: 'CommandOrControl+Shift+I',
            click: (e) => {
                ipcRenderer.sendToHost('toggleDevTools')
            },
            icon: 'app/images/icons/code.png'
        }
    ]

    Menu.buildFromTemplate(menu).popup(remWindow)
})

function openInNewTab(url) {
    window.open(url, '_blank').focus()
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
}

window.addEventListener('blur', () => {
    ipcRenderer.sendToHost('blur')
})

window.addEventListener('focus', () => {
    ipcRenderer.sendToHost('focus')
})

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.code === 'KeyR') {
        location.reload()
    }

    if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') {
        ipcRenderer.sendToHost('toggleDevTools')
    }
})