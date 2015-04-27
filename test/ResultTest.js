/// <reference path="../model/Result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>
var chai = require("chai");
var result = require("../model/Result");
var ResultFactory = result.ResultFactory;
var expect = chai.expect;
describe("ResultFactory", function () {
    it("should have a score of 0 by default", function () {
        var res = new ResultFactory("sh", "cat").create();
        expect(res).to.have.property("score", 0);
    });
    describe("Result with no children", function () {
        var factory = new ResultFactory("sh", "cat");
        factory.setScore(591);
        var res = factory.create();
        it("should have a shooter", function () {
            expect(res).to.have.property("shooter", "sh");
        });
        it("should have a category", function () {
            expect(res).to.have.property("category", "cat");
        });
        it("should have a score of 591", function () {
            expect(res).to.have.property("score", 591);
        });
        it("should not have children", function () {
            expect(res).to.have.property("children").with.length(0);
        });
    });
    describe("Child tree with height 1", function () {
        var factory = new ResultFactory("sh", "match");
        var kneelingFactory = factory.child("kneeling", 290).add();
        var standingFactory = factory.child("standing", 280).add();
        var res = factory.create();
        it("should have a shooter", function () {
            expect(res).to.have.property("shooter", "sh");
        });
        it("should have a category", function () {
            expect(res).to.have.property("category", "match");
        });
        it("should have 2 children", function () {
            expect(res).to.have.property("children").with.length(2);
        });
        it("should cummulate the score of the nested results", function () {
            expect(res.score).to.equal(290 + 280);
        });
        describe("first child", function () {
            var child = res.children[0];
            it("should have a category", function () {
                expect(child).to.have.property("category", "kneeling");
            });
            it("should not have children", function () {
                expect(child).to.have.property("children").with.length(0);
            });
            it("should have a score of 290", function () {
                expect(child.score).to.equal(290);
            });
        });
        describe("second child", function () {
            var child = res.children[1];
            it("should have a category", function () {
                expect(child).to.have.property("category", "standing");
            });
            it("should not have children", function () {
                expect(child).to.have.property("children").with.length(0);
            });
            it("should have a score of 280", function () {
                expect(child.score).to.equal(280);
            });
        });
    });
    describe("Child tree with height 2", function () {
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
        it("should have 2 children", function () {
            expect(res).to.have.property("children").with.length(2);
        });
        describe("tier 1.1", function () {
            it("should have 2 children", function () {
                expect(res.children[0]).to.have.property("children").with.length(2);
            });
            it("should have a score of " + (80 + 81), function () {
                expect(res.children[0].score).to.equal(80 + 81);
            });
            describe("tier 1.1.1", function () {
                it("shoud not have children", function () {
                    expect(res.children[0].children[0]).to.have.property("children").with.length(0);
                });
                it("should have a score of 80", function () {
                    expect(res.children[0].children[0].score).to.equal(80);
                });
            });
            describe("tier 1.1.2", function () {
                it("shoud not have children", function () {
                    expect(res.children[0].children[1]).to.have.property("children").with.length(0);
                });
                it("should have a score of 81", function () {
                    expect(res.children[0].children[1].score).to.equal(81);
                });
            });
        });
        describe("tier 1.2", function () {
            it("should have 3 children", function () {
                expect(res.children[1]).to.have.property("children").with.length(3);
            });
            it("should have a score of " + (90 + 91 + 92), function () {
                expect(res.children[1].score).to.equal(90 + 91 + 92);
            });
            describe("tier 1.2.1", function () {
                it("shoud not have children", function () {
                    expect(res.children[1].children[0]).to.have.property("children").with.length(0);
                });
                it("should have a score of 90", function () {
                    expect(res.children[1].children[0].score).to.equal(90);
                });
            });
            describe("tier 1.2.2", function () {
                it("shoud not have children", function () {
                    expect(res.children[1].children[1]).to.have.property("children").with.length(0);
                });
                it("should have a score of 91", function () {
                    expect(res.children[1].children[1].score).to.equal(91);
                });
            });
            describe("tier 1.2.3", function () {
                it("shoud not have children", function () {
                    expect(res.children[1].children[2]).to.have.property("children").with.length(0);
                });
                it("should have a score of 92", function () {
                    expect(res.children[1].children[2].score).to.equal(92);
                });
            });
        });
    });
});
//# sourceMappingURL=ResultTest.js.map