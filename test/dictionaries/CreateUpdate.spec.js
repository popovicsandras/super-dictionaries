/* global beforeEach, describe, it, expect, sinon */

'use strict';

require('mocha-generators').install();

var CreateUpdate = require('../../dictionaries/CreateUpdate'),
    Dictionaries = require('../../dictionaries/Dictionaries'),
    Q = require('q');

describe('CreateUpdate', function() {

    var createUpdate,
        options,
        dummyApp;

    beforeEach(function() {
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

    describe('Making a request', function() {

        var request,
            response,
            updatePromise;

        beforeEach(function() {

            options = {
                Dictionaries: {
                    update: function() {
                        updatePromise = Q.defer();
                        return updatePromise.promise;
                    }
                }
            };
            sinon.spy(options.Dictionaries, 'update');

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

            expect(options.Dictionaries.update).to.have.been.calledWith(
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

            // Resolve update promise, to let the generator continue form suspended state
            updatePromise.resolve();
            // Dirty hack: with this we can wait until the next queue frame
            yield Promise.resolve();

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


    describe.skip('Learning tests', function() {

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

        });

        afterEach(function* () {
            yield Dictionaries.remove({
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            });
        });

        function* assertSavedData (request) {
            var dictionaries = yield Dictionaries.find({
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            });

            expect(dictionaries.length).to.be.equal(1);
            expect(dictionaries[0].body).to.be.eql(request.body.content);
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
