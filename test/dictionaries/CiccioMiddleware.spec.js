/* global beforeEach, describe, it, expect, sinon */

'use strict';

class CiccioMiddleware {

    filter(request, response, next) {
        if ('accounts' === request.params.scope) {
            var currentAccountIsRequested = 'current' === request.params.uuid,
                validAccountIsRequested = request.user.account.uuid === request.params.uuid;

            if (validAccountIsRequested || currentAccountIsRequested) {
                next();
            } else {
                response.sendStatus(403);
            }
            return;
        }
        response.sendStatus(400);
    }
}

// user.account.uuid, user.uuid

describe('CiccioMiddleware', function() {

    var request,
        response,
        next,
        ciccio;

    beforeEach(function() {
        request = {
            params: {}
        };

        response = {
            sendStatus: sinon.spy()
        };

        next = sinon.spy();

        ciccio = new CiccioMiddleware();
    });

    it('should send "Bad Request" on invalid scope', function() {

        request.params.scope = 'invalid';

        ciccio.filter(request, response, next);

        expect(next).to.have.not.been.called;
        expect(response.sendStatus).to.have.been.calledWith(400);
    });

    it('should send unauthorized in case of invalid account', function() {

        request.params.scope = 'accounts';
        request.params.uuid = '1';

        request.user = {
            account: {
                uuid: '2'
            }
        };

        ciccio.filter(request, response, next);

        expect(next).to.have.not.been.called;
        expect(response.sendStatus).to.have.been.calledWith(403);
    });

    it('should authorize in case of valid account', function() {

        request.params.scope = 'accounts';
        request.params.uuid = '1';

        request.user = {
            account: {
                uuid: '1'
            }
        };

        ciccio.filter(request, response, next);

        expect(next).to.have.been.called;
        expect(response.sendStatus).to.have.not.been.called;
    });

    it('should authorize in case of current account', function() {

        request.params.scope = 'accounts';
        request.params.uuid = 'current';

        request.user = {
            account: {
                uuid: 'whatever'
            }
        };

        ciccio.filter(request, response, next);

        expect(next).to.have.been.called;
        expect(response.sendStatus).to.have.not.been.called;
    });
});