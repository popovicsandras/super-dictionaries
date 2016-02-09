'use strict';

var Storage = require('../../dictionaries/Storage');

describe('Storage', function() {

    var config,
        monk,
        db,
        storage,
        options;

    beforeEach(function() {

        config = {
            database: {
                url: 'retek'
            }
        };
    });

    describe('Creation', function() {

        beforeEach(function() {

            monk = function() {
                db = {
                    get: sinon.spy()
                };

                return db;
            };

            options = {
                monk: monk
            };
        });

        it('should get the database from monk', function() {

            var options = {
                monk: monk
            };
            sinon.spy(options, 'monk');

            var storage = new Storage(config, options);

            expect(options.monk).to.have.been.calledWith('retek');
        });

        it('should get the proper collection from database', function() {

            var storage = new Storage(config, {monk: monk});

            expect(db.get).to.have.been.calledWith('dictionaries');
        });
    });

    describe('willGet', function() {

        var dictionaries;

        beforeEach(function() {
            dictionaries = {
                findOne: sinon.spy()
            };

            monk = function() {
                db = {
                    get: function() {
                        return dictionaries;
                    }
                };

                return db;
            };

            options = {
                monk: monk
            };
        });

        it('should invoke the collections\'s proper method with proper parameters' , function() {

            storage = new Storage(config, options);

            var selector = {
                foo: 'bar'
            };

            storage.willGet(selector);

            expect(dictionaries.findOne).to.have.been.calledWith(selector);
        });

        it('should return a promise' , function() {

            storage = new Storage(config, options);

            var selector = {};

            var promise = storage.willGet(selector);

            expect(promise).to.respondTo('then');
            expect(promise).to.respondTo('catch');
        });

        it.only('should translate mongo promise result to have catch method', function(done) {

            storage = new Storage(config, options);

            var successCallback,
                findOneFunction = function() {
                    return {
                        then: function(successCb) {
                            successCallback = successCb;
                        }
                    };
                };

            dictionaries.findOne = findOneFunction;

            var promise = storage.willGet({});
            sinon.spy(promise, 'then');

            successCallback();

            setTimeout(function() {
                expect(promise.then).to.have.been.called;
                done();
            }, 0);

        });

    });
});
