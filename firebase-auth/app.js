$(document).ready(() => {

$('#nav-log-reg').hide();
$('#nav-loggedin').hide();

  //initialize the firebase app
  var firebaseConfig = {
  	apiKey: "API_KEY",
  	authDomain: "PROJECT_ID.firebaseapp.com",
  	databaseURL: "https://PROJECT_ID.firebaseio.com",
  	projectId: "PROJECT_ID",
  	storageBucket: "PROJECT_ID.appspot.com",
  	messagingSenderId: "SENDER_ID",
  	appId: "APP_ID",
  	measurementId: "G-MEASUREMENT_ID",
   };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //create firebase references
  const Auth = firebase.auth(); 

  //Login
  $('#loginForm').on('submit', (e) => {
    e.preventDefault();
   
    if ($('#loginEmail').val() && $('#loginPassword').val()) {
      //login the user
      let creds = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
      };
      firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
        .then((userCredential) => {

          loginSuccessAction(userCredential);

        })
        .catch((error) => {


          if(error.code === 'auth/user-not-found') {

              if(verifyUserWithLegacyAuth(creds.email, creds.password) == true){

                    createNewUserinFirebase(firebase, creds.email, creds.password);

              }else{

                errorWhileAuthAndUserCreation(error);

              }

          }else{

                errorWhileAuthAndUserCreation(error);

          }

        });
    }
  });

  $('#logout').on('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut().then(()=>{

      console.log('Signed Out Successfully')

    })
    .catch((e)=>{

      console.err(e.message);

    });
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //user signed in.
      auth = user;
      username = user.displayName == null ? user.email : user.displayName;

      $('body').removeClass('auth-false').addClass('auth-true');
      $('#username').html('Welcome, '+username); 
      $('#nav-username').html(username);
      $('#nav-loggedin').show();
      $('#nav-log-reg').hide(); 

      
    } else {
      // No user is signed in.
      auth = false;
      $('body').removeClass('auth-true').addClass('auth-false');
      $('#username').html('');
      $('#nav-log-reg').show();
      $('#nav-loggedin').hide();

    }

  });


  // can also use below to check state of the user

  /*var user = firebase.auth().currentUser;

    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    } 
*/

});

verifyUserWithLegacyAuth = (email, password) => {

    console.log('verifyuser=>'+email+':'+password);

        return true;
}

createNewUserinFirebase = (firebase, email, password) => {

  var response = [];

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      loginSuccessAction(userCredential);
      // ...
    })
    .catch((error) => {

      errorWhileAuthAndUserCreation(error);
      // ..
    });

}

loginSuccessAction = (userCredential) => {

          user = userCredential.user;
          let username = user.displayName == null ? user.email : user.displayName;

          $('#username').html('Welcome, '+username); 
          $('#nav-username').html(username);
          $('#loginModal').modal('hide'); 

}

errorWhileAuthAndUserCreation = (error) => {

      $('#login-error').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;&nbsp;'+error.message);

}


