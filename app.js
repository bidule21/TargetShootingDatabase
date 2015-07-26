"use strict";
var SwaggerExpress = require("swagger-express-mw"),
    app = require("express")(),
    connectToDatabase = require("./api/helpers/db.js");

connectToDatabase({
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}, onDatabaseConnectionFailed, onDatabaseConnectionEstablished(initSwagger));

function onDatabaseConnectionFailed(){
    console.log("Couldn't establish a connection to the database");
}

function onDatabaseConnectionEstablished(successor){
    console.log("Connection to MongoDB established.");
    successor();
}

function initSwagger(){
    var config = {
        appRoot: __dirname // required config
    };

    SwaggerExpress.create(config, function(err, swaggerExpress) {
        if (err) { throw err; }

        // install middleware
        swaggerExpress.register(app);

        var port = process.env.PORT || 10010;
        app.listen(port);

        console.log("The server is running on http://127.0.0.1:" + port);
    });

    module.exports = app; // for testing
}





