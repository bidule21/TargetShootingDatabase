"use strict";
var SwaggerExpress = require("swagger-express-mw"),
    app = require("express")(),
    connectToDatabase = require("./api/helpers/db.js");

module.exports = app; // for testing

connectToDatabase({
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}, function(){
    console.log("Couldn't establish a connection to the database");
}, function(){
    console.log("Connection to MongoDB established.");
    initSwagger();
});

function initSwagger(){
    var config = {
        appRoot: __dirname // required config
    };

    SwaggerExpress.create(config, function(err, swaggerExpress) {
        if (err) { throw err; }

        // install middleware
        swaggerExpress.register(app);

        var port = process.env.PORT || 10010;
        var server = app.listen(port);

        console.log("The server is running on http://127.0.0.1:" + port);
    });
}





