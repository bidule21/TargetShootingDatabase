var Result = require("../../model/Result");

describe("Result",function(){
    
    it("should have a category", function(){
        var result = new Result();
        result.should.have.property("category");
    });

});