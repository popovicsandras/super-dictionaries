'use strict';

var monk = require('monk'),
    config = require('config');

var db = monk(config.database.url);
var collection = db.get('dictionaries');

module.exports = collection;
