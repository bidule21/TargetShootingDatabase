'use strict';

var Result = require('../helpers/models.js').Result;

module.exports = {
    postResult: postResult
};

function postResult(req,res){
    var result = new Result(req.body);

    result.save(function(err){
        if(err){
            res.status(500).json('Error while writing record. ' + err);
        }
        res.json(result._id);
    });
}

