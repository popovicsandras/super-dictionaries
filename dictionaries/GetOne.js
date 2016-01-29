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
    this.storage.willGet();
	}
	
}

module.exports = GetOne;
