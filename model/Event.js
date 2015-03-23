var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var eventSchema = new Schema({
    name: String,
    description: String
});

var event = mongoose.model("Event", eventSchema);

module.exports = event;