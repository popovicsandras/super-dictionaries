/* jshint expr: true */
/* global afterEach, describe, it, sinon, expect */

'use strict';

var supertest = require('supertest');
var express = require('express');

var Service = require('../Service');
var VersionAPI = require('../admin/VersionAPI');
var HealthcheckAPI = require('../admin/HealthcheckAPI');

describe('Service', function() {

    var app;

    afterEach(function() {
        if (app) {
            app.close();
        }
    });

    it('should call versionAPI at /admin/version endpoint' , function(done) {

        var config = {'port':1234};
        var versionAPI = new VersionAPI();
        var versionAPIGet = sinon.spy(versionAPI, 'get');

        app = new Service(config, versionAPI, null).start(express());

        supertest(app)
            .get('/admin/version')
            .expect(function() {
                expect(versionAPIGet).to.have.been.called;
            })
            .end(done);
    });

    it('should call healthcheckAPI at /admin/healthcheck endpoint' , function(done) {

        var config = {'port':1234};
        var healthcheckAPI = new HealthcheckAPI();
        var healthcheckAPIGet = sinon.spy(healthcheckAPI, 'get');

        app = new Service(config, null, healthcheckAPI).start(express());

        supertest(app)
            .get('/admin/healthcheck')
            .expect(function() {
                expect(healthcheckAPIGet).to.have.been.called;
            })
            .end(done);
    });
});
