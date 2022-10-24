import objectAssign from "https://cdn.skypack.dev/object.assign@4.1.4";
//-------------------------------------------------------------
//Firebase Import Stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import $ from "https://cdn.skypack.dev/jquery@3.6.1";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAh2UMGoP4rV2Jx9OmMIAXRwRXl_heEA6Y",
    authDomain: "twitter-29c31.firebaseapp.com",
    databaseURL: "https://twitter-29c31-default-rtdb.firebaseio.com",
    projectId: "twitter-29c31",
    storageBucket: "twitter-29c31.appspot.com",
    messagingSenderId: "681005891952",
    appId: "1:681005891952:web:6cb3fb52a75e4a8aa94fb5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);
let titleRef = rtdb.ref(db, "/");


/*

rtdb.onValue(titleRef, ss=>{
  alert(JSON.stringify(ss.val()));
});
*/
/*---------------------------------------------------------------------------------------*/
//Hide and Show Classes

function login() {
  $(".home").hide();
  $(".login").show();
  $(".signUp").hide();
  $(".feed").hide();
  $(".newtweet").hide();
  $(".profilesettings").hide();
}

//Home Page function determines if the user is logged in. If user
//is not logged in, ask for signup/login, otherwise send to feed
function home() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      //console.log(uid);
      //console.log(user);
      feed();

    } else {
      $(".home").show();
      $(".login").hide();
      $(".signUp").hide();
      $(".feed").hide();
      $(".newtweet").hide();
      $(".profilesettings").hide();
    }
  });

}
function signUp(){
  $(".home").hide();
  $(".login").hide();
  $(".signUp").show();
  $(".feed").hide();
  $(".newtweet").hide();
  $(".profilesettings").hide();
}
function feed(){
  $(".home").hide();
  $(".login").hide();
  $(".signUp").hide();
  $(".feed").show();
  $(".newtweet").hide();
  $(".profilesettings").hide();
}
function newtweet(){
  $(".home").hide();
  $(".login").hide();
  $(".signUp").hide();
  $(".feed").hide();
  $(".newtweet").show();
  $(".profilesettings").hide();
}
function profilesettings(){
  $(".home").hide();
  $(".login").hide();
  $(".signUp").hide();
  $(".feed").hide();
  $(".newtweet").hide();
  $(".profilesettings").show();

}

home(); //start with the home page open
/*---------------------------------------------------------------------------------------*/
/*------------------- Home Page buttons ----------------------------------------------*/

$("#Login").on("click", evt=>{
  login();

});
$("#signUp").on("click", evt=>{
  signUp();
});
$("#other").on("click", evt=>{

});

/*-----------------------------------Sign Up Page -------------------*/

$("#signupbutton").on("click",evt=>{ //reference to signupbutton in HTML

  var handle = $("#handle").val();
  var email1 = $("#email1").val();
  var password1 = $("#password1").val();

//create user with email/password:
firebase.auth().createUserWithEmailAndPassword(email1, password1)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    //console.log(user);

    var userID = user.uid;
    function writeUserData(userID) {
      //const db = getDatabase();
      rtdb.set(rtdb.ref(db, 'Users/' + userID), {
        tweet:""
      });
    }
    writeUserData(userID);


    user.updateProfile({
      displayName: handle,
      photoURL: "https://axiumradonmitigations.com/wp-content/uploads/2015/01/icon-user-default.png"
    })
    feed(); //send to feed after signup
  })

  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage); //alert user of error
    signUp(); //send back to sign up again
  });


});

/*--------------------------------Log In Page------------------------*/

$("#loginbutton").on("click",evt=>{

  var email2 = $("#email2").val();
  var password2 = $("#password2").val();
  //send/check user account here, but for now, send to feed
  //USE AN ACCOUNT WITH EMAIL/PASSWORD
firebase.auth().signInWithEmailAndPassword(email2, password2)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    feed();
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    login();
  });


})
/*----------------- Feed ---------------------------------------*/
let toggleLike = (likeRef, uid)=> {
  likeRef.transaction((tObj) => {
    if (tObj) {
      if (tObj.likes && tObj.liked_by_user[uid]) {
        tObj.likes--;
        tObj.liked_by_user[uid] = null;
      } else {
        tObj.likes++;
        if (!tObj.liked_by_user) {
          tObj.liked_by_user = {};
        }
        tObj.liked_by_user[uid] = true;
      }
    }
    return tObj;
  });
}
let toggleRT = (rtRef, uid)=> {
  rtRef.transaction((tObj) => {
    if (tObj) {
      if (tObj.retweets && tObj.retweets_by_user[uid]) {
        tObj.retweets--;
        tObj.retweets_by_user[uid] = null;
      } else {
        tObj.retweets++;
        if (!tObj.retweets_by_user) {
          tObj.retweets_by_user = {};
        }
        tObj.retweets_by_user[uid] = true;
      }
    }
    return tObj;
  });
}


