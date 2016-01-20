/* global beforeEach, describe, it, expect, sinon */

'use strict';

var CreateUpdate = require('../../dictionaries/CreateUpdate');

describe('CreateUpdate', function() {

    var createUpdate,
        config,
        app;

    before(function() {
        config = {};
        app = {
            put: sinon.spy()
        };
    });

    beforeEach(function() {
        createUpdate = new CreateUpdate(config, {});
    });

    it('should attach endpoint', function() {
        // Act
        createUpdate.install(app);

        // Assert
        expect(app.put).has.been.calledWith('/api/:scope/:uuid/dictionaries/:name.json');
    });

});
