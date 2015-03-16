var http = require('http'),
    express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3000);

// Database imports
var collectionDriver;
var mongoHost = process.env.DB_HOST;
var mongoDatabaseName = process.env.DB_NAME;
var mongoUser = process.env.DB_USER;
var mongoPassword = process.env.DB_PASSWORD;


MongoClient.connect("mongodb://"+mongoUser+":"+mongoPassword+"@"+mongoHost+"/"+mongoDatabaseName, function(err, db) {
  if(!err) {
      console.log("Connection to MongoDB successfully established");
      collectionDriver = new CollectionDriver(db);
  }else{
      console.error("Error! No connection to MongoDB " + mongoHost + ":" + mongoPort);
      process.exit(1); 
  }
});


// APPLICATION ROUTING
//
//
//


app.get('/', function (req, res) {
  res.send('RUNNING SKELETON');
});




// Error handling (when no rerouting has happened before)
app.use(function (req,res) { //1
    res.send("I don't know what you mean"); //2
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});