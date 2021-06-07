var fs = require('fs')

class DeepIntegratedBlocker {
    constructor(browserWindow, black_list) {
        this['browserWindow'] = browserWindow
        this['blackList'] = []

        black_list.forEach((url) => {
            JSON.parse(fs.readFileSync(__dirname.replace('/scripts', '').replace('\\scripts', '') + url)).forEach((data) => {
                this['blackList'].push(data)
            })
        })
    }

    /**
     * Start's the AdBlocker
     */
    start() {
        console.log('[DIB] started...')

        this['browserWindow'].webContents.session.webRequest.onBeforeRequest({ urls: this['blackList'] }, (details, callback) => {
            const referrer = details.referrer
            const webContents = details.webContents
            const frame = details.frame

            const resourceType = details.resourceType
            const timestamp = details.timestamp
            const method = details.method
            const url = details.url
            const id = details.id

            console.log(`[DIB] ${this.__timeConverter(timestamp)} | Blocked : ${method} - ${url} - ${id}`)

            callback({ cancel: true })
        })
    }


    __timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
}

module.exports.DeepIntegratedBlocker = DeepIntegratedBlocker