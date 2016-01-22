'use strict';

var co = require('co');

class CreateUpdate{

    constructor() {
        this.collection = require('./Dictionaries');
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', co.bind(this, this._processRequest));
    }

    * _processRequest(request, response) {
        var selector = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            },
            dictionary = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name,
                body: request.body.content
            };

        yield this._save(selector, dictionary);
        this._sendResponse(response);
    }

    _save(selector, dictionary) {
        return this.collection.update(
            selector,
            dictionary,
            {upsert: true}
        );
    }

    _sendResponse(response) {
        response.status(200).end();
    }
}

module.exports = CreateUpdate;
