const ipc = require('electron').ipcRenderer

ipc.on('tab', (e, arg) => {
    switch (arg) {
        case 'new':
            addTab({
                title: null,
                url: null
            })
            break;

        case 'close':
            closeTab()
            break;

        case 'reload':
            reloadTab()
            break;

        case 'toggleDevTools':
            toggleDevTools()
            break;

        default:
            break;
    }
})