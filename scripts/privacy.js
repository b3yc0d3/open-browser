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

            if (global.browser.settings.get('gpc.enabled')) {
                var headers = details.requestHeaders
                var url = new URL(details.url)

                headers = this.__cleanUpHeaders(headers, 'Sec-Fetch')
                headers['sec-gpc'] = '1'

                callback({ requestHeaders: headers })
            }
        })
    }

    __cleanUpHeaders(headers, pattern) {
        var _headers = headers

        for (var header in _headers) {
            if (header.startsWith(pattern) || header.includes(pattern) || header == pattern) {
                delete _headers[header]
            }
        }

        return _headers
    }
}

module.exports.GlobalPrivacyControl = GPC
