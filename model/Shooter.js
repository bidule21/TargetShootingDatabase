var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var shooterSchema = new Schema({
    firstname: String,
    lastname: String,
    country: String
});

var shooter = mongoose.model("Shooter", shooterSchema);

module.exports = shooter;
