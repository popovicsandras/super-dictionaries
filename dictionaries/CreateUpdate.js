'use strict';

var Dictionaries = require('./Dictionaries');

class CreateUpdate {

    constructor(options) {
        Dictionaries = options && options.Dictionaries || Dictionaries;
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', this._processRequest);
    }

    _processRequest() {
        Dictionaries.update();
    }
}

module.exports = CreateUpdate;
