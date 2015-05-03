/**
 * Created by jonashansen on 02/05/15.
 */
var DefaultKeyChecker = (function () {
    function DefaultKeyChecker() {
    }
    DefaultKeyChecker.prototype.check = function (key) {
        console.log("Checking key " + key);
        return true;
    };
    return DefaultKeyChecker;
})();
exports.DefaultKeyChecker = DefaultKeyChecker;
//# sourceMappingURL=keys.js.map