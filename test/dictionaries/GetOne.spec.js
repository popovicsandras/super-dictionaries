/* global beforeEach, describe, it, expect, sinon */

'use strict';

var GetOne = require('../../dictionaries/GetOne'),
    mockPromises = require('mock-promises'),
    Q = require('q');


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

        var willGetPromise;

        beforeEach(function() {

            mockPromises.install(Q.makePromise);

            request.params = {
                scope: 'scope',
                uuid: 'uuid',
                name: 'name',
                foo: 'foo'
            };
            response.status = sinon.spy();

            willGetPromise = Q.defer();
            storage.willGet = function() {
                return willGetPromise.promise;
            };
        });

        afterEach(function() {
            mockPromises.reset();
        });

        function resolve(promise, args) {
            promise.resolve(args);
            mockPromises.tick(0);
        }

        it('should invoke willGet', function() {

            sinon.spy(storage, 'willGet');

            getOne.processRequest(request, response);

            expect(storage.willGet).has.been.calledWith({
                scope: 'scope',
                uuid: 'uuid',
                name: 'name'
            });
        });

        it('should respond with 200 when dictionary is found', function() {

            var dictionary = {foo: 'bar'};

            getOne.processRequest(request, response);

            resolve(willGetPromise, dictionary);
            expect(response.status).to.have.been.calledWith(200);
        });

        it('should respond with 404 when dictionary is not found', function() {

            var dictionary = null;

            getOne.processRequest(request, response);

            resolve(willGetPromise, dictionary);
            expect(response.status).to.have.been.calledWith(404);
        });
    })
});