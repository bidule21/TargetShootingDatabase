/**
 * Created by jonashansen on 29/04/15.
 */

/// <reference path="../typings/express.d.ts" />
import express = require("express");

export function GetGateway(req:express.Request,res:express.Response,next:Function){
    console.log("Request from "+req.host+" passed the gates");
    next();
}