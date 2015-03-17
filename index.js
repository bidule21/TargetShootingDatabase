var http = require("http"),
    express = require("express"),
    MongoClient = require("mongodb").MongoClient,
    CollectionDriver = require("./collectionDriver").CollectionDriver;
    mongoose = require('mongoose');


var app = express();
app.set("port", process.env.PORT || 3000);

// SETUP DATABASE

var collectionDriver;
var mongoHost = process.env.DB_HOST;
var mongoDatabaseName = process.env.DB_NAME;
var mongoUser = process.env.DB_USER;
var mongoPassword = process.env.DB_PASSWORD;

var url;
if(mongoUser && mongoPassword){
    url = "mongodb://"+mongoUser+":"+mongoPassword+"@"+mongoHost+"/"+mongoDatabaseName;
} else{
    url = "mongodb://"+mongoHost+"/"+mongoDatabaseName;
}


mongoose.connect(url);
var db = mongoose.connection;
db.on("error", function(callback){
    console.error("Error! No connection to MongoDB");
    process.exit(1); 
});
db.once("open", function (callback) {
  console.log("Connection to MongoDB successfully established");
});


// SCHEMAS

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var shooterSchema = new Schema({
    firstname: String,
    lastname: String,
    country: String
});

var eventSchema = new Schema({
    name:String,
    participations:[{shooter:ObjectId, result:ObjectId}]
});

var resultSchema = new Schema({
    shooter:ObjectId,
    category:String,
    score:Number,
    consists_of:[ObjectId]
});

var Shooter = mongoose.model("Shooter",shooterSchema);
var Event = mongoose.model("Event",eventSchema);
var Result = mongoose.model("Result",resultSchema);

// ENABLE ROUTINGS

app.get("/", function (req, res) {
  res.send("RUNNING SKELETON");
});

app.get("/shooters",function(req,res){
    Shooter.find(function(err,shooters){
        res.send(shooters);
    });
});

app.get("/shooters/rnew",function(req,res){
    new Shooter().save(function(err,shooter){
        if (err) res.error(err);
        else res.send("Saved: "+shooter);
    });
});

app.get("/shooter/:id",function(req,res){
    Shooter.findById(
        req.params.id,
        function(err,shooter){
        res.send(shooter);
    });
});

app.delete("/shooter/:id",function(req,res){
    Shooter.findByIdAndRemove(req.params.id, function(deletedShooter){
        res.send(deletedShooter);
    });
});

// Error handling (when no rerouting has happened before)
app.use(function (req,res) {
    res.send("I don't know what you mean"); //2
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get("port"));
});