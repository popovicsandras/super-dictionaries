'use strict';

class CreateUpdate{

    constructor(config, options) {
        //this.collection = options.collection || this.getCollection();
    }

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json', this._processRequest.bind(this));
    }

    _processRequest(request, response) {
        //var selector = {
        //        scope: request.params.scope,
        //        uuid: request.params.uuid,
        //        name: request.params.name
        //    },
        //    dictionary = {
        //        scope: request.params.scope,
        //        uuid: request.params.uuid,
        //        name: request.params.name,
        //        body: request.body.content
        //    };
        //
        //this.collection.update(
        //    selector,
        //    dictionary,
        //    { upsert: true },
        //    this._respond.bind(this, response)
        //);
    }

    _respond(response) {
        //response.status(200).end();
    }
}

module.exports = CreateUpdate;
