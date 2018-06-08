/**
 * Created by A on 7/18/17.
 */
'use strict';
const Manager                   = require('../manager/User');
const Joi                       = require('joi');
const Response                  = require('./response').setup(Manager);
const verifyUniqueUser          = require('../utils/userFunctions').verifyUniqueUser;
const verifyCredentials         = require('../utils/userFunctions').verifyCredentials;
const createToken               = require('../utils/token');
const User                      = require('../model/User');

module.exports = {
    getUser : {
        tags: ['api', 'User'],
        description: 'get users',
        handler: (req, res) => {
            Response(req, res, 'getUser');
        },
        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt',
            // scope: ['admin']
        }
    },
    postUser: {
        tags: ['api', 'User'],
        description: 'create users',
        pre: [
            { method: verifyUniqueUser }
        ],
        validate: {
            payload: Joi.object({
                username: Joi.string().alphanum().min(2).max(30).required(),
                email   : Joi.string().email().required(),
                password: Joi.string().required()
            })
        },
        handler: function (req, res) {
            Response(req, res, 'postUser');
        },
    },
    postAuthenticate: {
        tags: ['api', 'User'],
        description: 'Authenticate',
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        handler: (req, res) => {
            // If the user's password is correct, we can issue a token.
            // If it was incorrect, the error will bubble up from the pre method
            res({ id_token: createToken(req.pre.user) }).code(201);
        },
        validate: {
            payload: Joi.alternatives().try(
                Joi.object({
                    username: Joi.string().alphanum().min(2).max(30).required(),
                    password: Joi.string().required()
                }),
                Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            )
        }
    }
}