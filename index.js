// Connect to database
var mongoose = require("mongoose");
mongoose.connect(buildDatabaseUrl());
var db = mongoose.connection;
db.on("error", function (callback) {
    console.error("Error! No connection to MongoDB");
    process.exit(1);
});
db.once("open", function (callback) {
    console.log("Connection to MongoDB successfully established");
});

// Init express app
var express = require("express");
var app = express();
app.set("port", process.env.PORT || 3000);

var initRoutings = require("./routing");
initRoutings(app);

// Start server
var http = require("http");
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get("port"));
});

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