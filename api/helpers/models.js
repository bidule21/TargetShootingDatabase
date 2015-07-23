'use strict';

var mongoose = require("mongoose");

var Shooter = mongoose.model("Shooter",{
  firstname:String,
  lastname:String
});

var Event = mongoose.model("Event",{
  description:String
});

var Result = mongoose.model("Result",{
  category:String,
  score:Number,
  children:[mongoose.Schema.Types.Mixed]
});

exports.Shooter = Shooter;
exports.Event = Event;
exports.Result  = Result;
