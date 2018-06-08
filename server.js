/**
 * Created by A on 7/18/17.
 */
'use strict'
const Logger    = require('./utils/logging');
const Glue      = require('glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const AppConfig = require('./config/app');
const mongoose  = require('mongoose');
const dbUrl     = require('./config/mongodb');


Glue.compose(Manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
        throw err;
    }
    server.start(() => {
        Logger.info('Server running at:', server.info.uri);
        mongoose.connection.openUri(dbUrl.connectString, function (err) {
            if(err) Logger.error("Can't connect to MongoDB !!!");
            else Logger.info("Connect MongoDB success !!!");
        });
    });
    server.auth.strategy('jwt', 'jwt', {
        key: AppConfig.jwt.secret,
        verifyOptions: { algorithms: ['HS256'] }
    });
    server.route (Routes);

});