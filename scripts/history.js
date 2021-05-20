/*
 * Created on Tue May 11 2021
 *
 * Copyright (c) 2021 b3yc0d3
 *
 * Filename: sqlite_handler.js
 * Description: defines sqlite3 stuff
*/

const sqlite3 = require('sqlite3')

class History {

    constructor(path) {
        this['dataBase'] = new sqlite3.Database(path, (err) => {
            if (err) {
                throw err
            } else {
                console.log(`[SQLite3] History : connected to database`)
            }
        })

        function __close() {
            this['dataBase'].close()
        }
    }

}

module.exports.History = History