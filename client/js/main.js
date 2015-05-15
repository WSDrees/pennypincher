/* Regular Javascript code here */
        var socket = io.connect();
        //When Page Loads, run the NoGPS callback
        window.onload = function(){
            var location = NoGPS.getLocation(myCallback);
        };
        //Calling function for noGPS
        function myCallback(location) {
            
            var location = JSON.stringify(location);
            var data = JSON.parse(location);

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
      console.log('Sorry, something broke');
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
  }

$scope.logout = function(){
        
        FireRef.unauth();
        FireRef.onAuth(callBack);
        window.location.href = "https://pennypincher-wsdrees.c9.io/";
  };
}