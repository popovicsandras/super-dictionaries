/* jshint expr: true */
/* global beforeEach, describe, it, sinon, expect */

'use strict';

var SupaDupaMixin = require('../SupaDupaMixin');

describe('SupaDupaMixin', function() {

    var dbGet;

    beforeEach(function() {
        SupaDupaMixin.config = {
            database: {
                url: 'test'
            }
        };

        dbGet = sinon.spy();
        SupaDupaMixin.monk = function() {};
        sinon.stub(SupaDupaMixin, 'monk', function() {
            return {
                get: dbGet
            };
        });
    });

    it('should connect to the correct url' , function() {

        SupaDupaMixin.getCollection();

        expect(SupaDupaMixin.monk).to.have.been.calledWith('test');
    });

    it('should get the correct collection', function() {

        SupaDupaMixin.getCollection();

        expect(dbGet).to.have.been.calledWith('dictionaries');
    });

    it('should return the collection taken from db', function() {

        var collection = {};
        dbGet = function() {
            return collection;
        };

        var actualDb = SupaDupaMixin.getCollection();

        expect(actualDb).to.be.equal(collection);
    });

});
