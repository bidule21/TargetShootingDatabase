'use strict';
var SwaggerExpress = require('swagger-express-mw'),
    app = require('express')(),
    connectToDatabase = require("./api/helpers/db.js");

connectToDatabase();

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

module.exports = app; // for testing

