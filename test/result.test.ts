/// <reference path="../model/result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import result = require("../model/result");
import Categories = require("../model/Categories");

var ResultSchemaValidator = result.ResultSchemaValidator;
var ResultFactory = result.ResultFactory;
var expect = chai.expect;

describe("Result", () => {

    it("should have a score of 0 by default", () => {
        var res = new ResultFactory("sh", "cat").create();
        expect(res).to.have.property("score", 0)
    });

    describe("Result with no children", () => {
        var factory = new ResultFactory("sh", "cat");
        factory.setScore(591);
        var res = factory.create();

        it("should have a shooter", () => {
            expect(res).to.have.property("shooter", "sh");
        });

        it("should have a category", () => {
            expect(res).to.have.property("category", "cat")
        });

        it("should have a score of 591", () => {
            expect(res).to.have.property("score", 591)
        });

        it("should not have children", () => {
            expect(res).to.have.property("children").with.length(0)
        })
    });

    describe("Child tree with height 1", () => {
        var factory = new ResultFactory("sh", "match");
        var kneelingFactory = factory.child("kneeling", 290).add();
        var standingFactory = factory.child("standing", 280).add();

        var res = factory.create();

        it("should have a shooter", () => {
            expect(res).to.have.property("shooter", "sh")
        });

        it("should have a category", () => {
            expect(res).to.have.property("category", "match")
        });

        it("should have 2 children", () => {
            expect(res).to.have.property("children").with.length(2)
        });

        it("should cummulate the score of the nested results", () => {
            expect(res.score).to.equal(290 + 280)
        });

        describe("first child", () => {
            var child = res.children[0];
            it("should have a category", () => {
                expect(child).to.have.property("category", "kneeling")
            });

            it("should not have children", () => {
                expect(child).to.have.property("children").with.length(0)
            });

            it("should have a score of 290", () => {
                expect(child.score).to.equal(290)
            })
        });

        describe("second child", () => {
            var child = res.children[1];
            it("should have a category", () => {
                expect(child).to.have.property("category", "standing")
            });

            it("should not have children", () => {
                expect(child).to.have.property("children").with.length(0)
            });

            it("should have a score of 280", () => {
                expect(child.score).to.equal(280)
            })
        })
    });

    describe("Child tree with height 2", () => {
        var factory = new ResultFactory("sh", "cat1");

        var factory_c11 = factory.child("cat1.1");
        factory_c11.child("cat1.1.1", 80).add();
        factory_c11.child("cat1.1.2", 81).add();
        factory_c11.add();

        var factory_c12 = factory.child("cat1.2");
        factory_c12.child("cat1.2.1", 90).add();
        factory_c12.child("cat1.2.2", 91).add();
        factory_c12.child("cat1.2.3", 92).add();
        factory_c12.add();

        var res = factory.create();

        it("should have 2 children", () => {
            expect(res).to.have.property("children").with.length(2)
        });

        describe("tier 1.1", () => {
            it("should have 2 children", () => {
                expect(res.children[0]).to.have.property("children").with.length(2)
            });

            it("should have a score of " + (80 + 81), () => {
                expect(res.children[0].score).to.equal(80 + 81)
            });

            describe("tier 1.1.1", () => {
                it("shoud not have children", () => {
                    expect(res.children[0].children[0]).to.have.property("children").with.length(0)
                });
                it("should have a score of 80", () => {
                    expect(res.children[0].children[0].score).to.equal(80)
                })
            });

            describe("tier 1.1.2", () => {
                it("shoud not have children", () => {
                    expect(res.children[0].children[1]).to.have.property("children").with.length(0)
                });
                it("should have a score of 81", () => {
                    expect(res.children[0].children[1].score).to.equal(81)
                })
            })
        });

        describe("tier 1.2", () => {
            it("should have 3 children", () => {
                expect(res.children[1]).to.have.property("children").with.length(3)
            });

            it("should have a score of " + (90 + 91 + 92), () => {
                expect(res.children[1].score).to.equal(90 + 91 + 92)
            });

            describe("tier 1.2.1", () => {
                it("shoud not have children", () => {
                    expect(res.children[1].children[0]).to.have.property("children").with.length(0)
                });
                it("should have a score of 90", () => {
                    expect(res.children[1].children[0].score).to.equal(90)
                })
            });

            describe("tier 1.2.2", () => {
                it("shoud not have children", () => {
                    expect(res.children[1].children[1]).to.have.property("children").with.length(0)
                });
                it("should have a score of 91", () => {
                    expect(res.children[1].children[1].score).to.equal(91)
                })
            });

            describe("tier 1.2.3", () => {
                it("shoud not have children", () => {
                    expect(res.children[1].children[2]).to.have.property("children").with.length(0)
                });
                it("should have a score of 92", () => {
                    expect(res.children[1].children[2].score).to.equal(92)
                })
            })
        })
    })

    describe("Schemas", () => {
        it("should detect unknown categories", () => {
            var factory = new result.ResultFactory("Horst", "WTF!");
            var create = function () {
                new ResultSchemaValidator(factory.create())
            };
            expect(create).to.throw()
        });

        it("should have a schema for every category", () => {
            Categories.ALL.forEach((category) => {
                var factory = new ResultFactory("Horst", category);
                new ResultSchemaValidator(factory.create())
            })
        });

        it("should always contain it's specified category", () => {
            var factory = new ResultFactory("Horst", Categories.A10_20);
            factory.child(Categories.A10_1).add();
            factory.child(Categories.A10_1).add();

            checkInvalid(factory.create(), "A result may only have child schema.Categories which are specified in its schema")
        });

        it("should check results recursively", () => {
            var factory = new ResultFactory("Horst", Categories.A10_20);
            var invalidFactory = factory.child(Categories.A10_10);
            invalidFactory.child(Categories.A10_10).add();
            invalidFactory.add();
            checkInvalid(factory.create(), "The results contains nested results which are invalid, but they were not detected")
        });

        describe(Categories.A10_1, () => {
            resultWithNoChildrenTestSuite(Categories.A10_1, 10)
        });

        describe(Categories.A10_10, () => {
            combinedResultTestSuite(Categories.A10_10, Categories.A10_1, 10, 100)
        });

        describe(Categories.A10_20, () => {
            combinedResultTestSuite(Categories.A10_20, Categories.A10_10, 2, 200)
        });

        describe(Categories.A10_30, () => {
            combinedResultTestSuite(Categories.A10_30, Categories.A10_10, 3, 300)
        });

        describe(Categories.A10_40, () => {
            combinedResultTestSuite(Categories.A10_40, Categories.A10_10, 4, 400)
        });

        describe(Categories.A10_60, () => {
            combinedResultTestSuite(Categories.A10_60, Categories.A10_10, 6, 600)
        });

        describe(Categories.A30_K_1, () => {
            resultWithNoChildrenTestSuite(Categories.A30_K_1, 10)
        });

        describe(Categories.A30_K_10, () => {
            combinedResultTestSuite(Categories.A30_K_10, Categories.A30_K_1, 10, 100)
        });

        describe(Categories.A30_K_20, () => {
            combinedResultTestSuite(Categories.A30_K_20, Categories.A30_K_10, 2, 200)
        });

        describe(Categories.A30_K_30, () => {
            combinedResultTestSuite(Categories.A30_K_30, Categories.A30_K_10, 3, 300)
        });

        describe(Categories.A30_S_1, () => {
            resultWithNoChildrenTestSuite(Categories.A30_S_1, 10)
        });

        describe(Categories.A30_S_10, () => {
            combinedResultTestSuite(Categories.A30_S_10, Categories.A30_S_1, 10, 100)
        });

        describe(Categories.A30_S_20, () => {
            combinedResultTestSuite(Categories.A30_S_20, Categories.A30_S_10, 2, 200)
        });

        describe(Categories.A30_S_30, () => {
            combinedResultTestSuite(Categories.A30_S_30, Categories.A30_S_10, 3, 300)
        });


        function resultWithNoChildrenTestSuite(category, maxScore) {
            it("should not have children", () => {
                checkOnlyZeroChildrenAreAllowed(category)
            });

            it("should have a score between 0 and " + maxScore, () => {
                checkScore(category, maxScore)
            })
        }

        function combinedResultTestSuite(parentCategory, childCategory, allowedChildrenCount, maxScore) {
            it("should consist of 0 or " + allowedChildrenCount + " results with category " + childCategory, () => {
                checkZeroChildrenAreAllowed(parentCategory);
                checkOnlyAmountOfChildrenAreAllowed(parentCategory, childCategory, allowedChildrenCount)
            });

            it("should have a score between 0 and " + maxScore, () => {
                checkScore(parentCategory, maxScore)
            })
        }

        function checkScore(category:string, maximum:number) {
            var factory = new ResultFactory("horst", category);

            var resultWithMinimumScore = factory.setScore(0).create();
            var resultWithMaximumScore = factory.setScore(maximum).create();
            var resultWithScoreInBetween = factory.setScore(maximum / 2).create();
            var resultWithNegativeScore = factory.setScore(-1).create();
            var resultWithScoreOverflow = factory.setScore(maximum + 1).create();

            checkValid(resultWithMinimumScore,
                category + " should allow results with a score of 0");
            checkValid(resultWithMaximumScore,
                category + " should allow results with a score of " + maximum);
            checkValid(resultWithScoreInBetween,
                category + " should allow results with a score of " + maximum / 2);
            checkInvalid(resultWithNegativeScore,
                category + " should not allow results with negative scores");
            checkInvalid(resultWithScoreOverflow,
                category + " should not allow results whose scores are bigger than " + maximum)
        }

        function checkOnlyZeroChildrenAreAllowed(category:string) {
            var resultWithZeroChildren = makeParentWithChildren(category, []);
            var resultWithMultipleChildren = makeParentWithChildren(category, [{}]);

            checkValid(resultWithZeroChildren,
                "0 results (as children) should be allowed for category " + category);
            checkInvalid(resultWithMultipleChildren,
                "Not more than 0 children are allowed for category " + category)
        }

        function checkOnlyAmountOfChildrenAreAllowed(category:string, childCategory:string, legalAmountOfChildren:number) {
            var insufficientAmount = legalAmountOfChildren - 1;
            var overflowAmount = legalAmountOfChildren + 1;

            var resultWithLegalAmountOfChildren = makeParentWithChildren(
                category,
                split(childCategory, legalAmountOfChildren));
            var resultWithInsufficientAmountOfChildren = makeParentWithChildren(
                category,
                split(childCategory, insufficientAmount));
            var resultWithOverflowAmountOfChildren = makeParentWithChildren(
                category,
                split(childCategory, overflowAmount));

            checkValid(resultWithLegalAmountOfChildren,
                "A maximum of " + legalAmountOfChildren + " results (children) should be allowed for category " + category +
                ". Maybe this amount exceeds the maximum amount " +
                "of children or the maximum is specified wrong in the schema.");
            checkInvalid(resultWithInsufficientAmountOfChildren,
                insufficientAmount + " results (as children) should not be allowed for category " + category);
            checkInvalid(resultWithOverflowAmountOfChildren,
                overflowAmount + " results (as children) should not be allowed for category " + category);

            function split(str, times) {
                var strs = [];
                for (var i = 0; i < times; i++) {
                    strs.push(str)
                }
                return strs
            }
        }

        function checkZeroChildrenAreAllowed(category:string) {
            var resultWithZeroChildren = makeParentWithChildren(category, []);

            checkValid(resultWithZeroChildren,
                "0 results (as children) should be allowed for category " + category)
        }

        function makeParentWithChildren(parentCategory, childrenCategories) {
            var factory = new ResultFactory("Horst", parentCategory);
            childrenCategories.forEach((category) => {
                factory.child(category).add()
            });
            return factory.create()
        }

        function checkValid(result, message) {
            var validator = new ResultSchemaValidator(result);
            expect(validator.isValid()).to.be.true
        }

        function checkInvalid(result, message) {
            var validator = new ResultSchemaValidator(result);
            expect(validator.isValid()).to.be.false
        }

    });
});
