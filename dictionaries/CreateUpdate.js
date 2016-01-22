'use strict';

var Dictionaries = require('./Dictionaries');

class CreateUpdate {

    constructor(options) {
        Dictionaries = options && options.Dictionaries || Dictionaries;
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', this._processRequest);
    }

    _processRequest(request) {
        var selector = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            },
            document = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name,
                content: request.body.content
            };

        Dictionaries.update(selector, document);
    }
}

module.exports = CreateUpdate;
