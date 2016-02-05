'use strict';

class DictionariesStorage {

    constructor(config, options) {
        options.monk(config.database.url).get('dictionaries');
    }

}

module.exports = DictionariesStorage;
