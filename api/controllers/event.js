"use strict";

var Event = require("../helpers/models.js").Event;

module.exports = {
    getEvents: getEvents,
    getEventById: getEventById,
    postParticipation: postParticipation
};


function getEvents(req, res) {
    Event.find(function (err, events) {
        if (err) {
            res.status(500).json("Error while fetching records. " + err);
        }
        res.json(events);
    });
}

function getEventById(req, res) {
    Event.find({_id: req.swagger.params.id.value}, function (err, event) {
        if (err) {
            res.status(500).json("Error while fetching event. " + err);
        } else {
            res.json(event);
        }
    });
}

function postParticipation(req, res) {
    var eventId = req.swagger.params.id.value;
    var shooterId = req.swagger.params.shooterId.value;
    var resultId = req.swagger.params.resultId.value;
    var participation = {shooter: shooterId, result: resultId};


    Event.update({_id: eventId}, {$push: {participations: participation}}, function (err, numAffected) {
        if (err) {
            res.status(500).json("Error while pushing participation. " + err);
        } else {
            res.json({
                code: 200,
                type: "SUCCESS",
                message: "Participation added"
            });
        }
    });
}