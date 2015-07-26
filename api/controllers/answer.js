/**
 * Created by vl0w on 26/07/15.
 */
"use strict";

var TYPE_ERROR = "ERROR";
var TYPE_SUCCESS = "SUCCESS";

function answerGet(res, err, data){
    if (err) {
        res.status(500).json(createErrorObject(err));
    }else{
        res.json(data);
    }
}

function answerUpdate(res, err, affected){
    if (err) {
        var answerObject = createErrorObject(err);
        res.status(500).json(answerObject);
    } else {
        var answerObject = createSuccessObject("Record updated");

        if(affected){
            answerObject.affected = affected;
        }

        res.json(answerObject);
    }
}

/**
 *
 * @param code {number}
 * @param type {string}
 * @param message {string}
 * @returns {{code: *, type: *, message: *}}
 */
function createAnswerObject(code, type, message){
    return {
        code:code,
        type:type,
        message: message
    }
}

/**
 *
 * @param message {string}
 * @returns {{code, type, message}|{code: *, type: *, message: *}}
 */
function createSuccessObject(message){
    return createAnswerObject(200, TYPE_SUCCESS, message);
}

/**
 *
 * @param err {string}
 * @returns {{code, type, message}|{code: *, type: *, message: *}}
 */
function createErrorObject(err){
    return createAnswerObject(500, TYPE_ERROR, err);
}

module.exports.answerGet = answerGet;
module.exports.answerUpdate = answerUpdate;