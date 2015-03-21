var Shooter = require("./model").Shooter;
var Result = require("./model").Result;

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.send("RUNNING SKELETON");
    });

    app.get("/categories", function (req, res) {
        var categories = require("./model").AVAILABLE_CATEGORIES;
        res.send(categories);
    });

    initShooterRoutings(app);
    initResultRoutings(app);

    // No routing found
    app.use(function (req, res) {
        res.status(404).send("I don't know what you mean");
    });
}

function initShooterRoutings(app) {
    app.get("/shooters", findAllShooters);
    app.get("/shooter/:id", findShooterById);
    app.delete("/shooter/:id", findShooterByIdAndRemove);

    function findAllShooters(req, res) {
        Shooter.find(function(err, objs) { returnObjectsWhenNoErrorsOccured(err, objs, res); });
    }

    function findShooterById(req, res) {
        Shooter.findById(req.params.id, function(err, objs) { returnObjectsWhenNoErrorsOccured(err, objs, res); });

        
    }

    function findShooterByIdAndRemove(req, res) {
        Shooter.findByIdAndRemove(req.params.id, andReturnWhenRemoved);

        function andReturnWhenRemoved(removedShooter) {
            if (removedShooter) res.status(200).send("Removed: " + removedShooter);
            else res.status(404).send("Nothing has been deleted. Your object wasn't found");
        }
    }
}

function initResultRoutings(app) {

    app.get("/shooter/:id/results", findResultsOfShooter);


    function findResultsOfShooter(req, res) {
        Result.find({
            shooter: req.params.id
        }, function(err, objs) { returnObjectsWhenNoErrorsOccured(err, objs, res); });

    }


    app.get("/shooter/:id/result/new_random", function (req, res) {
        Shooter.findById(
            req.params.id,
            function (err, shooter) {
                if (err) res.status(404).send(": " + err);
                if (!err) {
                    Result.create({
                            shooter: req.params.id,
                            category: "A30 Match",
                            consists_of: []
                        },
                        function (err, result) {
                            res.send("Err: " + err + "Saved: " + result);
                        });
                } else {
                    // TODO   
                }
            });
    });
}

function returnObjectsWhenNoErrorsOccured(err, objs, res) {
    if (err) res.status(500).send("An error occured: " + err);
    else res.status(200).send(objs);
}
