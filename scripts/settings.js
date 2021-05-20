/*
 * Created on Wed May 05 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: settings.js
 * Description: settings class
*/

const fs = require('fs')

class OB_Settings {
    constructor(path) {
        this['path'] = path
        this['settings'] = {}

        this.read(path)
    }

    read(path) {
        this['path'] = path
        this['settings'] = JSON.parse(fs.readFileSync(path))
    }

    save() {
        fs.writeFileSync(this['path'], JSON.stringify(this['settings']))
    }

    get(key, fallback) {
        return this['settings'][key] || fallback
    }

    set(key, value) {
        this['settings'][key] = value
        this.save()
    }

    appendArrray(key, value) {
        this['settings'][key].push(value)
        this.save()
    }

    nsfw_addToWhiteList(url) {
        if(!this['settings'].nsfw_warning_off.includes(url)) {
            this['settings'].nsfw_warning_off.push(url)
            this.save()
        }
    }
}

module.exports.OB_Settings = OB_Settings