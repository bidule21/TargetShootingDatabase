/**
 * Created by vl0w on 26/07/15.
 */
"use strict";

var mongoose = require("mongoose");

/**
 * Opens a connection to the database
 * @param {Object} parameters for connecting to the database. Provide the following values: host, name, user (optional), password (optional)
 * @param {Function} onError callback when connection failed
 * @param {Function} onOpen callback when connection is established
 */
function connect(parameters, onError, onOpen) {
    if (mongoose.connection.readyState) {
        onOpen();
    } else {
        checkParameters(parameters);

        var connectionString = buildDatabaseUrl(parameters);
        mongoose.connect(connectionString);
        var connection = mongoose.connection;

        if (onError) {
            connection.on("error", onError);
        }

        if (onOpen) {
            connection.on("open", onOpen);
        }
    }
}

function buildDatabaseUrl(parameters) {
    var mongoHost = parameters.host;
    var mongoDatabaseName = parameters.name;
    var mongoUser = parameters.user;
    var mongoPassword = parameters.password;

    var url;
    if (mongoUser && mongoPassword) {
        url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + "/" + mongoDatabaseName;
    } else {
        url = "mongodb://" + mongoHost + "/" + mongoDatabaseName;
    }

    return url;
}

function checkParameters(parameters) {
    if (!parameters) {
        throw new Error("No connection parameters defined!");
    }
    if (!parameters.host) {
        throw new Error("No 'host' specified!");
    }
    if (!parameters.name) {
        throw new Error("No 'name' specified!");
    }
    if (XOR(parameters.user, parameters.password)) {
        throw new Error("Please provide correct authentication parameters ('user' and 'password')!");
    }


    function XOR(a, b) {
        return ( a ? 1 : 0 ) ^ ( b ? 1 : 0 );
    }
}

module.exports = connect;