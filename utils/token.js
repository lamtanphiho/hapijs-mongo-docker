/**
 * Created by A on 7/18/17.
 */
'use strict';

const jwt       = require('jsonwebtoken');
const AppConfig = require('../config/app');

function createToken(user) {
    let scopes;
    // Check if the user object passed in
    // has admin set to true, and if so, set
    // scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }
    // Sign the JWT
    return jwt.sign({
            id: user._id,
            username: user.username,
            scope: scopes
        },
        AppConfig.jwt.secret,
        {
            algorithm: 'HS256',
            expiresIn: AppConfig.jwt.expiresIn
        }
    );
}

module.exports = createToken;