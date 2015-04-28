var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by jonashansen on 27/04/15.
 */
var categories = require("categories");
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
var ResultSchemaValidator = (function () {
    function ResultSchemaValidator(result) {
        this.result = result;
        this.schema = findSchema(result.category);
        if (!this.schema) {
            throw new Error("No schema for " + result.category + " found. Please define one or provide a valid category!");
        }
        function findSchema(category) {
            var foundSchema;
            ResultSchemas.forEach(function (schema) {
                if (schema.category === category) {
                    foundSchema = schema;
                }
            });
            return foundSchema;
        }
    }
    ResultSchemaValidator.prototype.isValid = function () {
        var children = this.result.children;
        var childrenValid = true;
        if (children.length > 0) {
            if (children.length === this.schema.allowedChildren) {
                childrenValid = !containsOtherCategoryThan(this.schema.allowedChildrenCategory, this.result);
                children.forEach(function (child) {
                    if (childrenValid) {
                        var validator = new ResultSchemaValidator(child);
                        childrenValid = validator.isValid();
                    }
                });
            }
            else {
                childrenValid = false;
            }
        }
        var scoreValid = true;
        if (this.result.score < 0 || this.result.score > this.schema.maxScore) {
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
    return ResultSchemaValidator;
})();
exports.ResultSchemaValidator = ResultSchemaValidator;
var ResultSchemas = [
    {
        category: categories.A10_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A10_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A10_1,
        maxScore: 100
    },
    {
        category: categories.A10_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 200
    },
    {
        category: categories.A10_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 300
    },
    {
        category: categories.A10_40,
        allowedChildren: 4,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 400
    },
    {
        category: categories.A10_60,
        allowedChildren: 6,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 600
    },
    {
        category: categories.A30_K_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A30_K_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A30_K_1,
        maxScore: 100
    },
    {
        category: categories.A30_K_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A30_K_10,
        maxScore: 200
    },
    {
        category: categories.A30_K_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A30_K_10,
        maxScore: 300
    },
    {
        category: categories.A30_S_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A30_S_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A30_S_1,
        maxScore: 100
    },
    {
        category: categories.A30_S_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A30_S_10,
        maxScore: 200
    },
    {
        category: categories.A30_S_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A30_S_10,
        maxScore: 300
    }
];
//# sourceMappingURL=result.js.map