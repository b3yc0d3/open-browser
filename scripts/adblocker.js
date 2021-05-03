var fs = require('fs')

class adblocker {
    constructor(browserWindow, black_list) {
        this['browserWindow'] = browserWindow
        this['blackList'] = []

        black_list.forEach((url) => {
            JSON.parse(fs.readFileSync(__dirname.replace('/scripts', '') + url)).forEach((data) => {
                this['blackList'].push(data)
            })
        })
    }

    /**
     * Start's the AdBlocker
     */
    start() {
        this['browserWindow'].webContents.session.webRequest.onBeforeRequest({ urls: this['blackList'] }, (details, callback) => {
            console.log(details)
            callback({ cancel: true })
        })
    }
}

module.exports.adblocker = adblocker