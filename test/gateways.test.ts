/**
 * Created by jonashansen on 29/04/15.
 */

/// <reference path="../typings/test.d.ts"/>

import sinon = require("sinon");
import gateways = require("../routes/gateways");
import keys = require("../routes/keys");


describe("GetGateway", () => {
    var gateway = new gateways.GetGateway();

    var nextSpy = sinon.spy();

    it("should simply route the request to the next handler", () => {
        gateway.handleRequest(<any>{host:"someone"},null,nextSpy);
        sinon.assert.calledOnce(nextSpy)
    });
});

describe("PutGateway", () => {
    var nextSpy;
    var statusSpy;
    var sendSpy;
    var req;
    var res;

    beforeEach(()=>{
        nextSpy = sinon.spy();
        statusSpy = sinon.spy();
        sendSpy = sinon.spy();
        req = {
            host:"someone",
            body:{}
        };
        res = {
            status:statusSpy,
            send:sendSpy
        };
    });

    describe("API key", () => {
        it("should contain a key", () => {
            req.body.API_KEY=undefined;

            var gateway = new gateways.PutGateway(null);

            gateway.handleRequest(<any>req,<any>res,nextSpy);

            sinon.assert.notCalled(nextSpy);
            sinon.assert.calledWith(statusSpy,400);
            sinon.assert.calledWith(sendSpy,gateways.ERR_NO_API_KEY);
        });

        it("should invoke the key-checking engine and route to the next handler", () => {
            var key = "MyKey";
            req.body.API_KEY=key;

            var keyCheckStub = sinon.stub().returns(true);
            var keyChecker:keys.KeyChecker = {check:keyCheckStub};
            var gateway = new gateways.PutGateway(keyChecker);

            gateway.handleRequest(<any>req,<any>res,nextSpy);

            sinon.assert.calledOnce(nextSpy);
            sinon.assert.calledOnce(keyCheckStub);
            sinon.assert.calledWith(keyCheckStub, key);
        });

        it("should throw an error when the key isn't correct", () => {
            var key = "MyKey";
            req.body.API_KEY=key;

            var keyCheckStub = sinon.stub().returns(false);
            var keyChecker:keys.KeyChecker = {check:keyCheckStub};
            var gateway = new gateways.PutGateway(keyChecker);

            gateway.handleRequest(<any>req,<any>res,nextSpy);

            sinon.assert.notCalled(nextSpy);
            sinon.assert.calledOnce(keyCheckStub);
            sinon.assert.calledWith(keyCheckStub, key);
            sinon.assert.calledWith(statusSpy,401);
            sinon.assert.calledWith(sendSpy,gateways.ERR_INVALID_API_KEY);
        });
    });

});