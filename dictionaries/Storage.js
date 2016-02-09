'use strict';

var Q = require('q');

class DictionariesStorage {

    constructor(config, options) {
        this.dictionaries = options.monk(config.database.url).get('dictionaries');
    }

    willGet(selector) {
        //this.dictionaries.findOne(selector);
        //return {
        //    then: function() {},
        //    catch: function() {}
        //};

        var deferred = Q.defer();
        this.dictionaries.findOne(selector)
            .then(function() {
                deferred.resolve();
            });

        return deferred.promise;
    }
}

module.exports = DictionariesStorage;
