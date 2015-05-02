/**
 * Created by jonashansen on 29/04/15.
 */
/// <reference path="../model/result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>
/// <reference path="../typings/sinon.d.ts"/>
var sinon = require("sinon");
var assert = sinon.assert;
var chai = require("chai");
var expect = chai.expect;
var gateways = require("../routes/gateways");
describe("Get request handler", function () {
    it("should simply route the request to the next handler", function () {
        var nextSpy = sinon.spy();
        gateways.GetGateway({ host: "swag" }, null, nextSpy);
        assert.calledOnce(nextSpy);
    });
});
//# sourceMappingURL=gateways.test.js.map