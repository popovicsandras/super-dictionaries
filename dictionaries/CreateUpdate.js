'use strict';

var Dictionaries = require('./Dictionaries'),
    co = require('co');

class CreateUpdate {

    constructor(options) {
        Dictionaries = options && options.Dictionaries || Dictionaries;
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', co.bind(this, this._processRequest));
    }

    * _processRequest(request, response) {
        try {
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

            yield Dictionaries.update(selector, document, {upsert: true});
            response.status(200).end();
        } catch (e) {
            response.status(400).end();
        }
    }
}

module.exports = CreateUpdate;
