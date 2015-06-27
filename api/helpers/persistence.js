'use strict'
var fs = require('fs');
var yaml2json = require("yaml-to-json")
var swaggerMongoose = require('swagger-mongoose');
var swaggerYAML = fs.readFileSync('./api/swagger/swagger.yaml');
var swaggerJSON = yaml2json(swaggerYAML);
var Shooter = swaggerMongoose.compile(swaggerJSON).models.Shooter;

exports.Shooter = Shooter;
