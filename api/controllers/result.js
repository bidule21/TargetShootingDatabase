"use strict";

var Result = require("../helpers/models.js").Result,
    answer = require("./answer.js"),
    answerUpdate = answer.answerUpdate;

module.exports = {
    postResult: postResult
};

function postResult(req,res){
    var result = new Result(req.body);

    result.save(function(err){
        answerUpdate(res,err,result._id);
    });
}

