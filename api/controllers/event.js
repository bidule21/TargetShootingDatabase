"use strict";

var Event = require("../helpers/models.js").Event,
    answer = require("./answer.js"),
    answerGet = answer.answerGet,
    answerUpdate = answer.answerUpdate;

module.exports = {
    getEvents: getEvents,
    getEventById: getEventById,
    postParticipation: postParticipation
};


function getEvents(req, res) {
    Event.find(function (err, events) {
        answerGet(res,err,events);
    });
}

function getEventById(req, res) {
    Event.find({_id: req.swagger.params.id.value}, function (err, event) {
        answerGet(err, event);
    });
}

function postParticipation(req, res) {
    var eventId = req.swagger.params.id.value;
    var shooterId = req.swagger.params.shooterId.value;
    var resultId = req.swagger.params.resultId.value;
    var participation = {shooter: shooterId, result: resultId};


    Event.update({_id: eventId}, {$push: {participations: participation}}, function (err) {
        answerUpdate(res, err);
    });
}