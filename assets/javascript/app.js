const LOST = 0;
const WON = 1;

const pictures = [
    "./assets/images/Thomas.jpg",
    "./assets/images/Edward.jpg",
    "./assets/images/Gordon.jpg",
    "./assets/images/Henry.jpg",
    "./assets/images/James.jpg",
    "./assets/images/Percy.jpg",
];

$(document).ready(function () {

    class QuestionMake {
        constructor(theQuestion, a0, a1, a2, a3, rightAnswer, pictureNum) {
            this.question = theQuestion;
            this.answers = [a0, a1, a2, a3];
            this.rightAnswer = rightAnswer;
            this.pictureNum = pictureNum;
        }
        displayQuestion() {
            $("#question").text(this.question);
            $("#question").css("visibility", "visible");
        }
        hideQuestion() {
            $("#question").css("visibility", "hidden");
        }
        displayAnswers() {
            var thisQuestion = this;
            $("#answer" + "0").text(this.answers[0]);
            thisQuestion.answers.forEach(function (value, i) {
                console.log(thisQuestion);
                console.log(thisQuestion.answers[i]);
                $("#answer" + i).text(thisQuestion.answers[i]);
                $("#answer" + i).css("visibility", "visible");
            });
        };
        hideAnswers() {
            this.answers.forEach(function (value, i) {
                $("#answer" + i).css("visibility", "hidden");
            });
        };
    }

    var questions = [{}];
    var thisQuestion;

    let wrongGuesses;
    let noAnswer;

    questions[0] = new QuestionMake("What is the wheel configuration of Edward?",
        "4-6-2", "4-4-0", "3-7-1", "0-8-0", 1, 1);
    questions[1] = new QuestionMake("Who is the red engine?",
        "Edward", "Henry", "Gordon", "James", 3, 4);
    questions[2] = new QuestionMake("Who, like Thomas, is a tank engine?",
        "James", "Gordon", "Percy", "Edward", 2, 5);
    questions[3] = new QuestionMake("How long does it take to go from Pittsburgh to New York by train?",
        "6 hours", "8 hours", "days", "9 hours", 3, 0);

    // button routines
    var r = $('<input/>').attr({
        type: 'button',
        id: 'startButton',
        value: 'Start',
        class: "buttons"
    });
    $("#picture2").append(r);

    var s = $('<input/>').attr({
        type: 'button',
        id: 'startOverButton',
        value: 'Start Over',
        style: 'margin-top: -25%',
        class: 'buttons'
    });
    $(".background-rectangle").append(s);
    $("#startOverButton").hide();

    $(document).on("click", "#startButton", function (event) {
        startGame(false);
    });

    $(document).on("click", ".answer", function (event) {
        var idString = $(this).attr('id');
        var idNum = idString[idString.search(/[0-9]/)];
        roundOver(idNum == questions[thisQuestion].rightAnswer ? WON : LOST);
    });

    $(document).on("click", "#startOverButton", function (event) {
        $("#startOverButton").hide();
        startGame(false);
    });

    // time routines
    function showTime(time) {
        $("#timeRemaining").text("Time remaining: " + timeLeft + " seconds");
        $("#timeRemaining").css("visibility", "visible");
    }

    let timeLeft;
    let timerHandle;

    function timerRoutine() {
        timeLeft--;
        showTime(timeLeft);
        if (timeLeft <= 0) {
            roundOver(LOST);
        }
    }

    // game routines
    var firstGame = true; // only put up the start button for the first game

    function startGame(restart) {
        $("#picture").hide();
        $("#picture2").hide();
        timeLeft = 20;
        timerHandle = setInterval(timerRoutine, 1000);
        showTime(timeLeft);
        if (!restart) { // restart meaning a "follow on" game
            thisQuestion = 0;
            wrongGuesses = 0;
            noAnswer = 0;
            if (firstGame) {
                $("#startButton").toggle();
                firstGame = false;
            }
        }
        questions[thisQuestion].displayQuestion();
        questions[thisQuestion].displayAnswers();
        return;
    }

    function roundOver(wonLost) {
        clearInterval(timerHandle);
        questions[thisQuestion].hideAnswers();
        questions[thisQuestion].hideQuestion();
        if (wonLost == LOST) {
            $("#picture2").find("img").remove(); // any previous one
            $("#picture2").append('<img src="./assets/images/unhappy-Thomas.jpg">');
            $("#picture2").css("visibility", "visible");
            $("#picture2").show();
            $("#answer2").text("Guess again!");
            $("#answer2").css("visibility", "visible");
            if (timeLeft <= 0) {
                $("#timeRemaining").text("Time gone!");
                noAnswer++;
            } else {
                $("#timeRemaining").text("Nope!");
                wrongGuesses++;
            }
        } else {
            $("#timeRemaining").text("Yep!");
            $("#picture2").find("img").remove(); // any previous one
            $("#picture2").append('<img alt="test" src="' +
                pictures[questions[thisQuestion].pictureNum] + '">');
            $("#picture2").css("visibility", "visible");
            $("#picture2").show();
            thisQuestion++; // only do it here, because of Guess Again
        }
        if (thisQuestion === 4) {           // last one!
            setTimeout(gameOver, 3000, true);
        } else {
            setTimeout(startGame, 3000, true);
        }
        return;
    }

    function gameOver() {
        $("#timeRemaining").text("Game over!");
        $("#question").text("");
        $("#answer0").text("Incorrect: " + wrongGuesses);
        $("#answer1").text("Unanswered: " + noAnswer);
        $("#answer0").css("visibility", "visible");
        $("#answer1").css("visibility", "visible");
        $("#answer2").css("visibility", "hidden");
        $("#startOverButton").show();
        return;
    }
});