'use strict';

var Shooter = require('../helpers/models.js').Shooter

module.exports = {
    getShooterById: getShooterById,
    getAllShooters: getAllShooters,
    postShooterByName: postShooterByName
};


function getShooterById(req, res) {
    var id = req.swagger.params.id.value;
    Shooter.find({_id: id}, function (err, shooter) {
        res.json(shooter);
    });
}

function getAllShooters(req, res) {
    Shooter.find(function (err, shooters) {
        res.json(shooters);
    });
}

function postShooterByName(req, res) {
    var shooter = new Shooter({
        firstname: req.swagger.params.firstname.value,
        lastname: req.swagger.params.lastname.value
    });

    shooter.save(function (err) {
        if (err) {
            res.status(500).json('Error while writing record. ' + err);
        }
        res.json(shooter);
    });
}
