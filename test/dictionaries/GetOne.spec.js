/* global beforeEach, describe, it, expect, sinon */

'use strict';

var GetOne = require('../../dictionaries/GetOne');


describe('getOne', function () {

    var getOne,
        app,
        config,
        options,
        request,
        response,
        storage;
    

    before(function(){

        app = {
            get: sinon.spy()
        }
    });

    beforeEach(function(){
        storage = {};
        config = {};
        options = {storage: storage};
        request = {};
        response = {};

        getOne = new GetOne(config, options);

    });

    
    
    it('should install the endpoint', function() {
    
        getOne.install(app);
        
        expect(app.get).has.been.calledWith(
			'/api/v1.0/:scope/:uuid/dictionaries/:name.json'
    	);
        
    });
    
    it('should bind the right context', function() {
        
        getOne.processRequest.bind = sinon.spy();
        
        getOne.install(app);

        expect(getOne.processRequest.bind).has.been.calledWith(app);
    });

    describe('processRequest', function(){
        it('should invoke willGet', function() {
            storage.willGet = sinon.spy();

            getOne.processRequest(request, response);

            expect(storage.willGet).has.been.called;
        });
    })
    
    
    
    
});