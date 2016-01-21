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

        var request,
            response;

        function readBackData(request, done) {
            dictionaries.findOne({
                scope: request.params.scope,
                uuid: request.params.uuid,
                name: request.params.name
            })
            .then(function(dictionary) {
                try {
                    expect(dictionary.content).to.be.eql(request.content);
                    done();
                }
                catch (e) {
                    done(e);
                }
            }, done);
        }

        it('should save new data to mongo', function(done) {

            // Arrange
            var random =  + Math.random();
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

            // Act
            createUpdate
                ._processRequest(request, response)
                // Assert
                .then(readBackData.bind(this, request, done));
        });
    });
});
