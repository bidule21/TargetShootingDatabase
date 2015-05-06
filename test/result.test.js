/// <reference path="../typings/test.d.ts"/>
var chai = require("chai");
var result = require("../model/result");
var categories = require("../model/categories");
var ResultSchemaValidator = result.ResultValidator;
var expect = chai.expect;
var Categories = categories.Categories;
describe("Result", function () {
    describe("score", function () {
        it("should be 0 by default", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            expect(res.score).to.equal(0);
        });
        it("should be editable", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            res.score = 100;
            expect(res.score).to.equal(100);
        });
        it("should cummulate the score when it has children", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            res.wrap({ category: Categories.A10_10, score: 98 });
            res.wrap({ category: Categories.A10_10, score: 97 });
            expect(res.score).to.equal(98 + 97);
        });
        it("should be ignored completely when the result has children", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            res.wrap({ category: Categories.A10_10, score: 98 });
            res.wrap({ category: Categories.A10_10, score: 97 });
            res.score = 100; // Ignored
            expect(res.score).to.equal(98 + 97);
        });
    });
    describe("Schemas", function () {
        it("should always contain it's specified category", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            res.wrap({ category: Categories.A10_1, score: 0 });
            res.wrap({ category: Categories.A10_1, score: 0 });
            checkInvalid(res, "A result may only have child schema.Categories which are specified in its schema");
        });
        it("should check results recursively", function () {
            var res = new result.ResultImpl("Horst", Categories.A10_20);
            var wrapped = res.wrap({ category: Categories.A10_10, score: 0 });
            wrapped.wrap({ category: Categories.A10_10, score: 0 });
            checkInvalid(res, "The results contains nested results which are invalid, but they were not detected");
        });
        describe(Categories.A10_1.name, function () {
            resultWithNoChildrenTestSuite(Categories.A10_1, 10);
        });
        describe(Categories.A10_10.name, function () {
            combinedResultTestSuite(Categories.A10_10, Categories.A10_1, 10, 100);
        });
        describe(Categories.A10_20.name, function () {
            combinedResultTestSuite(Categories.A10_20, Categories.A10_10, 2, 200);
        });
        describe(Categories.A10_30.name, function () {
            combinedResultTestSuite(Categories.A10_30, Categories.A10_10, 3, 300);
        });
        describe(Categories.A10_40.name, function () {
            combinedResultTestSuite(Categories.A10_40, Categories.A10_10, 4, 400);
        });
        describe(Categories.A10_60.name, function () {
            combinedResultTestSuite(Categories.A10_60, Categories.A10_10, 6, 600);
        });
        describe(Categories.A30_K_1.name, function () {
            resultWithNoChildrenTestSuite(Categories.A30_K_1, 10);
        });
        describe(Categories.A30_K_10.name, function () {
            combinedResultTestSuite(Categories.A30_K_10, Categories.A30_K_1, 10, 100);
        });
        describe(Categories.A30_K_20.name, function () {
            combinedResultTestSuite(Categories.A30_K_20, Categories.A30_K_10, 2, 200);
        });
        describe(Categories.A30_K_30.name, function () {
            combinedResultTestSuite(Categories.A30_K_30, Categories.A30_K_10, 3, 300);
        });
        describe(Categories.A30_S_1.name, function () {
            resultWithNoChildrenTestSuite(Categories.A30_S_1, 10);
        });
        describe(Categories.A30_S_10.name, function () {
            combinedResultTestSuite(Categories.A30_S_10, Categories.A30_S_1, 10, 100);
        });
        describe(Categories.A30_S_20.name, function () {
            combinedResultTestSuite(Categories.A30_S_20, Categories.A30_S_10, 2, 200);
        });
        describe(Categories.A30_S_30.name, function () {
            combinedResultTestSuite(Categories.A30_S_30, Categories.A30_S_10, 3, 300);
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
            var resultWithMinimumScore = new result.ResultImpl("Horst", category, 0);
            var resultWithMaximumScore = new result.ResultImpl("Horst", category, maximum);
            var resultWithScoreInBetween = new result.ResultImpl("Horst", category, maximum / 2);
            var resultWithNegativeScore = new result.ResultImpl("Horst", category, -1);
            var resultWithScoreOverflow = new result.ResultImpl("Horst", category, maximum + 1);
            checkValid(resultWithMinimumScore, category + " should allow results with a score of 0");
            checkValid(resultWithMaximumScore, category + " should allow results with a score of " + maximum);
            checkValid(resultWithScoreInBetween, category + " should allow results with a score of " + maximum / 2);
            checkInvalid(resultWithNegativeScore, category + " should not allow results with negative scores");
            checkInvalid(resultWithScoreOverflow, category + " should not allow results whose scores are bigger than " + maximum);
        }
        function checkOnlyZeroChildrenAreAllowed(category) {
            var resultWithZeroChildren = makeParentWithChildren(category, []);
            var resultWithMultipleChildren = makeParentWithChildren(category, [{}]);
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
                var strings = [];
                for (var i = 0; i < times; i++) {
                    strings.push(str);
                }
                return strings;
            }
        }
        function checkZeroChildrenAreAllowed(category) {
            var resultWithZeroChildren = makeParentWithChildren(category, []);
            checkValid(resultWithZeroChildren, "0 results (as children) should be allowed for category " + category);
        }
        function makeParentWithChildren(parentCategory, childrenCategories) {
            var res = new result.ResultImpl("Horst", parentCategory);
            childrenCategories.forEach(function (category) {
                res.wrap({ category: category, score: 0 });
            });
            return res;
        }
        function checkValid(result, message) {
            var validator = new ResultSchemaValidator();
            expect(validator.isValid(result)).to.be.true;
        }
        function checkInvalid(result, message) {
            var validator = new ResultSchemaValidator();
            expect(validator.isValid(result)).to.be.false;
        }
    });
});
//# sourceMappingURL=result.test.js.map