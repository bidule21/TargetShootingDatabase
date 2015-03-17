var Shooter = require("./model").Shooter;

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.send("RUNNING SKELETON");
    });

    initShooterRoutings(app);

    // No routing found
    app.use(function (req, res) {
        res.send("I don't know what you mean");
    });
}

function initShooterRoutings(app) {
    app.get("/shooters", function (req, res) {
        Shooter.find(function (err, shooters) {
            res.send(shooters);
        });
    });

    app.get("/shooter/:id", function (req, res) {
        Shooter.findById(
            req.params.id,
            function (err, shooter) {
                res.send(shooter);
            });
    });

    app.delete("/shooter/:id", function (req, res) {
        Shooter.findByIdAndRemove(req.params.id, function (deletedShooter) {
            res.send(deletedShooter);
        });
    });
}