'use strict';

class CreateUpdate{

    constructor() {
        this.collection = require('./Dictionaries');
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', this._processRequest.bind(this));
    }

    _processRequest(request, response) {
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
            },
            updatePromise = this.collection.update(
                selector,
                dictionary,
                {upsert: true}
            );

        updatePromise.then(this._sendResponse.bind(this, response));

        return updatePromise;
    }

    _sendResponse(response) {
        response.status(200).end();
    }
}

module.exports = CreateUpdate;
