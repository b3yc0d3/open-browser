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
const { OB_Settings } = require('./scripts/settings.js')

var userAgent = `Mozilla/5.0 ({{OS_INFO}}) AppleWebKit/537.36 (KHTML, like Gecko) Open-Browser/{{OB_VERSION}} Chrome/{{CHROME_VERSION}} Safari/537.36`

userAgent = 'Mozilla/5.0 ({{OS_INFO}}) AppleWebKit/537.36 (KHTML, like Gecko) Open-Browser/{{OB_VERSION}} Safari/537.36'

var userData = getPath.getConfigHome()
var baseFolder = `${userData}/Open Browser`
var path_settingsFile = baseFolder + '/settings.json'
var path_extensions = baseFolder + '/extensions'
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

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder)
}

if (!fs.existsSync(path_settingsFile)) {
    fs.writeFileSync(path_settingsFile, JSON.stringify(settings_raw))
}

if (!fs.existsSync(path_extensions)) {
    fs.mkdirSync(path_extensions)
}

/* SETTING UP HANDLERS */
const browserSettings = new OB_Settings(path_settingsFile)

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
        settings: path_settingsFile,
        extensions: path_extensions
    },
    settings: browserSettings
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
    pat = pat.replace('{{OB_VERSION}}', packJSON.version)

    return pat
}

function OSVersion() {
    var osType = os.type()
    var osVersion

    switch (osType) {
        case 'Windows_NT':
            var nt_version = os.release().split('.')[0] + '.' + os.release().split('.')[1]
            osVersion = `Window NT ${nt_version}; ${(os.arch == 'x64' ? `Win64; x64` : `Win86; x86`)}`
            break;

        case 'Linux':
            osVersion = `X11; Linux ${(os.arch == "x64" ? `x86_x64` : `x86`)}`
            break;

        case 'Darwin':
            osVersion = `Macintosh; Mac OS X ${os.release().split(',')[0]}.${os.release().split(',')[1]}`
            break;

        default:
            break;
    }

    return osVersion
}