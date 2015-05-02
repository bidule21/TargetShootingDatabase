/// <reference path="../typings/express.d.ts"/>

import express = require("express");
var gateways = require("./gateways");
var router = express.Router();

router.use(gateways.GetGateway);

/* GET home page. */
router.get("/", function(req, res, next) {
        res.render("index",
            { title: "Target Shooting Database",
                environment: process.env.SYSTEM_ENVIRONMENT
            }
        );
});

export = router;
