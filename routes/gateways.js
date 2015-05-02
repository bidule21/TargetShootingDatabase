/**
 * Created by jonashansen on 29/04/15.
 */
exports.ERR_NO_API_KEY = "ERR: NO_APY_KEY";
var GetGateway = (function () {
    function GetGateway() {
    }
    GetGateway.prototype.handleRequest = function (req, res, next) {
        if (req.method === "GET") {
            console.log("GET request from " + req.host + " passed the gates");
            next();
        }
    };
    return GetGateway;
})();
exports.GetGateway = GetGateway;
var PutGateway = (function () {
    function PutGateway() {
    }
    PutGateway.prototype.handleRequest = function (req, res, next) {
        if (req.method === "PUT") {
            console.log("PUT request from " + req.host + " passed the gates");
            res.status(400);
            res.send(exports.ERR_NO_API_KEY);
        }
        else {
            next();
        }
    };
    return PutGateway;
})();
exports.PutGateway = PutGateway;
var DefaultGateways = (function () {
    function DefaultGateways() {
    }
    DefaultGateways.DefaultPutGateway = new PutGateway();
    DefaultGateways.DefaultGetGateway = new GetGateway();
    return DefaultGateways;
})();
exports.DefaultGateways = DefaultGateways;
//# sourceMappingURL=gateways.js.map