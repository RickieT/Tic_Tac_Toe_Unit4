(function(){

    // The Variables....
    var winningarray = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
    var oharray = [];
    var exarray = [];
    var usedtracker = [];
    var fillcounter = 0;
    var winner;
    var exsquarenumber;
    var clickedsquare;



    // Append start and finish screens, show only start screen, hide board
    $(function(){

      // Hide the board
      $("#board").hide();

      // Append the start screen
      $("body").append('<div class="screen screen-start" id="start"><header> <h1>Tic Tac Toe</h1><div id="startchoice"><div id="choice"><p><label class="label" for="computer">Play the computer?&nbsp;</label><input type="radio" name="opponent" value="computer" id="computer"></p><p><label for="human" class="label">Play another human?&nbsp;</label><input type="radio" name="opponent" id="human" value="human"></p></div></div><a href="#" class="button" id="startbutton">Start game</a> </header></div>');

      // Append the finish screen
      $("body").append('<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button newgamebutton">New game</a></header></div>');

      // Hide finish screen
      $("#finish").hide();

      $('#startbutton').hide();


      // Show/hide input fields depending on which radio button is checked
      $("input[name='opponent']").change(function(){
      if ( ($("input[name='opponent']:checked").val()) == "computer" ) {
        $("#startchoice").append('<div id="entername1"><p><label for="name1">What is your name?:</label></p><p><input type="text" id="name1" name="name1"</p></div>');
        $("#entername2").remove();
        $('#startbutton').show();

       } else {
        $("#entername1").remove();
        $("#startchoice").append('<div id="entername2"><p><label for="name1">Who is Player 1?:</label></p><p><input type="text" id="name1" name="name1"</p><p><label for="name2">Who is Player 2?:</label></p><p><input type="text" id="name2" name="name1"</p></div>');
        $("#entername2").show();
        $('#startbutton').show();
       }
      });

      // Add player name fields to board
      $(".playerboxes").after('<p class="playertext"><span id="playerone"></span><span id="playertwo"></span></ul>');



    // Click the start button to begin the game regardless if names are entered, and start screen will hide.
      $("#startbutton").click(function(event){
        event.preventDefault();
        // Set player names based on input from user
        $("#playerone").text($("#name1").val());
        $("#playertwo").text($("#name2").val());
        // If single player, then opponent's name is 'Computer', and call the onePlayerGame method
        if ( $("input[name='opponent']:checked").val() == "computer" ) {
          $("#playertwo").text("Computer");
          onePlayerGame();
        } else if ( ($("input[name='opponent']:checked").val()) == "human" ) {
          twoPlayerGame();
        }
        // Hide the start screen, begin game, and give active player to player 1
        $("#start").hide();
        $("#player1").addClass("active");
        // Show board
        $("#board").show();
      });


    // Have X/O Icons appear on squares ONLY if its a two player game
    function hover(){
        $(".boxes li").hover(function () {
            if ($("#player1").hasClass("active")) {
              $(this).css("background-image", "url(./img/o.svg)");
            }
            // I only want X hover to work if it's a two-player game
            else if ( ($("#player2").hasClass("active")) && (($("input[name='opponent']:checked").val()) == "human") )  {
              $(this).css("background-image", "url(./img/x.svg)");
            }
        }, function() {
          $(this).css("background-image", "none");
        });
     }
     hover();



    // Method for 1 player game start against computer
    function onePlayerGame() {
     // This function enables a turn by O and a turn by the computer
       $(".boxes li").click(function(){
         fillcounter = 0; //
         winner = false;
         clickedsquare = $(".boxes li").index($(this));
         console.log("Clicked square is " + clickedsquare);

         // player 1 takes a turn
         if ($("#player1").hasClass("active")) {
           playerChooseOhSquare(clickedsquare);
         }
         // Then test board for winner or draw
         winnerTest();
         drawTest();

         // If there is no winner after the check, switch turns
         if ( (!winner) && (fillcounter < 9)  ) {
           $("#player1").removeClass("active");
           $("#player2").addClass("active");

           setTimeout(computerChooseExSquare, 300);
         }

        });

    }


    function twoPlayerGame() {
      // This method makes it so player1 and player2 can take turns
        $(".boxes li").click(function(){
         fillcounter = 0;
         winner = false;
         clickedsquare = $(".boxes li").index($(this));
         console.log("Clicked square is " + clickedsquare);

         // Player 1 takes a turn
         if ($("#player1").hasClass("active")) {
           playerChooseOhSquare(clickedsquare);
         } else {
         // Player 2 takes a turn
           playerChooseExSquare(clickedsquare);
         }

         // Test to see if there is a winning combo
         winnerTest();
         drawTest();

         // Toggle active players
         $("#player1").toggleClass("active");
         $("#player2").toggleClass("active");

        });

    }

    function playerChooseOhSquare(clickedsquare) {

      console.log("playerChooseOhSquare called" );
        $(".boxes li").eq(clickedsquare).addClass("box-filled-1");
        // I keep track of square's number based on its position in $(".boxes li"), i.e. using index number from 0 to 8
        // Add square to oharray
        oharray.push(clickedsquare);
        usedtracker.push(clickedsquare);
        // Disable hover and click on chosen square
        $(".boxes li").eq(clickedsquare).off();

    }

     function playerChooseExSquare(clickedsquare) {
        console.log("playerChooseExSquare called" );
        // Add svg and background colour
        $(".boxes li").eq(clickedsquare).addClass("box-filled-2");
        // Add square to exarray
        exarray.push(clickedsquare);
        usedtracker.push(clickedsquare);
        // Disable hover and click on chosen square
        $(".boxes li").eq(clickedsquare).off();

      } // ends playerChooseExSquare




    // How the computer plays...
    function computerChooseExSquare(){
      console.log("computerChooseExSquare called");
      exsquarenumber = Math.floor(Math.random() * 9);
      // If there is a square that has not been picked, then thats what the computer will choose
         if (usedtracker.indexOf(exsquarenumber) === -1) {
           exSquareChoice();
         } else {
           while ((usedtracker.indexOf(exsquarenumber) > -1) && (usedtracker.length != 9)) {
             exsquarenumber = Math.floor(Math.random() * 9);
           }
           exSquareChoice();
         }

       winnerTest();
       drawTest();

       // Toggle active classes to swap active player after turn
       $("#player1").addClass("active");
       $("#player2").removeClass("active");

    }

    function exSquareChoice(){
      $(".boxes li").eq(exsquarenumber).addClass("box-filled-2");
      $(".boxes li").eq(exsquarenumber).css("background-image", "url(./img/x.svg)");
      exarray.push(exsquarenumber);
      usedtracker.push(exsquarenumber);
      $(".boxes li").eq(exsquarenumber).off();
    }


    function winnerTest(){
      // To test state of board against possible solutions: We need to compare the arrays in winning array
      // against what is stored in either exArrays or ohArrays to verify a winner.
        for (var i=0; i<winningarray.length; i++){

          fillcounter = 0;
          var firsttest = winningarray[i][0];
          var secondtest = winningarray[i][1];
          var thirdtest = winningarray[i][2];

          if ( (oharray.indexOf(firsttest) > -1) && (oharray.indexOf(secondtest) > -1) && (oharray.indexOf(thirdtest) > -1) ) {
            winner = true;
            $("#board").hide();
            $(".message").text(($("#name1").val()) + " wins");
            $(".screen-win").addClass("screen-win-one");
            $("#finish").show();

            } else if ( (exarray.indexOf(firsttest) > -1) && (exarray.indexOf(secondtest) > -1) && (exarray.indexOf(thirdtest) > -1) ) {
                winner = true;
                $("#board").hide();

            if ( $("input[name='opponent']:checked").val() == "computer" ) {
              $(".message").text("Computer wins");
            } else {
              $(".message").text(($("#name2").val()) + " wins");
            }

            $(".screen-win").addClass("screen-win-two");
            $("#finish").show();
          }
        }
    }


    function drawTest(){
    // Now, we test for a draw
    // First, count how many boxes have class of .box-filled-1 or .box-filled-2
     $(".boxes li").each(function(){
         if ( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2") ) {
           fillcounter += 1;
         }
     });
     // If all nine of the squares are filled and none of the arrays match, then draw
      if ((fillcounter == 9) && (!winner)) {
       $(".message").text("It's a draw");
       $(".screen-win").addClass("screen-win-tie");
       $("#board").hide();
       $("#finish").show();
       // Reset active class to player 1
       $("#player1").addClass("active");
       $("#player2").removeClass("active");
     }

    }
    // Clicking new game restarts the game

      $(".newgamebutton").click(function(event){
          event.preventDefault();

          // Remove all the filled boxes
          $(".boxes li").removeClass("box-filled-1");
          $(".boxes li").removeClass("box-filled-2");
          $(".boxes li").css("background-image", "none");
          // set arrays back to 0 or empty
          oharray = [];
          exarray = [];
          usedtracker = [];
          fillcounter = 0;
          // put the active player class back to active.
          $("#player1").addClass("active");
          $("#player2").removeClass("active");
          // reset the winning/draw screens
          $(".screen-win").removeClass("screen-win-one");
          $(".screen-win").removeClass("screen-win-two");
          $(".screen-win").removeClass("screen-win-tie");
          $(".message").text("");

          $(".boxes li").off();
          // Add the hover back.
          hover();
          // call either the single player or two player game depending on what was chosen prior.
          if ( $("input[name='opponent']:checked").val() == "computer" ) {
            onePlayerGame();
          } else if ( ($("input[name='opponent']:checked").val()) == "human" ) {
            twoPlayerGame();
          }


          $("#finish").hide();
          $("#board").show();
       });


    });

}());