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
    var nextSpy;
    var statusSpy;
    var sendSpy;
    var requestVariablesHelper;
    var req;
    var res;
    beforeEach(function () {
        nextSpy = sinon.spy();
        statusSpy = sinon.spy();
        sendSpy = sinon.spy();
        requestVariablesHelper = {};
        req = {
            host: "someone",
            body: {}
        };
        res = {
            status: statusSpy,
            send: sendSpy
        };
    });
    describe("API key", function () {
        it("should contain a key", function () {
            req.body.API_KEY = undefined;
            var gateway = new gateways.PutGateway(null);
            gateway.handleRequest(req, res, nextSpy);
            sinon.assert.notCalled(nextSpy);
            sinon.assert.calledWith(statusSpy, 400);
            sinon.assert.calledWith(sendSpy, gateways.ERR_NO_API_KEY);
        });
        it("should invoke the key-checking engine and route to the next handler", function () {
            var key = "MyKey";
            req.body.API_KEY = key;
            var keyCheckStub = sinon.stub().returns(true);
            var keyChecker = { check: keyCheckStub };
            var gateway = new gateways.PutGateway(keyChecker);
            gateway.handleRequest(req, res, nextSpy);
            sinon.assert.calledOnce(nextSpy);
            sinon.assert.calledOnce(keyCheckStub);
            sinon.assert.calledWith(keyCheckStub, key);
        });
        it("should throw an error when the key isn't correct", function () {
            var key = "MyKey";
            req.body.API_KEY = key;
            var keyCheckStub = sinon.stub().returns(false);
            var keyChecker = { check: keyCheckStub };
            var gateway = new gateways.PutGateway(keyChecker);
            gateway.handleRequest(req, res, nextSpy);
            sinon.assert.notCalled(nextSpy);
            sinon.assert.calledOnce(keyCheckStub);
            sinon.assert.calledWith(keyCheckStub, key);
            sinon.assert.calledWith(statusSpy, 401);
            sinon.assert.calledWith(sendSpy, gateways.ERR_INVALID_API_KEY);
        });
    });
});
//# sourceMappingURL=gateways.test.js.map