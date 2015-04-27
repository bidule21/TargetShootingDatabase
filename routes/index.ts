/// <reference path="../typed/express.d.ts"/>

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'the TargetShootingDatabase' });
});

export = router;
