// Create a game that suits this user story:

// Only two users can play at the same time.

// Both players pick either rock, paper or scissors. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

// The game will track each player's wins and losses.

// Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

var player1, player2;
var p1pick, p2pick;
var p1wins, p2wins;
var p1losses, p2losses;
var p1Chat, p2Chat;

player1 = "Rick";
player2 = "Jane";
p1pick = "rock";
p2pick = "scissors";
p1wins = 0; 
p2wins = 0;
p1losses = 0;
p2losses = 0;
p1msg = 'test p1 msg';
p2msg = 'test p2 msg';
messages = [];

var database = firebase.database();

//Modal opens to get player name
$('#nameModal').modal();


//Update the database
database.ref().push({
    player1 : player1,
    player2 : player2,
    p1pick :  p2pick,
    p2pick :  p2pick,
    p1wins  : p1wins, 
    p1loses : p1losses,
    p2wins  : p2wins,
    p2losses : p2losses,
    p1msg   :  p1msg,
    p2msg   : p2msg,
    messages : messages,
    timeAdded : firebase.database.ServerValue.TIMESTAMP
});

//Update the game state from the database

database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Check to see db works
    console.log(sv.player1);
    console.log(sv.player2);
    console.log(sv.p1pick);
    console.log(sv.p2pick);

    $("#player1Div").text(sv.player1+" picked "+ sv.p1pick);
    $("#player2Div").text(sv.player2+" picked "+ sv.p2pick);

    // if(sv.messages)
    // $("#chatDiv").append("<div class='row'>  "+sv.player1+" says: " + sv.p1msg +"</div>");
   
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



console.log("hi");

