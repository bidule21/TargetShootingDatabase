'use strict';

var Event = require('../helpers/models.js').Event;

module.exports = {
    getEvents: getEvents,
    getEventById: getEventById
};


function getEvents(req, res) {
    Event.find(function (err, events) {
        if(err){
            res.status(500).json('Error while fetching records. ' + err);
        }
        res.json(events);
    });
}

function getEventById(req, res){
    Event.find({_id:req.swagger.params.id.value},function(err, event){
        if(err){
            res.status(500).json('Error while fetching event. ' + err);
        }else{
            res.json(event);
        }
    });
}