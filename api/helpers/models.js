'use strict'
var mongoose = require("mongoose");

var Shooter = mongoose.model("Shooter",{
  firstname:String,
  lastname:String
});

exports.Shooter = Shooter;
