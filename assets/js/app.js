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

//initial values 
player1 = false;
player2 = false;
p1pick = false;
p2pick = false;
p1wins = 0; 
p2wins = 0;
p1losses = 0;
p2losses = 0;
p1msg = '';
p2msg = '';
playersTotal = 0;  //Number of players ready to play!
messages = [];

var database = firebase.database();

//initialize database with intial values
console.log("updating database initial values");
updateDatabase(); 

//testing
// database.ref().remove(); //Clears database (if need be)

function updateDatabase(){
    //Update the database
    database.ref("/gameData").push({
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
        playersTotal : playersTotal,
        messages : messages,
        timeAdded : firebase.database.ServerValue.TIMESTAMP
    });
}

//Handle the modal "Save" button to save the player's name
$("#nameBtn").click(function(event){
    event.preventDefault();
    var entry =   $("#nameBox").val();
    console.log("click function started, players total = " + playersTotal);
    //Logic to see if any other players are ready
    if (!player1){
        player1 = entry;

        playersTotal++;
        console.log(playersTotal + "= players total");
        updateDatabase();
    }
    else if(!player2){
        player2 = entry;

        playersTotal++;
        console.log(playersTotal +"= players total");
        updateDatabase();
        //FUNCTION CALL TO START GAME LIKELY GOES HERE
    }
    else {
        $('#nameModal').modal('hide')
        console.log ("player queue full, watch game instead(?)");
    }
     //testing
    console.log('p1 set as:' +player1);
    console.log('p2 set as:' +player2);

});


//Update the game state from the database

database.ref("/gameData").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Check to see db works
    // console.log(sv.player1);
    // console.log(sv.player2);
    // console.log(sv.p1pick);
    // console.log(sv.p2pick);
    
    //populate the player names (if they are connected)
    if(sv.player1){
        player1 = sv.player1;
        $("#player1Div").text(sv.player1);
        console.log("database p1 detected");
    }
    else{
        $("#player1Div").text("Waiting for player.");
        console.log("database p1 NOT detected");
        $('#nameModal').modal();
    }

    if (sv.player2){
        player2 = sv.player2;
        $("#player2Div").text(sv.player2);
        console.log("database p2 detected");

    }
    else{
        $("#player2Div").text("Waiting for player.");
        console.log("database p2 NOT detected");
        $('#myModal').modal();
    }

    // if(sv.messages)
    // $("#chatDiv").append("<div class='row'>  "+sv.player1+" says: " + sv.p1msg +"</div>");
   
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



/////////////

