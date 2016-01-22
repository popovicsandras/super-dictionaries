'use strict';

var co = require('co');

class CreateUpdate {

    constructor(options) {
        this.Dictionaries = options && options.Dictionaries || require('./Dictionaries');
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', co.bind(this, this._processRequest));
    }

    * _processRequest(request, response) {
        try {
            yield this._save(request);
            response.status(200).end();
        } catch (e) {
            response.status(400).end();
        }
    }

    _save(request) {
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

        return this.Dictionaries.update(selector, document, {upsert: true});
    }
}

module.exports = CreateUpdate;
