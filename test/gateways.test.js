/**
 * Created by jonashansen on 29/04/15.
 */
/// <reference path="../model/result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>
/// <reference path="../typings/sinon.d.ts"/>
var sinon = require("sinon");
var gateways = require("../routes/gateways");
describe("GetGateway", function () {
    var gateway = new gateways.GetGateway();
    var nextSpy = sinon.spy();
    it("should simply route the request to the next handler", function () {
        gateway.handleRequest({ host: "someone" }, null, nextSpy);
        sinon.assert.calledOnce(nextSpy);
    });
});
describe("PutGateway", function () {
    var gateway = new gateways.PutGateway();
    var nextSpy = sinon.spy();
    var statusSpy = sinon.spy();
    var sendSpy = sinon.spy();
    var req = { host: "someone" };
    var res = { status: statusSpy, send: sendSpy };
    describe("API key", function () {
        it("should contain a key at all", function () {
            gateway.handleRequest(req, res, nextSpy);
            sinon.assert.notCalled(nextSpy);
            sinon.assert.calledWith(statusSpy, 400);
            sinon.assert.calledWith(sendSpy, gateways.ERR_NO_API_KEY);
        });
        it("should invoke the key-checking engine", function () {
        });
    });
});
//# sourceMappingURL=gateways.test.js.map