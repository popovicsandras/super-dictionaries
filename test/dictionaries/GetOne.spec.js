/* global beforeEach, describe, it, expect, sinon */

'use strict';

var GetOne = require('../../dictionaries/GetOne');


describe('getOne', function () {

    var getOne,
        app;

    

    before(function(){
        app = {
            get: sinon.spy()
        }
    });

    beforeEach(function(){

        getOne = new GetOne();

    });

    
    
    it('should install the endpoint', function() {
    
        getOne.install(app);
        
        expect(app.get).has.been.calledWith(
			'/api/v1.0/:scope/:uuid/dictionaries/:name.json'
    	);
        
    });
    
    it.only('should install the endpoint2', function() {
        
    	var method = getOne.processRequest;
    	console.log(method.bind);
        var boundMethod = sinon.spy(method.bind);
        method.bind(this);
//        getOne.install(app);

        expect(boundMethod).has.been.called;
//        expect(app.get).has.been.calledWith(
//			'/api/v1.0/:scope/:uuid/dictionaries/:name.json'
//    	);
        
    });
    
    
    
    
});