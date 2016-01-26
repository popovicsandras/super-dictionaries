/* global beforeEach, describe, it, expect, sinon */

'use strict';

require('mocha-generators').install();

var CreateUpdate = require('../../dictionaries/CreateUpdate'),
    dictionaries = require('../../dictionaries/Dictionaries');

describe('CreateUpdate', function() {

    var createUpdate,
        options,
        dummyApp;

    beforeEach(function() {
        options = {};
        dummyApp = {
            put: function(endPoint, handler) {
                this.handler = handler;
            },
            makeRequest: function(request, response) {
                this.handler(request, response);
            }
        };
        sinon.spy(dummyApp, 'put');
    });

    describe('Install', function() {

        it('should attach endpoint', function() {

            createUpdate = new CreateUpdate();

            createUpdate.install(dummyApp);

            expect(dummyApp.put).has.been.calledWith('/api/:scope/:uuid/dictionaries/:name.json');
        });
    });

    describe('Logging', function() {

        it('should get the correct logger from LoggerFactory', function() {

            var loggerFactory = {
                get: sinon.spy()
            };
            options.loggerFactory = loggerFactory;

            // Act
            createUpdate = new CreateUpdate(options);

            // Assert
            expect(loggerFactory.get).to.have.been.calledWith('dictionaries.createupdate');
        });
    });

    describe('Making a request', function() {

        var request,
            response,
            updatePromise,
            resolveUpdatePromise;

        beforeEach(function() {

            options = {
                dictionaries: {
                    update: function() {
                        updatePromise = new Promise(function(resolve) {
                            resolveUpdatePromise = resolve;
                        });
                        return updatePromise;
                    }
                }
            };
            sinon.spy(options.dictionaries, 'update');

            request = {
                params: {
                    scope: 'test scope',
                    uuid: 'test uuid',
                    name: 'test name'
                },
                body: {
                    content: 'test content'
                }
            };

            response = {
                status: function() {
                    return response;
                },
                end: sinon.spy()
            };

            sinon.spy(response, 'status');
        });

        it('should call Dictionaries collection\'s update method with proper parameters', function() {

            var expectedDocument = {
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name,
                content: request.body.content
            };

            createUpdate = new CreateUpdate(options);
            createUpdate.install(dummyApp);

            dummyApp.makeRequest(request, response);

            expect(options.dictionaries.update).to.have.been.calledWith(
                request.params,
                expectedDocument,
                {upsert: true}
            );
        });

        it('should not response until Dictionaries.update finished', function* () {

            createUpdate = new CreateUpdate(options);
            createUpdate.install(dummyApp);

            dummyApp.makeRequest(request, response);

            expect(response.status).to.have.not.been.called;
            expect(response.end).to.have.not.been.called;
        });

        it('should response with 200 status code only after Dictionaries.update succeeded', function* () {

            createUpdate = new CreateUpdate(options);
            createUpdate.install(dummyApp);

            dummyApp.makeRequest(request, response);

            resolveUpdatePromise();
            yield updatePromise;

            expect(response.status).to.have.been.calledWith(200);
            expect(response.end).to.have.been.called;
        });

        it('should response with 400 status code if the request parameter are incorrect', function() {

            createUpdate = new CreateUpdate(options);
            createUpdate.install(dummyApp);

            dummyApp.makeRequest({}, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.end).to.have.been.called;
        });
    });


    describe.skip('Learning tests [requires DB]', function() {

        var random,
            request,
            response;

        beforeEach(function() {
            random =  + Math.random();
            request = {
                params: {
                    scope: 'test scope' + random,
                    uuid: '123456789' + random,
                    name: 'dictionary name' + random
                },
                body: {
                    content: '{whatever: "retek"}' + random
                }
            };

            response = {
                status: function() {
                    return response;
                },
                end: sinon.spy()
            };

            sinon.spy(response, 'status');
            createUpdate = new CreateUpdate();
        });

        afterEach(function* () {
            yield dictionaries.remove({
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            });
        });

        function* assertSavedData (request) {
            var foundDictionaries = yield dictionaries.find({
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            });

            expect(foundDictionaries.length).to.be.equal(1);
            expect(foundDictionaries[0].content).to.be.eql(request.body.content);
        }

        it('should save new data to mongo', function* () {
            yield createUpdate._processRequest(request, response);
            yield assertSavedData(request);
        });

        it('should update existing data previously stored in mongo', function* () {

            yield createUpdate._processRequest(request, response);

            request.body.content = '{anotherProperty: "ciccio"}' + random;
            yield createUpdate._processRequest(request, response);
            yield assertSavedData(request);
        });

        it('should send status code 200 as response', function* () {

            yield createUpdate._processRequest(request, response);
            expect(response.status).to.have.been.calledWith(200);
            expect(response.end).to.have.been.called;
        });
    });
});
