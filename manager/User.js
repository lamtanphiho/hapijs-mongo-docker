/**
 * Created by A on 7/18/17.
 */
'use strict';
const User          = require('../model/User');
const createToken   = require('../utils/token');
const bcrypt        = require('bcrypt');
const Boom          = require('boom');

function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        if(!err){
            bcrypt.hash(password, salt, (err, hash) => {
                return cb(err, hash);
            });
        }

    });
}


module.exports = {
    getUser : function (req) {
        const condition = {};
        if(typeof req.params.userId != 'undefined') condition._id = req.params.userId;
        return User.find(condition).select('-password -__v').exec();
    },
    postUser: function (req) {
        const user      = new User();
        user.email      = req.payload.email;
        user.username   = req.payload.username;
        user.admin      = false;
        return new Promise(function (resolve, reject) {
            // return resolve(user)
            hashPassword(req.payload.password, (err, hash) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                user.password = hash;
                user.save((err, user) => {
                    if (err) {
                        throw Boom.badRequest(err);
                    }
                    // If the user is saved successfully, issue a JWT

                    return resolve({ id_token: createToken(user), statusCode: 201 })
                });
            });
        })

    },
};