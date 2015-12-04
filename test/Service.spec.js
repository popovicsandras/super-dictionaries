/* jshint expr: true */
/* global afterEach, describe, it, sinon, expect */

'use strict';

var supertest = require('supertest');
var express = require('express');

var Service = require('../Service');
var VersionAPI = require('../admin/VersionAPI');
var HealthcheckAPI = require('../admin/HealthcheckAPI');
var Cirrus = require('@workshare/nodejs-cirrus-auth');

describe('Service', function() {

    var app;

    afterEach(function() {
        if (app) {
            app.close();
        }
    });

    it('should call versionAPI at /admin/version endpoint' , function(done) {

        var config = {port:1234, database: {url: ''}, environment:'foo'};
        var options = {};
        var versionAPI = new VersionAPI(config, options);
        var versionAPIGet = sinon.spy(versionAPI, 'get');

        app = new Service(config, {versionAPI: versionAPI}).start(express());

        supertest(app)
            .get('/admin/version')
            .expect(function() {
                expect(versionAPIGet).to.have.been.called;
            })
            .end(done);
    });

    it('should call healthcheckAPI at /admin/healthcheck endpoint' , function(done) {

        var config = {port:1234, database: {url: ''}, environment:'foo'};
        var healthcheckAPI = new HealthcheckAPI();
        var healthcheckAPIGet = sinon.spy(healthcheckAPI, 'get');

        app = new Service(config, {healthcheckAPI: healthcheckAPI}).start(express());

        supertest(app)
            .get('/admin/healthcheck')
            .expect(function() {
                expect(healthcheckAPIGet).to.have.been.called;
            })
            .end(done);
    });

    it('should not use the Cirrus authentication middleware on admin endpoints', function(done) {

        var config = {port:1234, database: {url: ''}, environment:'foo'};
        var cirrusMiddleware = new Cirrus.Middleware(config, {});

        cirrusMiddleware.filter = sinon.spy();

        app = new Service(config, {cirrusMiddleware: cirrusMiddleware}).start(express());

        supertest(app)
            .get('/admin/healthcheck')
            .expect(function() {
                expect(cirrusMiddleware.filter).to.not.have.been.called;
            })
            .end(done);
    });

    describe('Cirrus middleware', function() {

        function shouldInvokeCirrusBefore(apiName, done) {

            var config = {port:1234, database: {url: ''}, environment:'foo'};
            var cirrusMiddleware = new Cirrus.Middleware(config, {});

            sinon.stub(cirrusMiddleware, 'filter', function(request, response, next) {
                next();
            });

            var options = {
                cirrusMiddleware: cirrusMiddleware
            };

            options[apiName] = {
                install: function(app) {
                    app.get('/foo', function(req, res) {
                        res.status(200).send('');
                    });
                }
            };

            app = new Service(config, options).start(express());

            supertest(app)
                .get('/foo')
                .expect(function() {
                    expect(cirrusMiddleware.filter).to.have.been.called;
                })
                .end(done);

        }

        it('should be called before createUpdate endpoint', function(done) {
            shouldInvokeCirrusBefore('createUpdate', done);
        });

        it('should be called before delete endpoint', function(done) {
            shouldInvokeCirrusBefore('delete', done);
        });

        it('should be called before list endpoint', function(done) {
            shouldInvokeCirrusBefore('list', done);
        });

        it('should be called before get endpoint', function(done) {
            shouldInvokeCirrusBefore('get', done);
        });
    });
});
