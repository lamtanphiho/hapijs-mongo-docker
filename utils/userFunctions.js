/**
 * Created by A on 7/18/17.
 */
'use strict';

const Boom = require('boom');
const User = require('../model/User');
const bcrypt = require('bcrypt');

function verifyUniqueUser(req, res) {
    // Find an entry from the database that
    // matches either the email or username
    User.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    }, (err, user) => {
        if(err) res(err);
        // Check whether the username or email
        // is already taken and error out if so
        else if (user) {
            if (user.username === req.payload.username) {
                res(Boom.badRequest('Username taken'));
            }
            if (user.email === req.payload.email) {
                res(Boom.badRequest('Email taken'));
            }
        }
        // If everything checks out, send the payload through
        // to the route handler
        res(req.payload);
    });
}

function verifyCredentials(req, res) {

    const password = req.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    User.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    }, (err, user) => {
        if(err) res(err);
        if (user) {
            bcrypt.compare(password, user.password, (err, isValid) => {
                if(err) res(err);
                if (isValid) {
                    res(user);
                }
                else {
                    res(Boom.badRequest('Incorrect password!'));
                }
            });
        } else {
            res(Boom.badRequest('Incorrect username or email!'));
        }
    });
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    verifyCredentials: verifyCredentials
}