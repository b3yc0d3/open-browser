class adblocker {
    constructor(browserWindow, black_list) {
        this['browserWindow'] = browserWindow
        this['blackList'] = black_list
    }

    /**
     * Start's the AdBlocker
     */
    start() {
        this['browserWindow'].webContents.session.webRequest.onBeforeRequest({ urls: this['blackList'] }, (details, callback) => {
            callback({ cancel: true })
        })
    }
}

module.exports.adblocker = adblocker