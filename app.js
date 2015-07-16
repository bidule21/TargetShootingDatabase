'use strict';

// Connect to database
var mongoose = require("mongoose");
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

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  console.log('The server is running on http://127.0.0.1:' + port);
});
