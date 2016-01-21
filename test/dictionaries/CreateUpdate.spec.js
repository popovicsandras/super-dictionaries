/* global beforeEach, describe, it, expect, sinon */

'use strict';

var CreateUpdate = require('../../dictionaries/CreateUpdate'),
    dictionaries = require('../../dictionaries/Dictionaries');

describe('CreateUpdate', function() {

    var createUpdate,
        config,
        app;

    beforeEach(function() {
        config = {};
        app = {
            put: sinon.spy()
        };
    });

    beforeEach(function() {
        createUpdate = new CreateUpdate(config, {});
    });

    it('should attach endpoint', function() {
        // Act
        createUpdate.install(app);

        // Assert
        expect(app.put).has.been.calledWith('/api/:scope/:uuid/dictionaries/:name.json');
    });

    describe('Learning tests', function() {

        var random,
            request;

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
        });

        afterEach(function(done) {
            dictionaries.remove({
                    scope: request.params.scope,
                    uuid: request.params.uuid,
                    name: request.params.name
                })
                .then(function() {done();}, function() {done();});
        });

        function readBackData(request, done) {
            return dictionaries.find({
                    scope: request.params.scope,
                    uuid: request.params.uuid,
                    name: request.params.name
                })
                .then(function(dictionaries) {
                    try {
                        expect(dictionaries.length).to.be.equal(1);
                        expect(dictionaries[0].body).to.be.eql(request.body.content);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                }, done);
        }

        function clone(object) {
            return JSON.parse(JSON.stringify(object));
        }

        it('should save new data to mongo', function(done) {

            // Act
            createUpdate
                ._processRequest(request)
                // Assert
                .then(readBackData.bind(this, request, done), done);
        });

        it('should update existing data previously stored in mongo', function(done) {

            // Arrange
            var updateRequest = clone(request);
            updateRequest.body.content = '{anotherProperty: "ciccio"}' + random;

            createUpdate
                ._processRequest(request)
                .then(readBackData.bind(this, request, function() {}), done)
                .then(createUpdate._processRequest.bind(createUpdate, updateRequest))
                .then(readBackData.bind(this, updateRequest, done), done);
        });
    });
});
