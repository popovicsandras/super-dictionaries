/* global beforeEach, describe, it, expect, sinon */

'use strict';

var AuthorisationMiddleware = require('../../dictionaries/AuthorisationMiddleware');

describe('AuthorisationMiddleware', function() {

    var request,
        response,
        next,
        middleware;

    beforeEach(function() {
        request = {
            params: {}
        };

        response = {
            sendStatus: sinon.spy()
        };

        next = sinon.spy();

        middleware = new AuthorisationMiddleware();
    });

    it('should send "Bad Request" on invalid scope', function() {

        request.params.scope = 'invalid';

        middleware.filter(request, response, next);

        expect(next).to.have.not.been.called;
        expect(response.sendStatus).to.have.been.calledWith(400);
    });

    describe('Accounts', function() {

        it('should translate the uuid to the real one in case of current', function() {

            request.params.scope = 'accounts';
            request.params.uuid = 'current';
            request.user = {
                account: {
                    uuid: '2'
                }
            };

            middleware.filter(request, response, next);

            expect(request.params.uuid).to.be.equal('2');
        });

        it('should send unauthorized in case of invalid account', function() {

            request.params.scope = 'accounts';
            request.params.uuid = '1';

            request.user = {
                account: {
                    uuid: '2'
                }
            };

            middleware.filter(request, response, next);

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

            middleware.filter(request, response, next);

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

            middleware.filter(request, response, next);

            expect(next).to.have.been.called;
            expect(response.sendStatus).to.have.not.been.called;
        });

    });

    describe('Users', function() {

        it('should translate the uuid to the real one in case of current', function() {

            request.params.scope = 'users';
            request.params.uuid = 'current';
            request.user = {
                uuid: '2'
            };

            middleware.filter(request, response, next);

            expect(request.params.uuid).to.be.equal('2');
        });

        it('should send unauthorized in case of invalid user', function() {

            request.params.scope = 'users';
            request.params.uuid = '1';

            request.user = {
                uuid: '2'
            };

            middleware.filter(request, response, next);

            expect(next).to.have.not.been.called;
            expect(response.sendStatus).to.have.been.calledWith(403);
        });

        it('should authorize in case of valid user', function() {

            request.params.scope = 'users';
            request.params.uuid = '1';

            request.user = {
                uuid: '1'
            };

            middleware.filter(request, response, next);

            expect(next).to.have.been.called;
            expect(response.sendStatus).to.have.not.been.called;
        });

        it('should authorize in case of current account', function() {

            request.params.scope = 'users';
            request.params.uuid = 'current';

            request.user = {
                uuid: 'whatever'
            };

            middleware.filter(request, response, next);

            expect(next).to.have.been.called;
            expect(response.sendStatus).to.have.not.been.called;
        });
    });
});