//Button On the Feed Page
$("#createtweet").on("click",evt=>{newtweet();});
$("#signout").on("click",evt=>{signout();});
$("#updateprofile").on("click",evt=>{profilesettings();});

let tweetRef = rtdb.ref(db, "/tweets");
let renderTweet = (tObj, key)=>{
  $(".tweetfeed").prepend(`
<div class="card mb-3 tweet column2" data-uuid="${key}" style="max-width: 500px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${tObj.author.pic}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${tObj.author.handle}</h5>
        <p class="card-text">${tObj.content}</p>
        <p class="card-text" id="likesandrts${key}">Likes: ${tObj.likes} Retweets: ${tObj.retweets}</p>
        <p class="card-text"><small class="text-muted">Tweeted at ${new Date(tObj.timestamp).toLocaleString()}</small></p>
        <div id="buttons-${key}">
          <button style="background-color:#e6674c" id="likebutton" data-uuid="${key}">Like</button>
          <button style="background-color:#31e1df" id="retweetbutton" data-uuid="${key}">Retweet</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `);

  $("#likebutton").off("click");
  $("#likebutton").on("click", (evt)=>{

    let ID = $(evt.currentTarget).attr("data-uuid");
    let likeRef = firebase.database().ref("/tweets").child(ID);
    toggleLike(likeRef, firebase.auth().currentUser.uid);

  });

  $("#retweetbutton").off("click");
  $("#retweetbutton").on("click", (evt)=>{
    let ID = $(evt.currentTarget).attr("data-uuid");
    let rtRef = firebase.database().ref("/tweets").child(ID);
    toggleRT(rtRef, firebase.auth().currentUser.uid);
  });
};

$(".tweetfeed").empty();

rtdb.onChildAdded(tweetRef, (ss)=>{ //new tweet added
  let tObj = ss.val();
  renderTweet(tObj, ss.key);
});
rtdb.onChildChanged(tweetRef, (ss)=>{ //tweet liked/retweeted
  let tObj = ss.val();
  let ID = ss.key;
  let newText = "Likes: " + tObj.likes + " Retweets: " + tObj.retweets;
  $("#likesandrts" + [ID]).text(newText); //update like and retweets
});





/*-----------------New Tweet Page-------------------------------*/


$("#sendtweet").on("click",evt=>{

  var tweet = $("#tweet").val();
  var handle2 = firebase.auth().currentUser.displayName;
  var userID = firebase.auth().currentUser.uid;
  var photoURL1 = firebase.auth().currentUser.photoURL;

  var tweet = {
    "content": tweet,
    "likes": 0,
    "retweets": 0,
    "timestamp": new Date().getTime(),
    "author": {
      "handle": handle2,
      "pic": photoURL1 /*replace w user pic*/
  }
};
  let tweetRef = rtdb.ref(db, "/tweets");
  let newtweetRef = rtdb.push(tweetRef);
  let key = newtweetRef.key; //used for recording entry
  rtdb.set(newtweetRef, tweet);

  function writeUserData(userID, tweet, key) { //for recording tweet to user
    //const db = getDatabase();
    rtdb.set(rtdb.ref(db, 'Users/' + userID + '/Tweets'), {
      tweet: tweet,
      key: key
    });
  }
  writeUserData(userID, tweet, key);


  feed();

});
/*----------------------------- Update Profile  -----------------------------------*/
$("#updatehandle").on("click",evt=>{
  //get current user
  //var handle2 = firebase.auth().currentUser.displayName;
  var newhandle = $("#newhandle").val();
  var user = firebase.auth().currentUser;
  //console.log(user);
  user.updateProfile({
    displayName: newhandle
  })
  alert("nice handle!");
  home();
});

$("#updatepassword").on("click",evt=>{
  var newpassword = $("#newpassword").val();
  var user = firebase.auth().currentUser;
  user.updatePassword(newpassword).then(() => {
    alert("nice password!");
    home(); //send user back to home
  }).catch((error) => {
    alert(newpassword);
    var errorMessage = error.message;
    alert(errorMessage); //alert user of error
});

});
$("#updateprofilepicture").on("click",evt=>{
  var user = firebase.auth().currentUser;
  var newpicture = $("#newprofilepicture").val();
  user.updateProfile({
    photoURL: newpicture
  })
  alert("nice pic!");
  home();
});
$("#feedreturn").on("click",evt=>{feed()});



/*-----------------------------Sign Out Button -----------------------------------*/
function signout(/*take in user?*/){
  var uno = firebase.auth().currentUser.displayName;
  alert("See you later, " + uno + "!")
  firebase.auth().signOut();
  home();


}



/*----------------------------- Tweet Likes Function -----------------------------*/
