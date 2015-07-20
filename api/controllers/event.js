'use strict';

var Event = require('../helpers/models.js').Event;

module.exports = {
    getEvents: getEvents
};


function getEvents(req, res) {
    Event.find(function (err, events) {
        if(err){
            res.status(500).json('Error while fetching records. ' + err);
        }
        res.json(events);
    });
}