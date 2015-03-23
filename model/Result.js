var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var resultSchema = new Schema({
    shooter: ObjectId,
    category: String,
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