//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var yelp = require('yelp');
var serveAngular = require('serve-angular');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var Firebase = require("firebase");
var FireRef = new Firebase("https://pennypincher.firebaseio.com/");
var bodyParser = require("body-parser");
var curl = require("curlrequest");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.urlencoded({extended: false}));
router.set('view engine', 'ejs'); //set the engine to ejs so you can actually view it

//ANYTHING YOU WANT TO SHOW ON THE HOMEPAGE(PROCESS) DATA
router.get("/",function(req,res){
      res.render("index");
});

router.get('/yelp', function(){
  
    io.on('connection', function (socket) {
    
        socket.on('location', function (data) {

            var options = { url: 'http://api.yelp.com/business_review_search?term=chinese&amp;lat='+data['lat']+'&amp;long='+data['long']+'&amp;radius=10&amp;limit=5&amp;ywsid=YTfBsfvQR_JdGPmD4SqTWA', include: true };
              
            curl.request(options, function(err, yelpResults) {
              
            socket.emit('yelpData', {yelp:yelpResults});
              
            });
              
        });
        
  socket.on('yelpData', function (data) {
        console.log(data);
        //KEEP AT THE BOTTOM
        res.send("returned", {yelpResults:data});
        
  });
        
});
  
});

router.get("/profile", function(req,res){
  
  console.log("profile");
  
  //KEEP AT BOTTOM
  res.render("profile");
});

router.post("/processSearch",function(req,res){
  var foodType = req.body.foodType;
  
  console.log(foodType);

});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});