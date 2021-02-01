class adblocker {
    constructor(browserWindows, black_list) {
        this['browserWindows'] = browserWindows
        this['blackList'] = black_list
    }

    start() {
        this['browserWindows'].webContents.session.webRequest.onBeforeRequest({ urls: this['blackList'] }, (details, callback) => {
            callback({ cancel: true })
        })
    }
}

module.exports.adblocker = adblocker