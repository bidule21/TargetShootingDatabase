var Shooter = require("../../model/Shooter");

describe("Shooter",function(){
    
    it("should have a firstname, a lastname and a country",function(){
        var shooter = new Shooter();
        shooter.should.have.property("firstname");
        shooter.should.have.property("lastname");
        shooter.should.have.property("country");
    });
});