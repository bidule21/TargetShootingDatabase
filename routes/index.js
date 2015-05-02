/// <reference path="../typings/express.d.ts"/>
var express = require("express");
var gateways = require("./gateways");
var router = express.Router();
// TODO: move to app.js
router.use(gateways.DefaultGateways.DefaultGetGateway);
router.use(gateways.DefaultGateways.DefaultPutGateway);
/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Target Shooting Database", environment: process.env.SYSTEM_ENVIRONMENT });
});
module.exports = router;
//# sourceMappingURL=index.js.map