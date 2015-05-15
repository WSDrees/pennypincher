//Regular Javascript code here
        var socket = io.connect();
        
        //When Page Loads, run the NoGPS callback
        window.onload = function(){
            var location = NoGPS.getLocation(myCallback);
            //console.log(location)
        };

        //Calling function for noGPS
        function myCallback(location) {
            
            var location = JSON.stringify(location);
            var data = JSON.parse(location);
            console.log(location);
        
            var city = data['city'];
            //Sends Location info to Node
            socket.emit('location', {city:city});

        }
        
        //Call Socket for returned Yelp Data
        socket.once('yelpData', function(data){
            var sendData = data.yelp.businesses;
            console.log(sendData);
            //Render using EJS's JS render feature.          
            var html = new EJS({url: 'returned.ejs'}).render(sendData);
            //Append EJS Render to Div on page.
            $('#divResults').append(html);
        
        });

    
/* Angulare Code Below here */        

angular.module('penny', ['ngRoute'])
.controller('userInfo', userInfo);

var FireRef = new Firebase('https://pennypincher.firebaseio.com/');

function userInfo($scope){
    FireRef.onAuth(callBack);
    var authData = FireRef.getAuth();
    
    if(authData){
       $scope.image = authData.facebook.cachedUserProfile.picture.data.url;
       $scope.name = authData.facebook.displayName;
    }else{
      //console.log('Sorry, something broke');
    }

    $scope.loginAction = function(){
    $scope.loginValue = true;
    FireRef.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $scope.loginValue = true;
          //FireRef.set({authData: authData});
          console.log("Authenticated successfully with payload:", authData);
          socket.emit('loginData', {data: authData});
          //console.log($scope.profileURL);
        window.location.href = "https://pennypincher-wsdrees.c9.io/";
        }
      });
    };
      
function callBack(authData){
    if(authData){
      $scope.loginValue = true;
    }else{
      socket.emit('loginData', {data: authData});
      $scope.loginValue = false;
      
    }
  }//END callBack()

$scope.logout = function(){
        
        FireRef.unauth();
        FireRef.onAuth(callBack);
        window.location.href = "https://pennypincher-wsdrees.c9.io/";
  };
}

$('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          FireRef.push({name: name, text: text});
          $('#messageInput').val('');
          $('#tb').text(name +" "+ text);
          
        }
});

function getLocation() {
    
        //navigator.geolocation.getCurrentPosition(showPosition);
        var location = navigator.geolocation.getCurrentPosition(showPosition);
        
        //navigator.geolocation.getCurrentPosition(showPosition);
        //console.log(navigator.geolocation.getCurrentPosition(showPosition));

}//END getLocation()

        // var lat = position.coords.latitude;
        // var long = position.coords.longitude;
        // console.log(long, lat);
        // socket.emit('location', { long:long, lat:lat});
        

function getDeals(yelp){
    
    var title = yelp.deals.title;
    var start = yelp.deals.time_start; 
    var end = yelp.deals.time_end;
    var popular = yelp.deals.is_popular;
    var url = yelp.deals.url;
    var image = yelp.deals.image_url;
    
    var dealOptions = { url: 'http://api.yelp.com/v2/businesses/'+title['title']+'&amp;start='+start['start']+'&amp;end='+end['end']+'&amp;popular='+popular['popular']+'&amp;url='+url['url']+'&amp;image'+image['image'] };
    
    // curl.request(dealOptions, function(err,yelpOptions){
    //     yelpOptions = yelpRet.split('\r\n');
    //     var yelpSend = yelpRet.pop(),
    //         yelpHead = yelpRet.pop();
            
    //     socket.emit('yelpData',{yelp:yelpSend});
    // });
    
}//END getDeals()