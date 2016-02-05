'use strict';

var Storage = require('../../dictionaries/Storage');

describe('Storage', function() {

    describe('Creation', function() {

        var config,
            monk,
            db;

        beforeEach(function() {
            config = {
                    database: {
                        url: 'retek'
                    }
                };
            monk = function() {
                db = {
                    get: sinon.spy()
                };

                return db;
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
});
