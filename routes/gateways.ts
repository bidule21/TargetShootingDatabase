/**
 * Created by jonashansen on 29/04/15.
 */

/// <reference path="../typings/express.d.ts" />
import express = require("express");

export var ERR_NO_API_KEY = "ERR: NO_APY_KEY";

interface Gateway {
    handleRequest(req:express.Request, res:express.Response, next:Function);
}

export class GetGateway implements Gateway {
    handleRequest(req:express.Request, res:express.Response, next:Function) {
        console.log("Request from " + req.host + " passed the gates");
        next();
    }
}

export class PutGateway implements Gateway {
    handleRequest(req:express.Request, res:express.Response, next:Function) {
        console.log("Request from " + req.host + " passed the gates");

        res.status(400);
        res.send(ERR_NO_API_KEY);
    }
}

export class DefaultGateways {
    static DefaultPutGateway:Gateway = new PutGateway();
    static DefaultGetGateway:Gateway = new GetGateway();
}