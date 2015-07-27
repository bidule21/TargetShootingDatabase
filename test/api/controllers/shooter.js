"use strict";

var should = require("should"),
    request = require("supertest"),
    invokeDatabaseTest = require("../../database-test-env.js"),
    app = require("../../../app"),
    Shooter = require("../../../api/helpers/models.js").Shooter;

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
                            .get("/shooter/"+shooter._id)
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

            it("returns an error message when the shooter hasn't been found", function(done){
                invokeDatabaseTest(
                    function(){
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

    });
});
