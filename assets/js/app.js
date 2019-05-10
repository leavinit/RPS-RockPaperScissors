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
sessionPlayer = false ;  // Whether this client is player 1 or player 2
p1pick = false;
p2pick = false;
playing = false;
p1wins = 0; 
p2wins = 0;
p2draws = 0;
p1losses = 0;
p2losses = 0;
p1draws = 0;
p2draws = 0;
p1msg = '';
p2msg = '';
p1ready=false; // ready to play again?
p2ready=false;
playersTotal = 0;  //Number of players ready to play!
messages = [];

var database = firebase.database();

//initialize database with intial values
// console.log("updating database initial values");
// updateDatabase(); 

//testing
// database.ref().remove(); //Clears database (if need be)

// function updateDatabase(){
//     //Update the database
//     database.ref("/gameData").push({
//         player1 : player1,
//         player2 : player2,
//         p1pick :  p2pick,
//         p2pick :  p2pick,
//         p1wins  : p1wins, 
//         p1loses : p1losses,
//         p2wins  : p2wins,
//         p2losses : p2losses,
//         p1msg   :  p1msg,
//         p2msg   : p2msg,
//         playersTotal : playersTotal,
//         messages : messages,
//         timeAdded : firebase.database.ServerValue.TIMESTAMP
//     });
// }

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
        // database.ref("/gameData").set({
        //     player1: player1,
        //   });
        // updateDatabase();    
        database.ref("/gameData").update({
            player1: player1,
            p1wins: p1wins,
            p1losses: p1losses,
            p1draws : p1draws
        });
        sessionPlayer = "player 1";
        console.log(" you are player 1");

    }
    else if(!player2){
        player2 = entry;
        
        playersTotal++;
        console.log(playersTotal +"= players total");
        $("#player2Div").text(player2);
        database.ref("/gameData").update({
            player2: player2,
            p2wins: p2wins,
            p2losses: p2losses,
            p2draws : p2draws
        });
        sessionPlayer = "player 2";
        console.log(" you are player 2");
        // updateDatabase();
    }
    else {
        // $('#nameModal').modal('hide')
        console.log ("player queue full, watch game instead(?)");
    }

     //testing
    console.log('p1 set as:' +player1);
    console.log('p2 set as:' +player2);

});

function playGame(){
    playing = true;
    $("gameMessageDiv").append("<span>Make your selection!</span>");
    //Capture clicks of rock, paper, or scissors and determine which player clicked what
    $("#rpsDiv > img").click(function(event){
        currentPick = $(this).attr("data-id");
        console.log("image clicked: " + currentPick);
        console.log("clicked by: " + sessionPlayer);
        if (sessionPlayer == "player 1"){
            p1pick = currentPick;
            $(this).css("border","2px solid blue"); 
            database.ref("/gameData").update({
                p1pick: p1pick
            });
        }
        if (sessionPlayer == "player 2"){
            p2pick = currentPick;
            $(this).css("border","2px solid green");
            database.ref("/gameData").update({
                p2pick: p2pick
            }); 
        }

    });
}




//Utility function to calculate the current round's winner
function calculateWinner(p1selected,p2selected){
    if (p1selected=='rock' && p2selected=='paper'){
        p2wins++;
        return player2;
    }
    if (p1selected=='rock' && p2selected=='scissors'){
        p1wins++;
        return player1;
    }
    if (p1selected=='scissors' && p2selected=='paper'){
        p1wins++;
        return player1;
    }
    if (p1selected=='scissors' && p2selected=='rock'){
        p2wins++;
        return player2;
    }
    if (p1selected=='paper' && p2selected=='rock'){
        p1wins++;
        return player1;
    }
    if (p1selected=='paper' && p2selected=='scissors'){
        p2wins++;
        return player2;
    }
    if (p1selected==p2selected){
        p1draws++;
        p2draws++;
        return "draw"
    }
}



function gameRestart(){
    //reset the players pics
    p1pick = false;
    p2pick = false;
    playing = false;
            //test initialize the guesses
    database.ref("/gameData").child("p1pick").remove();
    database.ref("/gameData").child("p2pick").remove();
    database.ref("/gameData").update({
        p1wins : p1wins, 
        p2wins : p2wins,
        p2draws : p2draws,
        p1losses : p1losses,
        p2losses : p2losses,
        p1draws : p1draws,
        p2draws : p2draws,
        // p1ready=false, // ready to play again?
        // p2ready=false,
        
    });
    console.log("Updating database to restart game")
}

