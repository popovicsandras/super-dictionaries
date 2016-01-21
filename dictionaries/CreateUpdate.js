'use strict';

class CreateUpdate{

    constructor() {
        this.collection = require('./Dictionaries');
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', this._processRequest.bind(this));
    }

    _processRequest(request) {
        var dictionary = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name,
                body: request.body.content
            };

        return this.collection.insert(
            dictionary
        );
    }
}

module.exports = CreateUpdate;
