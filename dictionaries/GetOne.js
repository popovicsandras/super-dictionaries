'use strict';

var Logger = require('@workshare/ws-logger').Logger;

class GetOne{

  constructor(config, options) {
      this.storage = options.storage;

      if (options.loggerFactory) {
          this.log = options.loggerFactory.get('dictionaries.api.getone');
      }
      else {
          this.log = new Logger();
      }
  }

	install(app) {
        app.get(
    		'/api/v1.0/:scope/:uuid/dictionaries/:name.json',
    		this.processRequest.bind(app)
    		);
    }

	processRequest(request, response){
        this.storage.willGet({
            scope: request.params.scope,
            uuid: request.params.uuid,
            name: request.params.name
        })
        .then(function(dictionary) {
            if (dictionary) {
                response.status(200);
                response.json(dictionary);
            }
            else {
                response.status(404);
            }
        })
        .catch(function(e) {
            response.status(500);
            this.log.error(e);
        }.bind(this));
	}

}

module.exports = GetOne;
