//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var serveAngular = require('serve-angular');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var ejs = require('ejs').compile();
var Firebase = require("firebase");
var FireRef = new Firebase("https://pennypincher.firebaseio.com/");
var bodyParser = require("body-parser");
var request = require('request');


var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.urlencoded({extended: false}));
router.set('view engine', 'ejs'); //set the engine to ejs so you can actually view it

//ANYTHING YOU WANT TO SHOW ON THE HOMEPAGE(PROCESS) DATA
router.get("/",function(req,res){

      
      var yelp = require("yelp").createClient({
        consumer_key: "44dGAgblwMC4eiapEgv2Eg", 
        consumer_secret: "7cLJ2tyXnPmdvWDakkcyRTs4qYY",
        token: "a85eWTlMIhs34Ehs-z9ZmPxrbrVPAMnv",
        token_secret: "9qxs-Xd-d11WrjGd_96yQB-raQY"
      });
  
  
        res.render("index");

      //On Page Load, Start Socket Connection
        io.on('connection', function (socket) {
        
        //Start Location socket Listening
        socket.once('location', function (data) {
            
            
            yelp.search({term: "restaurants", location: data['city'], deals_filter: true, limit: 9}, function(error, data) {
                
                //console.log(data);
                socket.emit('yelpData', {yelp:data});

              
            });
            
        });
});

      //Template Render for loading route.
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