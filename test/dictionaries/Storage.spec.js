'use strict';

var Storage = require('../../dictionaries/Storage'),
	MockPromises = require('mock-promises'),
	Q = require('q');

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

        MockPromises.install(Q.makePromise);
    });

    afterEach(function() {
        MockPromises.reset();
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

            new Storage(config, options);

            expect(options.monk).to.have.been.calledWith('retek');
        });

        it('should get the proper collection from database', function() {

            new Storage(config, {monk: monk});

            expect(db.get).to.have.been.calledWith('dictionaries');
        });
    });

    describe('willGet', function() {

        var dictionaries,
        	pretendSuccess,
        	pretendFailure;
;
        beforeEach(function() {

            dictionaries = {};

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

            storage = new Storage(config, options);

            dictionaries.findOne = sinon.spy(function() {
                return {
                    then: function(callback) {
                    	pretendSuccess = function() {
                    		callback();
                    		MockPromises.tick();
                    	};
                    }
                };
            });

        });

        it('should invoke the collections\'s proper method with proper parameters' , function() {

            var selector = {
                foo: 'bar'
            };

            storage.willGet(selector);

            expect(dictionaries.findOne).to.have.been.calledWith(selector);
        });

        it('should return a promise' , function() {

            var promise = storage.willGet({});

            expect(promise).to.respondTo('then');
            expect(promise).to.respondTo('catch');
        });

        it('should invoke success on Q promise when findOne succeeds', function() {

            var success = sinon.spy();
            storage.willGet({}).then(success);

            pretendSuccess();

            expect(success).to.have.been.called;
        });
    });
});
