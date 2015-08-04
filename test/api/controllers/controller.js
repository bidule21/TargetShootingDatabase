"use strict";

var should = require("should"),
    request = require("supertest"),
    invokeDatabaseTest = require("../../database-test-env.js"),
    app = require("../../../app"),
    Shooter = require("../../../api/helpers/models.js").Shooter,
    Result = require("../../../api/helpers/models.js").Result,
    Event = require("../../../api/helpers/models.js").Event;

function checkDocumentUpdatedMessage(err, res) {
    should.not.exist(err);

    should.exist(res.body);
    res.body.code.should.eql(200);
    res.body.type.should.eql("OK");
    res.body.message.should.eql("Record updated");
    should.exist(res.body.affected);
}

function checkBodyForOneRecord(err, res, check) {
    should.not.exist(err);

    should.exist(res.body);
    should.exist(res.body._id);
    check(res.body);
}

function checkNotFoundMessage(err, res) {
    should.not.exist(err);

    should.exist(res.body);
    res.body.code.should.eql(404);
    res.body.type.should.eql("ERROR");
    res.body.message.should.eql("Not found");
    should.not.exist(res.body.affected);
}

describe("controllers", function () {

    describe("shooter", function () {

        describe("GET /shooter/", function () {
            it("should return all shooters", function (done) {
                invokeDatabaseTest(
                    function () {
                        new Shooter({firstname: "John", lastname: "Doe"}).save();
                        new Shooter({firstname: "Max", lastname: "Mustermann"}).save();

                        request(app)
                            .get("/shooter")
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                should.not.exist(err);

                                res.body.length.should.eql(2);

                                should.exist(res.body[0]._id);
                                res.body[0].firstname.should.eql("John");
                                res.body[0].lastname.should.eql("Doe");

                                should.exist(res.body[1]._id);
                                res.body[1].firstname.should.eql("Max");
                                res.body[1].lastname.should.eql("Mustermann");

                                done();
                            });
                    });
            });
        });
        describe("GET /shooter/{id}", function () {
            it("should return a shooter when a valid id has been specified", function (done) {
                invokeDatabaseTest(
                    function () {
                        var shooter = new Shooter({firstname: "John", lastname: "Doe"});
                        shooter.save();

                        request(app)
                            .get("/shooter/" + shooter._id)
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                checkBodyForOneRecord(err, res, function (body) {
                                    body.firstname.should.eql("John");
                                    body.lastname.should.eql("Doe");
                                    done();
                                });
                            });
                    }
                );
            });

            it("returns an error message when the shooter hasn't been found", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .get("/shooter/aaaaaaaaaaaaaaaaaaaaaaaa")
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(404)
                            .end(function (err, res) {
                                checkNotFoundMessage(err, res);
                                done();
                            });
                    }
                );
            });
        });

        describe("POST /shooter/", function () {
            it("should create a shooter when parameters are sufficient", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/shooter?firstname=John&lastname=Doe")
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                checkDocumentUpdatedMessage(err, res);

                                Shooter.findById(res.body.affected, function (err) {
                                    if (err) throw new Error("Shooter not found on database");
                                    done();
                                });
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when all parameters are missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/shooter")
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when lastname is missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/shooter?firstname=John")
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when firstname is missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/shooter?lastname=Doe")
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });
        });
    });

    describe("result", function () {
        describe("POST /result/", function () {
            it("should create a result when parameters are sufficient", function (done) {
                var resultBody = {
                    score: 100,
                    category: "MyCategory"
                };

                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/result")
                            .send(resultBody)
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                checkDocumentUpdatedMessage(err, res);

                                // Check database
                                Result.findById(res.body.affected, function (err) {
                                    if (err) throw new Error("Result not found on database");
                                    done();
                                });
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when a body is missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .post("/result")
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });
        });
    });

    describe("event", function () {
        describe("GET /event", function () {
            it("should return all events", function (done) {
                invokeDatabaseTest(
                    function () {
                        new Event({description: "My Event 1"}).save();
                        new Event({description: "My Event 2"}).save();

                        request(app)
                            .get("/event")
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                should.not.exist(err);

                                res.body.length.should.eql(2);

                                should.exist(res.body[0]._id);
                                res.body[0].description.should.eql("My Event 1");

                                should.exist(res.body[1]._id);
                                res.body[1].description.should.eql("My Event 2");

                                done();
                            });
                    });
            });
        });

        describe("GET /event/{id}", function () {
            it("should return an event when a valid id has been specified", function (done) {
                invokeDatabaseTest(
                    function () {
                        var event = new Event({description: "My Event"});
                        event.save();

                        request(app)
                            .get("/event/" + event._id)
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                checkBodyForOneRecord(err, res, function (body) {
                                    body.description.should.eql("My Event");
                                    done();
                                });
                            });
                    }
                );
            });

            it("returns an error message when the event hasn't been found", function (done) {
                invokeDatabaseTest(
                    function () {
                        request(app)
                            .get("/event/aaaaaaaaaaaaaaaaaaaaaaaa")
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(404)
                            .end(function (err, res) {
                                checkNotFoundMessage(err, res);
                                done();
                            });
                    }
                );
            });
        });

        describe("POST /event/{id}/participation", function () {
            it("should append a participation to the specified event", function (done) {
                invokeDatabaseTest(
                    function () {
                        var event = new Event({description: "My Event"});
                        event.save();

                        var fakeShooterId = "aaaaaaaaaaaaaaaaaaaaaaaa";
                        var fakeResultId = "bbbbbbbbbbbbbbbbbbbbbbbb";

                        var url = "/event/" + event._id + "/participation?shooterId=" + fakeShooterId + "&resultId=" + fakeResultId;

                        request(app)
                            .post(url)
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end(function (err, res) {
                                checkDocumentUpdatedMessage(err, res);

                                // Check database
                                Event.findById(res.body.affected, function (err, reloadedEvent) {
                                    if (err) throw new Error("Event not found on database");

                                    should.exist(reloadedEvent.participations);
                                    reloadedEvent.participations.length.should.eql(1);
                                    reloadedEvent.participations[0].result.toString().should.eql(fakeResultId);
                                    reloadedEvent.participations[0].shooter.toString().should.eql(fakeShooterId);

                                    done();
                                });
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when a resultId is missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        var event = new Event({description: "My Event"});
                        event.save();

                        var fakeShooterId = "aaaaaaaaaaaaaaaaaaaaaaaa";

                        request(app)
                            .post("/event/" + event._id + "/participation?shooterId=" + fakeShooterId)
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });

            it("should respond with 400 'Bad Request' when a shooterId is missing", function (done) {
                invokeDatabaseTest(
                    function () {
                        var event = new Event({description: "My Event"});
                        event.save();

                        var fakeResultId = "bbbbbbbbbbbbbbbbbbbbbbbb";

                        request(app)
                            .post("/event/" + event._id + "/participation?resultId=" + fakeResultId)
                            .set("Accept", "application/json")
                            .expect(400)
                            .end(function (err, res) {
                                should.not.exist(err);
                                done();
                            });
                    }
                );
            });
        });
    });

});
