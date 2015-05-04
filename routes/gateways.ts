/**
 * Created by jonashansen on 29/04/15.
 */

/// <reference path="../typings/express.d.ts" />

import express = require("express");
import keys = require("./keys");

export var ERR_NO_API_KEY = "ERR: NO_APY_KEY";
export var ERR_INVALID_API_KEY = "ERR: INVALID_API_KEY";

interface Gateway {
    handleRequest(req:express.Request, res:express.Response, next:Function);
}

export class GetGateway implements Gateway {
    handleRequest(req:express.Request, res:express.Response, next:Function) {
        console.log("GET request from " + req.host + " passed the gates");
        next();
    }
}

export class PutGateway implements Gateway {

    private keyChecker:keys.KeyChecker;

    constructor(keyChecker:keys.KeyChecker) {
        this.keyChecker = keyChecker;
    }

    handleRequest(req:express.Request, res:express.Response, next:Function):any {
        if (!req.body.api_key) {
            res.status(400);
            res.send(ERR_NO_API_KEY);
        } else {
            var apiKey = req.body.api_key;
            console.log(this.keyChecker);
            if (!this.keyChecker.check(apiKey)) {
                res.status(401);
                res.send(ERR_INVALID_API_KEY);
            } else {
                next();
                console.log("PUT request from " + req.host + " passed the gates");
            }
        }
    }
}

export function handleGetRequest(req:express.Request, res:express.Response, next:Function):any {
    if (req.method === "GET") {
        var gateway = new GetGateway();
        gateway.handleRequest(req, res, next);
    } else {
        next();
    }
}

export function handlePutRequest(req:express.Request, res:express.Response, next:Function):any {
    if (req.method === "PUT") {
        var keyChecker = new keys.DefaultKeyChecker();
        var gateway = new PutGateway(keyChecker);
        gateway.handleRequest(req, res, next);
    } else {
        next();
    }
}