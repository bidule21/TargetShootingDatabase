var CAT_A10_20 = "A10 20";
var CAT_A10_10 = "A10 10";
var CAT_A10_1 = "A10 1";
var CAT_ALL = [CAT_A10_1, CAT_A10_10, CAT_A10_20];


var SCHEMAS = [
    {
        category: CAT_A10_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined
    },
    {
        category: CAT_A10_10,
        allowedChildren: 10,
        allowedChildrenCategory: CAT_A10_1
    },
    {
        category: CAT_A10_20,
        allowedChildren: 2,
        allowedChildrenCategory: CAT_A10_10
    }
];


var resultSchemaValidator = function (result) {
    var schema = findSchema(result.category);
    if (!schema) {
        throw new Error("No schema for " + result.category + " found. Please define one or provide a valid category!");
    }
    this.result = result;
    this.schema = schema;

    function findSchema(category) {
        var foundSchema;
        SCHEMAS.forEach(function (schema) {
            if (schema.category === category) {
                foundSchema = schema;
            }
        });
        return foundSchema;
    }
};

resultSchemaValidator.prototype.isValid = function () {
    if (this.schema) {
        var children = this.result.getChildren();

        if (children.length === 0) {
            return true;
        } else if (children.length === this.schema.allowedChildren) {
            return !containsOtherCategoryThan(this.schema.allowedChildrenCategory, this.result);
        } else {
            return false;
        }
    } else {
        return false;
    }
};



function containsOtherCategoryThan(category, result) {
    var containsOtherCategory = false;
    result.getChildren().forEach(function (result) {
        if (result.category !== category) {
            containsOtherCategory = true;
        }
    });
    return containsOtherCategory;
}

exports.ResultSchemaValidator = resultSchemaValidator;
exports.CAT_A10_20 = CAT_A10_20;
exports.CAT_A10_10 = CAT_A10_10;
exports.CAT_A10_1 = CAT_A10_1;
exports.CAT_ALL = CAT_ALL;