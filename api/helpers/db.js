/**
 * Created by vl0w on 26/07/15.
 */
"use strict";

var mongoose = require("mongoose");

function connect(){
    var connectionString = buildDatabaseUrl();
    mongoose.connect(connectionString);
    var db = mongoose.connection;
    db.on("error", function (callback) {
        console.error("Error! No connection to MongoDB");
        process.exit(1);
    });
    db.once("open", function (callback) {
        console.log("Connection to MongoDB successfully established");
    });
}

// Helper functions
function buildDatabaseUrl() {
    var mongoHost = process.env.DB_HOST;
    var mongoDatabaseName = process.env.DB_NAME;
    var mongoUser = process.env.DB_USER;
    var mongoPassword = process.env.DB_PASSWORD;

    var url;
    if (mongoUser && mongoPassword) {
        url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + "/" + mongoDatabaseName;
    } else {
        url = "mongodb://" + mongoHost + "/" + mongoDatabaseName;
    }

    return url;
}

module.exports = connect;