/**
 * Created by jonashansen on 29/04/15.
 */

/// <reference path="../model/result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>
/// <reference path="../typings/sinon.d.ts"/>

import sinon = require("sinon");
import gateways = require("../routes/gateways");


describe("Get request handler", () => {
    it("should simply route the request to the next handler", () => {
        var nextSpy = sinon.spy();
        gateways.GetGateway (<any>{host:"swag"},null,nextSpy);
        sinon.assert.calledOnce(nextSpy)
    });
});