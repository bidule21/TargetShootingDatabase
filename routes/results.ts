/**
 * Created by jonashansen on 04/05/15.
 */
/// <reference path="../typings/express.d.ts"/>

import express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.render("results");
});

export = router;