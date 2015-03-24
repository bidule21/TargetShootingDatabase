var Result = require("../../model/Result");
var ResultSchemaValidator = require("../../model/ResultSchema").ResultSchemaValidator;
var CAT_A10_30 = require("../../model/ResultSchema").CAT_A10_30;
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

        checkInvalid(result, "A result may only have child categories which are specified in its schema");
    });

    describe("A10 1", function () {
        var helper = new ResultSchemaTestHelper(CAT_A10_1);

        it("should not have children", function () {
            helper.checkOnlyZeroChildrenAreAllowed();
        });

        it("should have a score between 0 and 10", function () {
            helper.checkScore(10);
        });
    });

    describe("A10 10", function () {
        var helper = new ResultSchemaTestHelper(CAT_A10_10);

        it("should consist of 0 or 10 results with category A10 1", function () {
            helper.setChildCategory(CAT_A10_1);
            helper.checkZeroChildrenAreAllowed();
            helper.checkOnlyAmountOfChildrenAreAllowed(10);
        });

        it("should have a score between 0 and 100", function () {
            helper.checkScore(100);
        });
    });

    describe("A10 20", function () {
        var helper = new ResultSchemaTestHelper(CAT_A10_20);

        it("should consist of 0 or 2 results with category A10 10", function () {
            helper.setChildCategory(CAT_A10_10);
            helper.checkZeroChildrenAreAllowed();
            helper.checkOnlyAmountOfChildrenAreAllowed(2);
        });

        it("should have a score between 0 and 200", function () {
            helper.checkScore(200);
        });
    });

    describe("A10 30", function () {
        var helper = new ResultSchemaTestHelper(CAT_A10_30);

        it("should consist of 0 or 3 results with category A10 10", function () {
            helper.setChildCategory(CAT_A10_10);
            helper.checkZeroChildrenAreAllowed();
            helper.checkOnlyAmountOfChildrenAreAllowed(3);
        });

        it("should have a score between 0 and 300", function () {
            helper.checkScore(300);
        });
    });
});

function ResultSchemaTestHelper(category) {
    this.category = category;
}

ResultSchemaTestHelper.prototype.checkScore = function (maximum) {
    var resultWithMinimumScore = new Result({
        category: this.category,
        score: 0
    });
    var resultWithMaximumScore = new Result({
        category: this.category,
        score: maximum
    });
    var resultWithScoreInBetween = new Result({
        category: this.category,
        score: maximum / 2
    });
    var resultWithNegativeScore = new Result({
        category: this.category,
        score: -1
    });
    var resultWithScoreOverflow = new Result({
        category: this.category,
        score: maximum + 1
    });

    checkValid(resultWithMinimumScore,
        this.category + " should allow results with a score of 0");
    checkValid(resultWithMaximumScore,
        this.category + " should allow results with a score of " + maximum);
    checkValid(resultWithScoreInBetween,
        this.category + " should allow results with a score of " + maximum / 2);
    checkInvalid(resultWithNegativeScore,
        this.category + " should not allow results with negative scores");
    checkInvalid(resultWithScoreOverflow,
        this.category + " should not allow results whose scores are bigger than " + maximum);
};

ResultSchemaTestHelper.prototype.checkOnlyZeroChildrenAreAllowed = function () {
    var resultWithZeroChildren = makeParentWithChildren(this.category, []);
    var resultWithMultipleChildren = makeParentWithChildren(this.category, [{}]);

    checkValid(resultWithZeroChildren,
        "0 results (as children) should be allowed for category " + this.category);
    checkInvalid(resultWithMultipleChildren,
        "Not more than 0 children are allowed for category " + this.category);
};

ResultSchemaTestHelper.prototype.checkOnlyAmountOfChildrenAreAllowed = function (legalAmountOfChildren) {
    var insufficientAmount = legalAmountOfChildren - 1;
    var overflowAmount = legalAmountOfChildren + 1;

    var resultWithLegalAmountOfChildren = makeParentWithChildren(
        this.category,
        split(this.childCategory, legalAmountOfChildren));
    var resultWithInsufficientAmountOfChildren = makeParentWithChildren(
        this.category,
        split(this.childCategory, insufficientAmount));
    var resultWithOverflowAmountOfChildren = makeParentWithChildren(
        this.category,
        split(this.childCategory, overflowAmount));

    checkValid(resultWithLegalAmountOfChildren,
        "A maximum of " + legalAmountOfChildren + " results (children) should be allowed for category " + this.category +
        ". Maybe this amount exceeds the maximum amount " +
        "of children or the maximum is specified wrong in the schema.");
    checkInvalid(resultWithInsufficientAmountOfChildren,
        insufficientAmount + " results (as children) should not be allowed for category " + this.category);
    checkInvalid(resultWithOverflowAmountOfChildren,
        overflowAmount + " results (as children) should not be allowed for category " + this.category);
};

ResultSchemaTestHelper.prototype.checkZeroChildrenAreAllowed = function () {
    var resultWithZeroChildren = makeParentWithChildren(this.category, []);

    checkValid(resultWithZeroChildren,
        "0 results (as children) should be allowed for category " + this.category);
};

ResultSchemaTestHelper.prototype.setChildCategory = function (childCategory) {
    this.childCategory = childCategory;
};

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

function checkValid(result, message) {
    var validator = new ResultSchemaValidator(result);
    validator.isValid().should.be.exactly(true, message);
}

function checkInvalid(result, message) {
    var validator = new ResultSchemaValidator(result);
    validator.isValid().should.be.exactly(false, message);
}