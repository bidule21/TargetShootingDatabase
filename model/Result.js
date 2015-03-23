var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var availableCategories = "A10 Final;A10 20;A10 40;A10 40 Final;A10 60;A10 60 Final;A30 S 10;A30 S 20;A30 S 30;A30 K 10;A30 K 20;A30 K 30;A30 Match;A30 Final;A30 Match Final;LG 10;LG 10.f;LG 20;LG 20.f;LG 40;LG 40.f;LG 60;LG 60.f;LG Final 2013".split(";");

var resultSchema = new Schema({
    shooter: ObjectId,
    category: {
        type: String,
        enum: availableCategories
    },
    score: Number,
    consists_of: [resultSchema]
});

resultSchema.methods.getChildren = function () {
    var children = [];
    this.consists_of.forEach(function (resultData) {
        var Result = mongoose.model("Result", resultSchema);
        var result = new Result(resultData);
        children.push(result);
    });
    return children;
};

resultSchema.methods.getScore = function () {
    var score = 0;
    if (this.getChildren().length > 0) {
        this.getChildren().forEach(function (result) {
            score += result.getScore();
        });
    } else {
        score = this.score;
    }
    return score;
};

module.exports = mongoose.model("Result", resultSchema);