/* global beforeEach, describe, it, expect, sinon */

'use strict';

var GetOne = require('../../dictionaries/GetOne');


describe('getOne', function () {

    var getOne,
        app;


    before(function(){
        app = {
            get: sinon.spy()
        }
    });

    beforeEach(function(){

        getOne = new GetOne();

    });

    it('should install the endpoint', function() {
    
        getOne.install(app)

    });
    
});