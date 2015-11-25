'use strict';

var http = require('http');
var VersionAPI = require('./admin/VersionAPI');
var Healthcheck = require('./admin/HealthcheckAPI');
var CreateUpdate = require('./dictionaries/CreateUpdate');
var Cirrus = require('@workshare/nodejs-cirrus-auth');

var log4js = require('log4js-config');

var swaggerUiMiddleware = require('swagger-ui-middleware');

class HelloEndpoint {
    install(app) {
        app.get('/hello', function(request, response) {
            response.status(200).send('hello');
        })
    }
}


class Log4jsConfigLoggerFactory {
    get (name) {
        return require('log4js-config').get(name);
    }
}

class LoggerFactory {
    var logger = new Logger();

    get (name) {
        return logger;
    }
}

class Logger {
    debug (args) {
    }

    info (args) {
    }

    warning (args) {
    }

    error (args) {
    }

    fatal (args) {
    }
}

class Service {

    constructor(config, options) {

        options.loggerFactory = options.loggerFactory || new LoggerFactory();

        this.versionAPI  = options.versionAPI || new VersionAPI(config, options);
        this.healthcheckAPI = options.healthcheckAPI || new Healthcheck(config, options);
        this.cirrusMiddleware = options.cirrusMiddleware || new Cirrus.Middleware(config, options);

        this.createUpdate = options.createUpdate || new CreateUpdate(config, options);
        this.delete = options.delete || new HelloEndpoint(config, options);
        this.get = options.get || new HelloEndpoint(config, options);
        this.list = options.list || new HelloEndpoint(config, options);
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

        this.cirrusMiddleware.install(app);
        this.createUpdate.install(app);
        this.delete.install(app);
        this.list.install(app);
        this.get.install(app);

        var port = this.configuration.port;
        var server = http.createServer(app);
        server.listen(port, function() {
            log.info('Service started on port', port);
        });

        return server;
    }
}

module.exports = Service;
