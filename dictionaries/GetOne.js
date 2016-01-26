'use strict';

class GetOne{
	
	install(app) {
        app.get(
    		'/api/v1.0/:scope/:uuid/dictionaries/:name.json',
    		this.processRequest.bind(app)
    		);
    }
	
	processRequest(){
		this.method();
	}
	
}

module.exports = GetOne;
