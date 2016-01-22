'use strict';

class CreateUpdate{

    install(app) {
        app.put('/api/:scope/:uuid/dictionaries/:name.json');
    }
}

module.exports = CreateUpdate;
