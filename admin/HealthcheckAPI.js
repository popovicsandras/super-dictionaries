'use strict';
class HealthcheckAPI {

    constructor() {
    }

    install(app) {
        app.get('/admin/healthcheck', this.get.bind(this));
    }

    get(request, response) {
        var healthcheck = {};

        // Add your own code here

        response.status(200);
        response.send(healthcheck);
    }
}

module.exports = HealthcheckAPI;
