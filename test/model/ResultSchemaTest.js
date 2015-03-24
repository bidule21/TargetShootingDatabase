var Result = require("../../model/Result");
var ResultSchemaValidator = require("../../model/ResultSchema").ResultSchemaValidator;
var CAT_A10_20 = require("../../model/ResultSchema").CAT_A10_20;
var CAT_A10_10 = require("../../model/ResultSchema").CAT_A10_10;
var CAT_A10_1 = require("../../model/ResultSchema").CAT_A10_1;

describe("ResultSchema", function () {

    it("should detect unknown categories", function () {
        (validatorWithInvalidResult).should.throw();

        function validatorWithInvalidResult() {
            new ResultSchemaValidator(new Result({
                category: "WTF!"
            }));
        }
    });

    it("should have a schema for every category", function () {
        var allCategories = require("../../model/ResultSchema").CAT_ALL;
        allCategories.forEach(function (category) {
            new ResultSchemaValidator(new Result({
                category: category
            }));
        });
    });

    it("should always contain it's specified category", function () {
        var result = new Result({
            category: CAT_A10_20,
            consists_of: [{
                category: CAT_A10_1
            }, {
                category: CAT_A10_1
            }]
        });

        expectInvalid(result, "A result may only have child categories which are specified in its schema");
    });

    describe("A10 1", function () {
        it("should not have children", function () {
            checkOnlyZeroChildrenAreAllowed(CAT_A10_1);
        });
    });

    describe("A10 10", function () {
        it("should consist of 0 or 10 results with category A10 1", function () {
            checkOnlyZeroOrXChildrenAreAllowed(CAT_A10_10, CAT_A10_1, 10);
        });
    });

    describe("A10 20", function () {
        it("should consist of 0 or 2 results with category A10 10", function () {
            checkOnlyZeroOrXChildrenAreAllowed(CAT_A10_20, CAT_A10_10, 2);
        });
    });
});

function checkOnlyZeroChildrenAreAllowed(category) {
    var resultWithZeroChildren = makeParentWithChildren(category, []);
    var resultWithMultipleChildren = makeParentWithChildren(category, [{}, {}, {}]);

    expectValid(resultWithZeroChildren, "0 results (as children) should be allowed for category " + category);
    expectInvalid(resultWithMultipleChildren, "Not more than 0 children are allowed for category " + category);
}

function checkOnlyZeroOrXChildrenAreAllowed(parentCategory, childCategory, legalAmountOfChildren) {
    var illegalAmountOfChildren = legalAmountOfChildren - 1;

    var resultWithZeroChildren = makeParentWithChildren(parentCategory, []);
    var resultWithLegalAmountOfChildren = makeParentWithChildren(parentCategory, split(childCategory, legalAmountOfChildren));
    var resultWithIllegalAmountOfChildren = makeParentWithChildren(parentCategory, split(childCategory, illegalAmountOfChildren));

    expectValid(resultWithZeroChildren, "0 results (as children) should be allowed for category " + parentCategory);
    expectValid(resultWithLegalAmountOfChildren, legalAmountOfChildren + " results (as children) should be allowed for category " + parentCategory);
    expectInvalid(resultWithIllegalAmountOfChildren, illegalAmountOfChildren + " results (as children) should be allowed for category " + parentCategory);
}

function split(str, times) {
    var strs = [];
    for (var i = 0; i < times; i++) {
        strs.push(str);
    }
    return strs;
}

function makeParentWithChildren(parentCategory, childrenCategories) {
    var children = makeResults(childrenCategories);
    var result = new Result({
        category: parentCategory,
        consists_of: children
    });
    return result;
}

function makeResults(categories) {
    var results = [];
    categories.forEach(function (category) {
        results.push(new Result({
            category: category
        }));
    });
    return results;
}

function expectValid(result, message) {
    var validator = new ResultSchemaValidator(result);
    validator.isValid().should.be.exactly(true, message);
}

function expectInvalid(result, message) {
    var validator = new ResultSchemaValidator(result);
    validator.isValid().should.be.exactly(false, message);
}