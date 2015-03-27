var CAT_A10_60 = "A10 60";
var CAT_A10_40 = "A10 40";
var CAT_A10_30 = "A10 30";
var CAT_A10_20 = "A10 20";
var CAT_A10_10 = "A10 10";
var CAT_A10_1 = "A10 1";
var CAT_ALL = [CAT_A10_1, CAT_A10_10, CAT_A10_20, CAT_A10_30, CAT_A10_40, CAT_A10_60];

var SCHEMAS = [
    {
        category: CAT_A10_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: CAT_A10_10,
        allowedChildren: 10,
        allowedChildrenCategory: CAT_A10_1,
        maxScore: 100
    },
    {
        category: CAT_A10_20,
        allowedChildren: 2,
        allowedChildrenCategory: CAT_A10_10,
        maxScore: 200
    },
    {
        category: CAT_A10_30,
        allowedChildren: 3,
        allowedChildrenCategory: CAT_A10_10,
        maxScore: 300
    },
    {
        category: CAT_A10_40,
        allowedChildren: 4,
        allowedChildrenCategory: CAT_A10_10,
        maxScore: 400
    },
    {
        category: CAT_A10_60,
        allowedChildren: 6,
        allowedChildrenCategory: CAT_A10_10,
        maxScore: 600
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
    var children = this.result.getChildren();

    var childrenValid = true;
    if (children.length > 0) {
        if (children.length === this.schema.allowedChildren) {
            childrenValid = !containsOtherCategoryThan(this.schema.allowedChildrenCategory, this.result);
            
            // Check every child
            children.forEach(function(child){
            		if(childrenValid){
            		 var validator = new resultSchemaValidator(child);
            		 childrenValid = validator.isValid();
            		}
            	});
            
        } else {
            childrenValid = false;
        }
    }

    var scoreValid = true;
    if (this.result.getScore() < 0 ||
        this.result.getScore() > this.schema.maxScore) {
        scoreValid = false;
    }
    
    return childrenValid && scoreValid;
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
exports.CAT_A10_60 = CAT_A10_60;
exports.CAT_A10_40 = CAT_A10_40;
exports.CAT_A10_30 = CAT_A10_30;
exports.CAT_A10_20 = CAT_A10_20;
exports.CAT_A10_10 = CAT_A10_10;
exports.CAT_A10_1 = CAT_A10_1;
exports.CAT_ALL = CAT_ALL;
