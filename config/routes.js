/**
 * Created by A on 7/18/17.
 */
'use strict';
const User = require('../route/User');

module.exports = [
    { method: 'POST', path: '/users', config : User.postUser},
    { method: 'GET', path: '/users', config : User.getUser},
    { method: 'POST', path: '/authenticate', config : User.postAuthenticate},
];