'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var shooterSchema = new Schema({
    firstname: String,
    lastname: String
});

var eventSchema = new Schema({
    description: String,
    participations: [
        {
            shooter: {type:Schema.Types.ObjectId, ref:"Shooter"},
            result: {type:Schema.Types.ObjectId, ref:"Result"}
        }
    ]
});

var resultSchema = new Schema({
    category: String,
    score: Number,
    children: [Schema.Types.Mixed]
});

exports.Shooter = mongoose.model('Shooter', shooterSchema);
exports.Event = mongoose.model('Event', eventSchema);
exports.Result = mongoose.model('Result', resultSchema);
