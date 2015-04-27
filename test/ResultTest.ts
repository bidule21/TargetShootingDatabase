/// <reference path="../model/Result.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import result = require("../model/Result");

var ResultFactory = result.ResultFactory;
var expect = chai.expect;

describe("ResultFactory", () => {

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
});