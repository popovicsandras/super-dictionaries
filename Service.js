'use strict';

var http = require('http');
var VersionAPI = require('./admin/VersionAPI');
var Healthcheck = require('./admin/HealthcheckAPI');

var log = require('log4js-config').get('app');

var swaggerUiMiddleware = require('swagger-ui-middleware');

class Service {

    constructor(configuration, versionAPI, healthcheckAPI) {
        this.configuration = configuration;
        this.versionAPI  = versionAPI || new VersionAPI();
        this.healthcheckAPI = healthcheckAPI || new Healthcheck(this.configuration);
    }

    start(app) {
        // how do we test this?
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());

        // how do we test this?
        var bodyParser  = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // how do we test this?
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        this.versionAPI.install(app);
        this.healthcheckAPI.install(app);

        var port = this.configuration.port;
        var server = http.createServer(app);
        server.listen(port, function() {
            log.info('Service started on port', port);
        });

        return server;
    }
}

module.exports = Service;
