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
        storage,
        loggerFactory;

    beforeEach(function(){

        loggerFactory = {
            get: sinon.spy()
        };
        storage = {};
        config = {};
        options = {storage: storage, loggerFactory: loggerFactory};
        request = {};
        response = {};

        getOne = new GetOne(config, options);

    });

    describe('Install', function() {

        beforeEach(function(){
            app = {
                get: sinon.spy()
            }
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
    });

    describe('Logging', function() {

        it('should get the correct logger from LoggerFactory', function() {
            expect(loggerFactory.get).to.have.been.calledWith('dictionaries.api.getone');
        });
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
            response.json = sinon.spy();

            willGetPromise = makeSynchronous(Q.defer());
            storage.willGet = function() {
                return willGetPromise.promise;
            };
        });

        function makeSynchronous(promise) {

            var originalResolve = promise.resolve,
                originalReject = promise.reject;

            promise.resolve = function(data) {
                originalResolve.call(promise, data);
                mockPromises.tick(9);
            };

            promise.reject = function(data) {
                originalReject.call(promise, data);
                mockPromises.tick(9);
            };

            return promise;
        }

        afterEach(function() {
            mockPromises.reset();
        });

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
            willGetPromise.resolve(dictionary);

            expect(response.status).to.have.been.calledWith(200);
        });

        it('should respond with the proper dictionary when dictionary is found', function() {

            var dictionary = {foo: 'bar'};

            getOne.processRequest(request, response);
            willGetPromise.resolve(dictionary);

            expect(response.json).to.have.been.calledWith(dictionary);
        });

        it('should respond with 404 when dictionary is not found', function() {

            var dictionary = null;

            getOne.processRequest(request, response);
            willGetPromise.resolve(dictionary);

            expect(response.status).to.have.been.calledWith(404);
        });

        it('should respond with 500 when shit happens', function() {

            getOne.processRequest(request, response);
            willGetPromise.reject();

            expect(response.status).to.have.been.calledWith(500);
        });

        it('should log the shit when it happens', function() {

            var error = {shit: true};
            getOne.log = {
                error: sinon.spy()
            };

            getOne.processRequest(request, response);
            willGetPromise.reject(error);

            expect(getOne.log.error).to.have.been.calledWithMatch({});
        });
    })
});
