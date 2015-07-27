"use strict";

var should = require("should"),
    request = require("supertest"),
    invokeDatabaseTest = require("../../database-test-env.js"),
    app = require("../../../app"),
    Shooter = require("../../../api/helpers/models.js").Shooter,
    Result = require("../../../api/helpers/models.js").Result;

describe("controllers", function () {

    describe("shooter", function () {
        
        describe("GET /shooter/", function () {
            it("should return all shooters on the database", function (done) {
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

                                should.exist(res.body[0]);
                                should.exist(res.body[1]);
                                should.not.exist(res.body[2]);

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
                                should.not.exist(err);

                                should.exist(res.body);
                                should.exist(res.body._id);
                                res.body.firstname.should.eql("John");
                                res.body.lastname.should.eql("Doe");

                                done();
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
                                should.not.exist(err);

                                should.exist(res.body);
                                res.body.code.should.eql(404);
                                res.body.type.should.eql("ERROR");
                                res.body.message.should.eql("Not found");
                                should.not.exist(res.body.result);

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
                                should.not.exist(err);

                                // Check answer
                                should.exist(res.body);

                                res.body.code.should.eql(200);
                                res.body.type.should.eql("SUCCESS");
                                res.body.message.should.eql("Record updated");
                                var id = res.body.affected;

                                // Check database
                                Shooter.findById(id, function (err) {
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
                                should.not.exist(err);

                                // Check answer
                                should.exist(res.body);

                                res.body.code.should.eql(200);
                                res.body.type.should.eql("SUCCESS");
                                res.body.message.should.eql("Record updated");
                                var id = res.body.affected;

                                // Check database
                                Result.findById(id, function (err) {
                                    if (err) throw new Error("Result not found on database");
                                    done();
                                });
                            });
                    }
                );
            });
        });
    });

});
