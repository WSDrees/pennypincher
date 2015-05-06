angular.module('penny', ['ngRoute'])
.controller('userInfo', userInfo);
var socket = io.connect();

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
  }


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