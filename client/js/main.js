var FireRef = new Firebase('https://pennypincher.firebaseio.com/');

$('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          FireRef.push({name: name, text: text});
          $('#messageInput').val('');
          $('#tb').text(name +" "+ text);
          
        }
    });
    
function login(){
    FireRef.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData.facebook.displayName);
    }
  });
}