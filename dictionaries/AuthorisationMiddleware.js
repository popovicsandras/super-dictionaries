'use strict';

function accountSieve(request, response, next) {
    if ('current' === request.params.uuid) {
        request.params.uuid = request.user.account.uuid;
    }

    if (request.user.account.uuid === request.params.uuid) {
        next();
    } else {
        response.sendStatus(403);
    }
}

function userSieve(request, response, next) {
    if ('current' === request.params.uuid) {
        request.params.uuid = request.user.uuid;
    }

    if (request.user.uuid === request.params.uuid) {
        next();
    } else {
        response.sendStatus(403);
    }
}

function defaultSieve(request, response) {
    response.sendStatus(400);
}

var sieves = {
    'accounts': accountSieve,
    'users': userSieve
};

class AuthorisationMiddleware {

    filter(request, response, next) {
        var sieve = sieves[request.params.scope] || defaultSieve;
        sieve(request, response, next);
    }
}

module.exports = AuthorisationMiddleware;