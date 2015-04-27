var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    function NestedResultFactory(onAddCallback, parentFactory, Categoriesegory) {
        _super.call(this, parentFactory.shooter, Categoriesegory);
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
//# sourceMappingURL=Result.js.map