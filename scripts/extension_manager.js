/*
 * Created on Tue Jun 08 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: extension_manager.js
 * Description: manages extensions
*/

const fs = require('fs')
const path = require('path')

class ExtensionManager {
    constructor(session) {
        this['session'] = session
        this['extension'] = {}
    }

    load(folder) {
        var files = fs.readdirSync(folder)

        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            var _path = path.join(folder, file)

            if (fs.statSync(_path).isDirectory()) {
                this.loadExtension(_path)
            }
        }

        //console.log(this.allExtensions())
    }

    async loadExtension(folder) {
        await this['session'].defaultSession.loadExtension(folder, {
            allowFileAccess: false
        })
    }

    getExtension(extensionId) {
        return this['session'].getExtension(extensionId)
    }

    allExtensions() {
        return this['session'].defaultSession.getAllExtensions()
    }

    uninstallExtension(extensionId) {
        this['session'].removeExtension(extensionId)
    }
}

module.exports.ExtensionManager = ExtensionManager