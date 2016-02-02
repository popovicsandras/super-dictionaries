'use strict';

class GetOne{

  constructor(config, options) {
      this.storage = options.storage;
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
            }
            else {
                response.status(404);
            }
        });
        //.fail(function(e) {
        //    // 500
        //});
	}
	
}

module.exports = GetOne;
