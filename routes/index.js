/// <reference path="../typings/express.d.ts"/>
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Target Shooting Database' });
});
module.exports = router;
//# sourceMappingURL=index.js.map