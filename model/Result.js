var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jonashansen on 27/04/15.
 */
var categories = require("./categories");
var Categories = categories.Categories;
var NestedResultImpl = (function () {
    function NestedResultImpl(category, score) {
        if (score === void 0) { score = 0; }
        this.category = category;
        this.children = [];
        this.scoreCalculator = this.calculateFixScore(score);
    }
    Object.defineProperty(NestedResultImpl.prototype, "score", {
        get: function () {
            return this.scoreCalculator();
        },
        set: function (score) {
            if (this.children.length == 0) {
                this.scoreCalculator = this.calculateFixScore(score);
            }
        },
        enumerable: true,
        configurable: true
    });
    NestedResultImpl.prototype.wrap = function (result) {
        var nestedResult = new NestedResultImpl(result.category, result.score);
        this.children.push(nestedResult);
        this.scoreCalculator = this.calculateScoreByChildren;
        return nestedResult;
    };
    NestedResultImpl.prototype.calculateScoreByChildren = function () {
        var score = 0;
        this.children.forEach(function (result) {
            score += result.score;
        });
        return score;
    };
    NestedResultImpl.prototype.calculateFixScore = function (score) {
        return function () {
            return score;
        };
    };
    return NestedResultImpl;
})();
var ResultImpl = (function (_super) {
    __extends(ResultImpl, _super);
    function ResultImpl(shooter, category, score) {
        _super.call(this, category, score);
        this.shooter = shooter;
    }
    return ResultImpl;
})(NestedResultImpl);
exports.ResultImpl = ResultImpl;
var ResultValidator = (function () {
    function ResultValidator() {
    }
    ResultValidator.prototype.isValid = function (result) {
        var children = result.children;
        var childrenValid = true;
        if (children.length > 0) {
            if (children.length === result.category.allowedChildren) {
                childrenValid = !containsOtherCategoryThan(result.category.allowedChildrenCategory, result);
                var validator = this;
                children.forEach(function (child) {
                    if (childrenValid) {
                        childrenValid = validator.isValid(child);
                    }
                });
            }
            else {
                childrenValid = false;
            }
        }
        var scoreValid = true;
        if (result.score < 0 || result.score > result.category.maxScore) {
            scoreValid = false;
        }
        return childrenValid && scoreValid;
        function containsOtherCategoryThan(category, result) {
            var containsOtherCategory = false;
            result.children.forEach(function (result) {
                if (result.category !== category) {
                    containsOtherCategory = true;
                }
            });
            return containsOtherCategory;
        }
    };
    return ResultValidator;
})();
exports.ResultValidator = ResultValidator;
//# sourceMappingURL=result.js.map