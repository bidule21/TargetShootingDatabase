var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var shooterSchema = new Schema({
    firstname: String,
    lastname: String,
    country: String
});
exports.Shooter = mongoose.model("Shooter", shooterSchema);


var eventSchema = new Schema({
    name: String,
    participations: [{
        shooter: ObjectId,
        result: ObjectId
    }]
});
exports.Event = mongoose.model("Event", eventSchema);


var resultSchema = new Schema({
    shooter: ObjectId,
    category: String,
    score: Number,
    consists_of: [ObjectId]
});
exports.Result = mongoose.model("Result", resultSchema);