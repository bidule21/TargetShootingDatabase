var Result = require("../../model/Result");

describe("Result",function(){
    
    it("should have a category", function(){
        var result = new Result();
        result.should.have.property("category");
    });

    describe("getScore()",function(){
        it("should return the score when it has no children",function(){
            var result = new Result({score:591});
            result.getScore().should.be.exactly(591);
        });
        
        it("should return the score of it's children when it has children",function(){
            var child1 = new Result({score:290});
            var child2 = new Result({score:280});
            var parent = new Result({consists_of:[child1,child2]});
            parent.getScore().should.be.exactly(570);
        });
    });
    
});