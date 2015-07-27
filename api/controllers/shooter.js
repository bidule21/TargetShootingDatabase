"use strict";

var Shooter = require("../helpers/models.js").Shooter,
    answer = require("./answer.js"),
    answerGet = answer.answerGet,
    answerUpdate = answer.answerUpdate;


module.exports = {
    getShooterById: getShooterById,
    getShooters: getShooters,
    postShooterByName: postShooterByName
};


function getShooterById(req, res) {
    var id = req.swagger.params.id.value;
    Shooter.findById(id, function (err, shooter) {
        answerGet(res,err,shooter);
    });
}

function getShooters(req, res) {
    Shooter.find(function (err, shooters) {
        answerGet(res,err,shooters);
    });
}

function postShooterByName(req, res) {
    var shooter = new Shooter({
        firstname: req.swagger.params.firstname.value,
        lastname: req.swagger.params.lastname.value
    });

    shooter.save(function (err) {
        answerUpdate(res, err, shooter._id);
    });
}
