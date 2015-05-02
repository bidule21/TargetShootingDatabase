/**
 * Created by jonashansen on 29/04/15.
 */
function GetGateway(req, res, next) {
    console.log("Request from " + req.host + " passed the gates");
    next();
}
exports.GetGateway = GetGateway;
//# sourceMappingURL=gateways.js.map