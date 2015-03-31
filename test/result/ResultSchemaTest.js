/// <reference path="../../typed/mocha.d.ts" />
/// <reference path="../../typed/chai.d.ts" />
var res = require("../../result/Result");
var rsv = require("../../result/ResultSchema");
var expect = require("chai").expect;
describe("ResultSchema", function () {
    it("should detect unknown categories", function () {
        var factory = new res.ResultFactory("Horst", "WTF!");
        var create = function () {
            new rsv.ResultSchemaValidator(factory.create());
        };
        expect(create).to.throw();
    });
    it("should have a schema for every category", function () {
        rsv.CAT.ALL.forEach(function (category) {
            var factory = new res.ResultFactory("Horst", category);
            new rsv.ResultSchemaValidator(factory.create());
        });
    });
    it("should always contain it's specified category", function () {
        var factory = new res.ResultFactory("Horst", rsv.CAT.A10_20);
        factory.child(rsv.CAT.A10_1).add();
        factory.child(rsv.CAT.A10_1).add();
        checkInvalid(factory.create(), "A result may only have child categories which are specified in its schema");
    });
    it("should check results recursively", function () {
        var factory = new res.ResultFactory("Horst", rsv.CAT.A10_20);
        var invalidFactory = factory.child(rsv.CAT.A10_10);
        invalidFactory.child(rsv.CAT.A10_10).add();
        invalidFactory.add();
        checkInvalid(factory.create(), "The results contains nested results which are invalid, but they were not detected");
    });
    describe(rsv.CAT.A10_1, function () {
        resultWithNoChildrenTestSuite(rsv.CAT.A10_1, 10);
    });
    describe(rsv.CAT.A10_10, function () {
        combinedResultTestSuite(rsv.CAT.A10_10, rsv.CAT.A10_1, 10, 100);
    });
    describe(rsv.CAT.A10_20, function () {
        combinedResultTestSuite(rsv.CAT.A10_20, rsv.CAT.A10_10, 2, 200);
    });
    describe(rsv.CAT.A10_30, function () {
        combinedResultTestSuite(rsv.CAT.A10_30, rsv.CAT.A10_10, 3, 300);
    });
    describe(rsv.CAT.A10_40, function () {
        combinedResultTestSuite(rsv.CAT.A10_40, rsv.CAT.A10_10, 4, 400);
    });
    describe(rsv.CAT.A10_60, function () {
        combinedResultTestSuite(rsv.CAT.A10_60, rsv.CAT.A10_10, 6, 600);
    });
    describe(rsv.CAT.A30_K_1, function () {
        resultWithNoChildrenTestSuite(rsv.CAT.A30_K_1, 10);
    });
    describe(rsv.CAT.A30_K_10, function () {
        combinedResultTestSuite(rsv.CAT.A30_K_10, rsv.CAT.A30_K_1, 10, 100);
    });
    describe(rsv.CAT.A30_K_20, function () {
        combinedResultTestSuite(rsv.CAT.A30_K_20, rsv.CAT.A30_K_10, 2, 200);
    });
    describe(rsv.CAT.A30_K_30, function () {
        combinedResultTestSuite(rsv.CAT.A30_K_30, rsv.CAT.A30_K_10, 3, 300);
    });
    describe(rsv.CAT.A30_S_1, function () {
        resultWithNoChildrenTestSuite(rsv.CAT.A30_S_1, 10);
    });
    describe(rsv.CAT.A30_S_10, function () {
        combinedResultTestSuite(rsv.CAT.A30_S_10, rsv.CAT.A30_S_1, 10, 100);
    });
    describe(rsv.CAT.A30_S_20, function () {
        combinedResultTestSuite(rsv.CAT.A30_S_20, rsv.CAT.A30_S_10, 2, 200);
    });
    describe(rsv.CAT.A30_S_30, function () {
        combinedResultTestSuite(rsv.CAT.A30_S_30, rsv.CAT.A30_S_10, 3, 300);
    });
});
function resultWithNoChildrenTestSuite(category, maxScore) {
    it("should not have children", function () {
        checkOnlyZeroChildrenAreAllowed(category);
    });
    it("should have a score between 0 and " + maxScore, function () {
        checkScore(category, maxScore);
    });
}
function combinedResultTestSuite(parentCategory, childCategory, allowedChildrenCount, maxScore) {
    it("should consist of 0 or " + allowedChildrenCount + " results with category " + childCategory, function () {
        checkZeroChildrenAreAllowed(parentCategory);
        checkOnlyAmountOfChildrenAreAllowed(parentCategory, childCategory, allowedChildrenCount);
    });
    it("should have a score between 0 and " + maxScore, function () {
        checkScore(parentCategory, maxScore);
    });
}
function checkScore(category, maximum) {
    var factory = new res.ResultFactory("horst", category);
    var resultWithMinimumScore = factory.setScore(0).create();
    var resultWithMaximumScore = factory.setScore(maximum).create();
    var resultWithScoreInBetween = factory.setScore(maximum / 2).create();
    var resultWithNegativeScore = factory.setScore(-1).create();
    var resultWithScoreOverflow = factory.setScore(maximum + 1).create();
    checkValid(resultWithMinimumScore, category + " should allow results with a score of 0");
    checkValid(resultWithMaximumScore, category + " should allow results with a score of " + maximum);
    checkValid(resultWithScoreInBetween, category + " should allow results with a score of " + maximum / 2);
    checkInvalid(resultWithNegativeScore, category + " should not allow results with negative scores");
    checkInvalid(resultWithScoreOverflow, category + " should not allow results whose scores are bigger than " + maximum);
}
function checkOnlyZeroChildrenAreAllowed(category) {
    var resultWithZeroChildren = makeParentWithChildren(category, []);
    var resultWithMultipleChildren = makeParentWithChildren(category, [
        {}
    ]);
    checkValid(resultWithZeroChildren, "0 results (as children) should be allowed for category " + category);
    checkInvalid(resultWithMultipleChildren, "Not more than 0 children are allowed for category " + category);
}
function checkOnlyAmountOfChildrenAreAllowed(category, childCategory, legalAmountOfChildren) {
    var insufficientAmount = legalAmountOfChildren - 1;
    var overflowAmount = legalAmountOfChildren + 1;
    var resultWithLegalAmountOfChildren = makeParentWithChildren(category, split(childCategory, legalAmountOfChildren));
    var resultWithInsufficientAmountOfChildren = makeParentWithChildren(category, split(childCategory, insufficientAmount));
    var resultWithOverflowAmountOfChildren = makeParentWithChildren(category, split(childCategory, overflowAmount));
    checkValid(resultWithLegalAmountOfChildren, "A maximum of " + legalAmountOfChildren + " results (children) should be allowed for category " + category + ". Maybe this amount exceeds the maximum amount " + "of children or the maximum is specified wrong in the schema.");
    checkInvalid(resultWithInsufficientAmountOfChildren, insufficientAmount + " results (as children) should not be allowed for category " + category);
    checkInvalid(resultWithOverflowAmountOfChildren, overflowAmount + " results (as children) should not be allowed for category " + category);
    function split(str, times) {
        var strs = [];
        for (var i = 0; i < times; i++) {
            strs.push(str);
        }
        return strs;
    }
}
function checkZeroChildrenAreAllowed(category) {
    var resultWithZeroChildren = makeParentWithChildren(category, []);
    checkValid(resultWithZeroChildren, "0 results (as children) should be allowed for category " + category);
}
function makeParentWithChildren(parentCategory, childrenCategories) {
    var factory = new res.ResultFactory("Horst", parentCategory);
    childrenCategories.forEach(function (category) {
        factory.child(category).add();
    });
    return factory.create();
}
function checkValid(result, message) {
    var validator = new rsv.ResultSchemaValidator(result);
    expect(validator.isValid()).to.be.true;
}
function checkInvalid(result, message) {
    var validator = new rsv.ResultSchemaValidator(result);
    expect(validator.isValid()).to.be.false;
}
