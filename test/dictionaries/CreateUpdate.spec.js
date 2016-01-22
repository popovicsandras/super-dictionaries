/* global beforeEach, describe, it, expect, sinon */

'use strict';

var CreateUpdate = require('../../dictionaries/CreateUpdate'),
    Dictionaries = require('../../dictionaries/Dictionaries'),
    co = require('co');

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

        afterEach(function(done) {
            Dictionaries.remove({
                    scope: request.params.scope,
                    uuid: request.params.uuid,
                    name: request.params.name
                })
                .then(function() {done();}, function() {done();});
        });

        function readBackData(request, done) {
            co(function* () {
                try {
                    var dictionaries = yield Dictionaries.find({
                        scope: request.params.scope,
                        uuid: request.params.uuid,
                        name: request.params.name
                    });

                    expect(dictionaries.length).to.be.equal(1);
                    expect(dictionaries[0].body).to.be.eql(request.body.content);
                    done();
                }
                catch (e) {
                    done(e);
                }
            });
        }

        function clone(object) {
            return JSON.parse(JSON.stringify(object));
        }

        it('should save new data to mongo', function(done) {
            co(function* () {
                yield createUpdate._processRequest(request, response);
                readBackData(request, done)
            });
        });

        it('should update existing data previously stored in mongo', function(done) {

            var updateRequest = clone(request);
            updateRequest.body.content = '{anotherProperty: "ciccio"}' + random;

            createUpdate
                ._processRequest(request, response).next().value
                .then(readBackData.bind(this, request, function() {}), done)
                .then(function () {
                    return createUpdate._processRequest(updateRequest, response).next().value;
                })
                .then(readBackData.bind(this, updateRequest, done), done);
        });

        it('should send status code 200 as response', function(done) {

            var generator = createUpdate._processRequest(request, response)

            generator.next().value
                .then(function() {
                    return generator.next().value;
                })
                .then(function() {
                    try {
                        expect(response.status).to.have.been.calledWith(200);
                        expect(response.end).to.have.been.called;
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                }, done);

        });
    });
});
