var Event = require("../../model/Event");

describe("Event",function(){
    
    it("should have a name and a description",function(){
        var event = new Event();
        event.should.have.property("name");
        event.should.have.property("description");
    });
});