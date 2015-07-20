'use strict';

var mongoose = require("mongoose");

var Shooter = mongoose.model("Shooter",{
  firstname:String,
  lastname:String
});

var Event = mongoose.model("Event",{
  description:String
});

exports.Shooter = Shooter;
exports.Event = Event;