//Update the game state from the database

database.ref("/gameData").on("value", function(snapshot)  {
    // storing the snapshot.val() in a variable for convenience
     var sv = snapshot.val();

    // Check to see db works
    // console.log(sv.player1);
    // console.log(sv.player2);
    // console.log(sv.p1pick);
    // console.log(sv.p2pick);
    
    //populate the player names (and verify if they are connected)
    if(snapshot.child("player1").exists()){
        player1 = sv.player1;
        $("#player1Div").text(player1);
        console.log("database p1 detected");
    }
    else{
        $("#player1Div").text("Waiting for player.");
        console.log("database p1 NOT detected");
        if(!playing){
            $('#nameModal').modal();
        }
        console.log('modal1');
    }

    if (snapshot.child("player2").exists()){
        player2 = sv.player2;
        $("#player2Div").text(player2);
        console.log("database p2 detected");
    }
    else{
        $("#player2Div").text("Waiting for player.");
        console.log("database p2 NOT detected");
        if (!playing){
            $('#nameModal').modal();
        }
        console.log('modal2');
    }

    console.log("local players 1:" + player1 + "2: "+ player2);
    // console.log("db players: " +sv.player1 + "2: " +sv.player2 );
    // if(sv.messages)
    // $("#chatDiv").append("<div class='row'>  "+sv.player1+" says: " + sv.p1msg +"</div>");
    if (player1 && player2){

        console.log("start game? maybe");
        $("#player2Div").text(player2);
        $("#player1Div").text(player1);
        playing = true;
        playGame();  //sets up clickhandler so players can select their weapon (r,p,or s)
    }


    //Database updates while the game has started
    if(playing){
        if (snapshot.child("p1pick").exists() && !snapshot.child("p2pick").exists()){
            console.log("p1pick exists on db, drawing its outline, p2pick is null on db");
            //Update the local var (might be unecessary, opponents shouldnt have access to the other pick)
            p1pick = sv.p1pick;
            
            
        }
        else if(snapshot.child("p2pick").exists() && !snapshot.child("p1pick").exists()){
            console.log("p2pick exists on db, drawing its outline, p1pick is null on db");
            
            //Update the local var (might be unecessary see above comment)
            p2pick = sv.p2pick;
            
        }
        else if(snapshot.child("p2pick").exists() && snapshot.child("p1pick").exists()){
            console.log("both picks exist on db, calculate winner");
            console.log("p1pick was: "+ sv.p1pick + " p2pick was: "+sv.p2pick);
           
            //find out the winner by checking the picks
            var winner = calculateWinner(sv.p1pick,sv.p2pick);                
            if (winner=="draw"){
                console.log("Round was a draw. Both gladiators selcted: "+sv.p1pick);
                //announce the result
                $('#overlay').modal('show');
                $("#gameResult").text("Round was a draw. Both gladiators selcted: "+sv.p1pick);
                $("#"+p1pick+"Pic").css("outline","red 2px solid");
                
                setTimeout(function() {
                    gameRestart()
                    $('#overlay').modal('hide');
                }, 3000);

                
                
            }
            else{
                console.log("Winner was :" + winner);
                $("#"+p1pick+"Pic").css("outline","blue 2px solid");
                $("#"+p2pick+"Pic").css("outline","green 2px solid");
                if(winner == sessionPlayer){
                    console.log("You Win");
                    $('#overlay').modal('show');
                    $("#gameResult").text("Congratulations on the slaying of your foe!");
                    
                    setTimeout(function() {
                        gameRestart();
                        $('#overlay').modal('hide');
                    }, 3000);

                    
                }
                else{
                    
                    $('#overlay').modal('show');
                    $("#gameResult").text("Destroyed! Your honor is tarnished.");
                    setTimeout(function() {
                        gameRestart();
                        $('#overlay').modal('hide');
                    }, 3000);
                    console.log("You Lost");
                }
            }
                // $()
        }

    }

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



/////////////

