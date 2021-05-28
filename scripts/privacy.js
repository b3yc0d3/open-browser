/*
 * Created on Sat May 29 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: privacy.js
 * Description: privacy releated stuff
*/

class GPC {
    constructor(browserWindow) {
        this['browserWindow'] = browserWindow
    }

    /**
     * Starting Global Privacy Control
     */
    start() {
        console.log('[GPC] started...')

        this['browserWindow'].webContents.session.webRequest.onBeforeSendHeaders({ urls: ['<all_urls>'] }, (details, callback) => {

            if (details.url.includes('127.0.0.1')) {
                console.log(details.requestHeaders)
            }

            var headers = {}
            headers = details.requestHeaders

            callback({ requestHeaders: headers })
        })
    }
}

module.exports.GlobalPrivacyControl = GPC
