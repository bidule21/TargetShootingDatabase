var Result = require("../../model/Result");

describe("Result", function () {

    it("should have a category", function () {
        var result = new Result();
        result.should.have.property("category");
    });

    describe("getScore()", function () {
        it("should return the score when it has no children", function () {
            var result = new Result({
                score: 591
            });
            result.getScore().should.be.exactly(591);
        });

        it("should return the score of it's children when it has children", function () {
            var parent = new Result({
                consists_of: [{
                    score: 290
                }, {
                    score: 280
                }]
            });
            parent.getScore().should.be.exactly(570);
        });

        it("should return the score of it's children even though it has an own score", function () {
            var parent = new Result({
                score: 571, // shall be ignored
                consists_of: [{
                    score: 290
                }, {
                    score: 280
                }]
            });
            parent.getScore().should.be.exactly(570);
        });
    });

    describe("getChildren()", function () {
        it("should wrap raw data into a result object (inline)", function () {
            var result = new Result({
                consists_of: [{}, {}, {}]
            });
            result.getChildren().length.should.be.exactly(3);
        });

        it("should wrap raw data into a result object (separate objects)", function () {
            var result = new Result({
                consists_of: [new Result(), new Result(), new Result()]
            });
            result.getChildren().length.should.be.exactly(3);
        });
    });
});