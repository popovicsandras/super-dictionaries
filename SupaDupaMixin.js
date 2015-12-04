'use strict';

var SupaDupaMixin = {
    monk: require('monk'),
    config: require('config'),

    getCollection: function() {
        var db = this.monk(this.config.database.url);
        console.log('db: '+db);
        var collection = db.get('dictionaries');
        console.log('collection: '+collection);
        return collection;
    },

    validateScope: function() {

    }
};

module.exports = SupaDupaMixin;