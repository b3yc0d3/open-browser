/*
 * Created on Tue Jun 08 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: custom_header.js
 * Description: custom headers
*/



class CustomHeader {
    constructor(browserWindow) {
        this['browserWindow'] = browserWindow
    }

    init(headers) {
        console.log('[CH] Custom Header inited...')
        this['browserWindow'].webContents.session.webRequest.onBeforeSendHeaders({ urls: ['<all_urls>'] }, (details, callback) => {

            var default_headers = details.requestHeaders

            callback({ requestHeaders: Object.assign(default_headers, headers) })
        })
    }
}

module.exports.CustomHeader = CustomHeader