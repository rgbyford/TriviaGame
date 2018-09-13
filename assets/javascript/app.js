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

    var r = $('<input/>').attr({
        type: 'button',
        id: 'startButton',
        value: 'Start',
    });
    $(".background-rectangle").append(r);
    
    var s = $('<input/>').attr({
        type: 'button',
        id: 'startOverButton',
        value: 'Start Over',
    });

    $(".background-rectangle").append(s);
    $("#startOverButton").hide();
    
    // not sure why we have to do this, but without the HTML image the
    // "won a game" picture doesn't show up. But it's OK to remove it????
    $("#htmlImg").remove();

    $(document).on("click", "#startButton", function (event) {
        startGame(false);
    });

    $(document).on("click", ".answer", function (event) {
        var idString = $(this).attr('id');
        var idNum = idString[idString.search(/[0-9]/)];
        roundOver(idNum == questions[thisQuestion].rightAnswer ? WON : LOST);
    });

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

    var firstGame = true;

    function startGame(restart) {
        $("#picture").hide();
        $("#picture2").hide();
        timeLeft = 20;
        timerHandle = setInterval(timerRoutine, 1000);
        showTime(timeLeft);
        if (!restart) {
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
        let appendPoint;
        let waitTime = 3000;
        let continuation = true;
        let waitRestart = false;

        clearInterval(timerHandle);
        questions[thisQuestion].hideAnswers();
        questions[thisQuestion].hideQuestion();
        $("#timeRemaining").text(wonLost === WON ? "Yep!" : "Nope!");
        if (wonLost == LOST) {
            $("#answer2").text("Guess again!");
            $("#answer2").css("visibility", "visible");
            if (timeLeft <= 0) {
                noAnswer++;
            } else {
                wrongGuesses++;
            }
        } else {
            $("#picture").find("img").remove(); // any previous one
            $("#picture2").find("img").remove(); // any previous one
            appendPoint = thisQuestion < 3 ? "#picture" : "#picture2";
            $(appendPoint).append('<img alt="test" src="' +
                pictures[questions[thisQuestion].pictureNum] + '">');
            $(appendPoint).css("visibility", "visible");
            $(appendPoint).show();
            thisQuestion++; // only here, because of Guess Again
            //            wins++;
        }

        if (thisQuestion === 4) {
            setTimeout(gameOver, 3000, true);
        } else {
            setTimeout(startGame, 3000, true);
        }
        return;
    }

    $(document).on("click", "#startOverButton", function (event) {
        $("#startOverButton").hide();
        startGame(false);
    });

    function gameOver() {
        $("#timeRemaining").text("Game over!");
        $("#question").text("");
        $("#answer1").text("Incorrect: " + wrongGuesses);
        $("#answer2").text("Unanswered: " + noAnswer);
        $("#answer0").css("visibility", "hidden");
        $("#answer1").css("visibility", "visible");
        $("#answer2").css("visibility", "visible");
        $("#startOverButton").show();
    }
});