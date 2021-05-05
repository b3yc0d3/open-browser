/*
 * Created on Wed May 05 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: nsfw_wraning.js
 * Description: contains all nsfw wraning functions
*/

var { remote } = require('electron')
var nsfw_websits = require(__dirname + '/lists/nsfw_websites.json')
var _settings = require(remote.getGlobal('browser').paths.settings)

function isNSFW(url) {

    return nsfw_websits.list.some(pattern => url.includes(pattern))
}

function isInNSFWOfList(url) {
    return (_settings.nsfw_warning_off.includes(url))
}