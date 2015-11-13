/* global beforeEach, describe, it, expect, sinon */

'use strict';

var HealthcheckAPI = require('../../admin/HealthcheckAPI');
var async = require('async');
var Q = require('q');

describe('HealthcheckAPI', function() {

    var healthcheckAPI,
        config,
        request,
        response,
        cirrus,
        tokens,
        app;

    before(function() {
        config = {};
        request = {};
        response = {};

        app = {
            get: sinon.spy()
        }
    });

    beforeEach(function() {
        healthcheckAPI = new HealthcheckAPI(config, cirrus, tokens);
    });

    it('should attach endpoints', function() {
        // Act
        healthcheckAPI.install(app);

        // Assert
        expect(app.get).has.been.calledWith('/admin/healthcheck');
    });

});
