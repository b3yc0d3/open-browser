/*
 * Created on Sun Apr 25 2021
 *
 * Copyright (c) 2021 b3yc0d3
 * 
 * Filename: protocols.js
 * Description: custom protocol registration and handeling
*/

const { protocol, session } = require('electron')
const path = require('path')
const mime = require('mime-types')

const ob_pages = __dirname + '/../browser_pages'

/**
 * Documentation:
 * https://www.electronjs.org/docs/api/protocol#protocolregisterhttpprotocolscheme-handler
 */


/* Browser intern like chrome:// */
protocol.registerFileProtocol('ob', (request, callback) => {
    let url = request.url.substr(5)
    var first_path = url.split('/')[0]

    var return_path = ""

    switch (first_path) {
        case 'resources':
            return_path = path.normalize(`${ob_pages}/${url.substr(10)}`)

            break;

        case 'version':
            return_path = path.normalize(`${ob_pages}/version.html`)
            break;

        case 'settings':
            return_path = path.normalize(`${ob_pages}/settings.html`)
            break;

        case 'new_tab':
        default:
            return_path = path.normalize(`${ob_pages}/new_tab.html`)
            break;
    }

    callback({
        path: return_path,
        mimeType: mime.lookup(return_path)
    })

})