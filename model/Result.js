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
var BaseResultFactory = (function () {
    function BaseResultFactory(shooter, category) {
        this.shooter = shooter;
        this.category = category;
        this.scoreCalculator = function () {
            return 0;
        };
        this.children = [];
    }
    BaseResultFactory.prototype.setScore = function (score) {
        this.scoreCalculator = function () {
            return score;
        };
        return this;
    };
    BaseResultFactory.prototype.create = function () {
        return new ResultHelper(this.shooter, this.category, this.children, this.scoreCalculator);
    };
    return BaseResultFactory;
})();
var ResultFactory = (function (_super) {
    __extends(ResultFactory, _super);
    function ResultFactory() {
        _super.apply(this, arguments);
    }
    ResultFactory.prototype.child = function (category, score) {
        var _this = this;
        var nestedFactory = new NestedResultFactory(function (nestedResult) {
            _this.children.push(nestedResult);
        }, this, category);
        if (score) {
            nestedFactory.setScore(score);
        }
        this.scoreCalculator = function () {
            var score = 0;
            _this.children.forEach(function (child) {
                score += child.score;
            });
            return score;
        };
        return nestedFactory;
    };
    return ResultFactory;
})(BaseResultFactory);
exports.ResultFactory = ResultFactory;
var NestedResultFactory = (function (_super) {
    __extends(NestedResultFactory, _super);
    function NestedResultFactory(onAddCallback, parentFactory, category) {
        _super.call(this, parentFactory.shooter, category);
        this.onAddCallback = onAddCallback;
    }
    NestedResultFactory.prototype.add = function () {
        this.onAddCallback(this.create());
    };
    return NestedResultFactory;
})(ResultFactory);
var ResultHelper = (function () {
    function ResultHelper(shooter, category, children, scoreCalculator) {
        this.shooter = shooter;
        this.category = category;
        this.children = children;
        this.scoreCalculator = scoreCalculator;
    }
    Object.defineProperty(ResultHelper.prototype, "score", {
        get: function () {
            return this.scoreCalculator();
        },
        enumerable: true,
        configurable: true
    });
    return ResultHelper;
})();
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