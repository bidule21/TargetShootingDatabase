var CAT = (function () {
    function CAT() {
    }
    CAT.A30_S_30 = "A30 S 30";
    CAT.A30_S_20 = "A30 S 20";
    CAT.A30_S_10 = "A30 S 10";
    CAT.A30_S_1 = "A30 S 1";
    CAT.A30_K_30 = "A30 K 30";
    CAT.A30_K_20 = "A30 K 20";
    CAT.A30_K_10 = "A30 K 10";
    CAT.A30_K_1 = "A30 K 1";
    CAT.A10_60 = "A10 60";
    CAT.A10_40 = "A10 40";
    CAT.A10_30 = "A10 30";
    CAT.A10_20 = "A10 20";
    CAT.A10_10 = "A10 10";
    CAT.A10_1 = "A10 1";
    CAT.ALL = [
        CAT.A10_1,
        CAT.A10_10,
        CAT.A10_20,
        CAT.A10_30,
        CAT.A10_40,
        CAT.A10_60,
        CAT.A30_K_1,
        CAT.A30_K_10,
        CAT.A30_K_20,
        CAT.A30_K_30,
        CAT.A30_S_1,
        CAT.A30_S_10,
        CAT.A30_S_20,
        CAT.A30_S_30
    ];
    return CAT;
})();
exports.CAT = CAT;
var SCHEMAS = [
    {
        category: CAT.A10_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: CAT.A10_10,
        allowedChildren: 10,
        allowedChildrenCategory: CAT.A10_1,
        maxScore: 100
    },
    {
        category: CAT.A10_20,
        allowedChildren: 2,
        allowedChildrenCategory: CAT.A10_10,
        maxScore: 200
    },
    {
        category: CAT.A10_30,
        allowedChildren: 3,
        allowedChildrenCategory: CAT.A10_10,
        maxScore: 300
    },
    {
        category: CAT.A10_40,
        allowedChildren: 4,
        allowedChildrenCategory: CAT.A10_10,
        maxScore: 400
    },
    {
        category: CAT.A10_60,
        allowedChildren: 6,
        allowedChildrenCategory: CAT.A10_10,
        maxScore: 600
    },
    {
        category: CAT.A30_K_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: CAT.A30_K_10,
        allowedChildren: 10,
        allowedChildrenCategory: CAT.A30_K_1,
        maxScore: 100
    },
    {
        category: CAT.A30_K_20,
        allowedChildren: 2,
        allowedChildrenCategory: CAT.A30_K_10,
        maxScore: 200
    },
    {
        category: CAT.A30_K_30,
        allowedChildren: 3,
        allowedChildrenCategory: CAT.A30_K_10,
        maxScore: 300
    },
    {
        category: CAT.A30_S_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: CAT.A30_S_10,
        allowedChildren: 10,
        allowedChildrenCategory: CAT.A30_S_1,
        maxScore: 100
    },
    {
        category: CAT.A30_S_20,
        allowedChildren: 2,
        allowedChildrenCategory: CAT.A30_S_10,
        maxScore: 200
    },
    {
        category: CAT.A30_S_30,
        allowedChildren: 3,
        allowedChildrenCategory: CAT.A30_S_10,
        maxScore: 300
    }
];
var ResultSchemaValidator = (function () {
    function ResultSchemaValidator(result) {
        this.result = result;
        this.schema = findSchema(result.category);
        if (!this.schema) {
            throw new Error("No schema for " + result.category + " found. Please define one or provide a valid category!");
        }
        function findSchema(category) {
            var foundSchema;
            SCHEMAS.forEach(function (schema) {
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
