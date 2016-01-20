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

        beforeEach(function() {
            app.put = function(endPoint, action) {
                action(request, response);
            }
        });

        it.skip('should save data to mongo', function(done) {

            // Arrange
            request = {
                scope: 'test scope',
                uuid: '123456789',
                name: 'dictionary name',
                body: '{whatever: "retek"}'
            };

            // Act
            createUpdate.install(app);


            // Assert
            var dictionary = dictionaries.findOne({
                    scope: request.scope,
                    uuid: request.uuid,
                    name: request.name
                });
                dictionary.then(function(dictionary) {
                    expect(dictionary.body).to.be.eql(request.body);
                    done();
                });
                dictionary.finally(done);
                //.done(done)
        });
    });
});
