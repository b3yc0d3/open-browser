/*
 * Created on Tue May 04 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: index.js
 * Description: inits open browser
*/

const getPath = require('platform-folders')
const getos = require('getos')
const packJSON = require('./package.json')
const os = require('os')
const fs = require('fs')
const ipcMain = require('electron').ipcMain

var userAgent = `Mozilla/5.0 ({{OS_INFO}}; {{ARCH}}) Gecko/20100101 OB/{{HYPERO_VERSION}} Chrome/{{CHROME_VERSION}} Safari/537.36`


var userData = getPath.getConfigHome()
var baseFolder = `${userData}/Open Browser`
var path_settingsFile = baseFolder + '/settings.json'
var settingsFile = null

var settings_raw = {
    "history": baseFolder + '/history.ob',
    "nsfw_warning": true,
    "nsfw_warning_off": [],
    "path_downlaod": getPath.getDownloadsFolder(),
    "path_extensions": baseFolder + '/extensions',
    "gpc": {
        "enabled": true
    }
}
/* Checking if files exsists */

if (fs.existsSync(baseFolder)) { /* Check if folder exsists */
    if (!fs.existsSync(path_settingsFile)) { /* check if settings file exsists */
        fs.writeFileSync(path_settingsFile, JSON.stringify(settings_raw))
    }
} else {
    return
}

/* GLOBAL VARS */
//#region
var os_info = {}
getos((e, osInfo) => {
    os_info = osInfo
})

global.browser = {
    info: {
        name: packJSON.productName,
        user_agent: generateUA(userAgent),
        versions: {
            dusk: packJSON.version,
            javascript: process.versions.v8.split('-')[0],
            chromium: process.versions.chrome,
            electron: process.versions.electron
        },
        os: {
            platform: `${os_info.os}`,
            codename: `${os_info.codename || '?'}`,
            name: os_info.dist,
            arch: os.arch()
        },
        repo: {
            url: packJSON.repository.url,
            type: packJSON.repository.type
        }
    },
    paths: {
        settings: path_settingsFile
    }
}

//#endregion

/* Start MAIN.JS */
require('./main')

/**
 * IPC LISTENER
 */
ipcMain.on('history', (event, arg) => {
    var param = arg[0]
    arg.shift()
    var args = arg

    switch (param) {
        case 'add':

            break;

        case 'clear':

            break;

        default:
            break;
    }
})


function generateUA(pattern) {
    var OS_arch = os.arch()

    var pat = pattern
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0

    pat = pat.replace('{{MOZ_VERSION}}', '5.0')
    pat = pat.replace('{{ARCH}}', OS_arch)
    pat = pat.replace('{{OS_INFO}}', OSVersion())
    pat = pat.replace('{{CHROME_VERSION}}', process.versions.chrome)
    pat = pat.replace('{{HYPERO_VERSION}}', packJSON.version)

    return pat
}

function OSVersion() {
    var OS_type = os.type()
    var OSVersion = ''

    if (OS_type == 'Windows_NT') { // Windows
        var os_rel = os.release().split('.')[0] + '.' + os.release().split('.')[1]

        switch (os_rel) {
            case '10.0': // Windows 10
                OSVersion += 'Windows 10'
                break;

            case '6.3': // Windows 8.1
                OSVersion += 'Windows 8.1'
                break;

            case '6.2': // Windows 8
                OSVersion += 'Windows 8'
                break;

            case '6.1': // Windows 7
                OSVersion += 'Windows 7'
                break;

            case '6.0': // Windows Vista
                OSVersion += 'Windows Vista'
                break;

            case '5.2': // Windows XP Professional x64 Edition
            case '5.1': // Windows XP
                OSVersion += 'Windows XP'
                break;

            case '4.90': // Windows ME
                OSVersion += 'Windows ME'
                break;

            case '5.0': // Windows 2000
                OSVersion += 'Windows 2000'
                break;

            case '4.10': // Windows 98
                OSVersion += 'Windows 98'
                break;

            case '4.0': // Windows NT 4.0
                OSVersion += 'Windows NT 4.0'
                break;

            case '4.00': // Windows 95
                OSVersion += 'Windows 95'
                break;

            case '3.51': // Windows NT 3.51
                OSVersion += 'Windows NT 3.51'
                break;

            case '3.5': // Windows NT 3.5
                OSVersion += 'Windows NT 3.5'
                break;

            case '3.2': // Windows 3.2
                OSVersion += 'Windows 3.2'
                break;

            case '3.11': // Windows for Workgroups 3.11
                OSVersion += 'Windows for Workgroups 3.11'
                break;

            case '3.1': // Windows NT 3.1
                OSVersion += 'Windows NT 3.1'
                break;

            case '3.10': // Windows 3.1
                OSVersion += 'Windows 3.1'
                break;

            case '3.0': // Windows 3.0
                OSVersion += 'Windows 3.0'
                break;

            case '2.11': // Windows 2.11
                OSVersion += 'Windows 2.11'
                break;

            case '2.10': // Windows 2.10
                OSVersion += 'Windows 2.10'
                break;

            case '2.03': // Windows 2.03
                OSVersion += 'Windows 2.03'
                break;

            case '1.04': // Windows 1.04
                OSVersion += 'Windows 1.04'
                break;

            case '1.03': // Windows 1.03
                OSVersion += 'Windows 1.03'
                break;

            case '1.02': // Windows 1.02
                OSVersion += 'Windows 1.02'
                break;

            case '1.01': // Windows 1.01
                OSVersion += 'Windows 1.0'
                break;

            default:
                break;
        }
    } else if (OS_type == 'Linux') { // Linux
        OSVersion = `Linux ${os.release().split('.')[0]}.${os.release().split('.')[1]}`
    } else if (OS_type == 'Darwin') { // macOS
        OSVersion = `macOS ${os.release().split(',')[0]}.${os.release().split(',')[1]}`
    }
    return OSVersion
}