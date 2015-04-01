/// <reference path="../../result/Result" />
/// <reference path="../../result/ResultSchema" />
var expect = require("chai").expect;
var ResultFactory = Model.ResultFactory;
var CAT = Model.CAT;
var ResultSchemaValidator = Model.ResultSchemaValidator;
describe("ResultSchema", function () {
    it("should detect unknown categories", function () {
        var factory = new Model.ResultFactory("Horst", "WTF!");
        var create = function () {
            new ResultSchemaValidator(factory.create());
        };
        expect(create).to.throw();
    });
    it("should have a schema for every category", function () {
        Model.CAT.ALL.forEach(function (category) {
            var factory = new Model.ResultFactory("Horst", category);
            new Model.ResultSchemaValidator(factory.create());
        });
    });
    it("should always contain it's specified category", function () {
        var factory = new Model.ResultFactory("Horst", Model.CAT.A10_20);
        factory.child(Model.CAT.A10_1).add();
        factory.child(Model.CAT.A10_1).add();
        checkInvalid(factory.create(), "A result may only have child categories which are specified in its schema");
    });
    it("should check results recursively", function () {
        var factory = new Model.ResultFactory("Horst", Model.CAT.A10_20);
        var invalidFactory = factory.child(Model.CAT.A10_10);
        invalidFactory.child(Model.CAT.A10_10).add();
        invalidFactory.add();
        checkInvalid(factory.create(), "The results contains nested results which are invalid, but they were not detected");
    });
    describe(Model.CAT.A10_1, function () {
        resultWithNoChildrenTestSuite(Model.CAT.A10_1, 10);
    });
    describe(Model.CAT.A10_10, function () {
        combinedResultTestSuite(Model.CAT.A10_10, Model.CAT.A10_1, 10, 100);
    });
    describe(Model.CAT.A10_20, function () {
        combinedResultTestSuite(Model.CAT.A10_20, Model.CAT.A10_10, 2, 200);
    });
    describe(Model.CAT.A10_30, function () {
        combinedResultTestSuite(Model.CAT.A10_30, Model.CAT.A10_10, 3, 300);
    });
    describe(Model.CAT.A10_40, function () {
        combinedResultTestSuite(Model.CAT.A10_40, Model.CAT.A10_10, 4, 400);
    });
    describe(Model.CAT.A10_60, function () {
        combinedResultTestSuite(Model.CAT.A10_60, Model.CAT.A10_10, 6, 600);
    });
    describe(Model.CAT.A30_K_1, function () {
        resultWithNoChildrenTestSuite(Model.CAT.A30_K_1, 10);
    });
    describe(Model.CAT.A30_K_10, function () {
        combinedResultTestSuite(Model.CAT.A30_K_10, Model.CAT.A30_K_1, 10, 100);
    });
    describe(Model.CAT.A30_K_20, function () {
        combinedResultTestSuite(Model.CAT.A30_K_20, Model.CAT.A30_K_10, 2, 200);
    });
    describe(Model.CAT.A30_K_30, function () {
        combinedResultTestSuite(Model.CAT.A30_K_30, Model.CAT.A30_K_10, 3, 300);
    });
    describe(Model.CAT.A30_S_1, function () {
        resultWithNoChildrenTestSuite(Model.CAT.A30_S_1, 10);
    });
    describe(Model.CAT.A30_S_10, function () {
        combinedResultTestSuite(Model.CAT.A30_S_10, Model.CAT.A30_S_1, 10, 100);
    });
    describe(Model.CAT.A30_S_20, function () {
        combinedResultTestSuite(Model.CAT.A30_S_20, Model.CAT.A30_S_10, 2, 200);
    });
    describe(Model.CAT.A30_S_30, function () {
        combinedResultTestSuite(Model.CAT.A30_S_30, Model.CAT.A30_S_10, 3, 300);
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
    var factory = new Model.ResultFactory("horst", category);
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
    var factory = new Model.ResultFactory("Horst", parentCategory);
    childrenCategories.forEach(function (category) {
        factory.child(category).add();
    });
    return factory.create();
}
function checkValid(result, message) {
    var validator = new Model.ResultSchemaValidator(result);
    expect(validator.isValid()).to.be.true;
}
function checkInvalid(result, message) {
    var validator = new Model.ResultSchemaValidator(result);
    expect(validator.isValid()).to.be.false;
}
