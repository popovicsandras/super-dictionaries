'use strict';

var SupaDupaMixin = {
    monk: require('monk'),
    config: require('config'),

    getCollection: function() {
        var db = this.monk(this.config.database.url);
        return db.get('dictionaries');
    },

    validateScope: function() {

    }
};

module.exports = SupaDupaMixin;