/**
 * Created by jonashansen on 29/04/15.
 */
var keys = require("./keys");
exports.ERR_NO_API_KEY = "ERR: NO_APY_KEY";
exports.ERR_INVALID_API_KEY = "ERR: INVALID_API_KEY";
var GetGateway = (function () {
    function GetGateway() {
    }
    GetGateway.prototype.handleRequest = function (req, res, next) {
        console.log("GET request from " + req.host + " passed the gates");
        next();
    };
    return GetGateway;
})();
exports.GetGateway = GetGateway;
var PutGateway = (function () {
    function PutGateway(keyChecker) {
        this.keyChecker = keyChecker;
    }
    PutGateway.prototype.handleRequest = function (req, res, next) {
        if (!req.body.API_KEY) {
            res.status(400);
            res.send(exports.ERR_NO_API_KEY);
        }
        else {
            var apiKey = req.body.API_KEY;
            console.log(this.keyChecker);
            if (!this.keyChecker.check(apiKey)) {
                res.status(401);
                res.send(exports.ERR_INVALID_API_KEY);
            }
            else {
                next();
                console.log("PUT request from " + req.host + " passed the gates");
            }
        }
    };
    return PutGateway;
})();
exports.PutGateway = PutGateway;
function handleGetRequest(req, res, next) {
    if (req.method === "GET") {
        var gateway = new GetGateway();
        gateway.handleRequest(req, res, next);
    }
    else {
        next();
    }
}
exports.handleGetRequest = handleGetRequest;
function handlePutRequest(req, res, next) {
    if (req.method === "PUT") {
        var keyChecker = new keys.DefaultKeyChecker();
        var gateway = new PutGateway(keyChecker);
        gateway.handleRequest(req, res, next);
    }
    else {
        next();
    }
}
exports.handlePutRequest = handlePutRequest;
//# sourceMappingURL=gateways.js.map