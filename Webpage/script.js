// script.js
// Call the function initially to set default font size
//updateFontSize();
let questions = [
	{
		prompt: `Inside which HTML 
				element do we put 
				the JavaScript?`,
		options: [
			"<javascript>",
			"<js>",
			"<script>",
			"<scripting>",
		],
		answer: "<script>",
	},

	{
		prompt: `How do you call a
				function named 
				myFunction?`,
		options: [
			"call myFunction()",
			"myFunction()",
			"call function myFunction",
			"Call.myFunction",
		],
		answer: "myFunction()",
	},

	{
		prompt: `How does a for loop
				start?`,
		options: [
			"for (i = 0; i <= 5; i++)",
			"for (i = 0; i <= 5)",
			"for i = 1 to 5",
			" for (i <= 5; i++)",
		],
		answer: "for (i = 0; i <= 5; i++)",
	},

	{
		prompt: `In JavaScript, which 
				of the following is 
				a logical operator?`,
		options: ["|", "&&", "%", "/"],
		answer: "&&",
	},

	{
		prompt: `A named element in a 
				JavaScript program that
				is used to store and 
				retrieve data is a _____.`,
		options: [
			"method",
			"assignment operator",
			"letiable",
			"string",
		],
		answer: "letiable",
	},
];

let mergedData = [
    {
        "id": 1,
        "word": "banana",
        "definition": "yellow thing"
    },
    {
        "id": 2,
        "word": "apple",
        "definition": "red thing"
    },
    {
        "id": 3,
        "word": "grape",
        "definition": "purple thing"
    },
    {
        "id": 4,
        "word": "orange",
        "definition": "orange thing"
    }
];
let newSize = 0
// Get Dom Elements
let questionsEl =
	document.querySelector(
		"#questions"
	);
let timerEl =
	document.querySelector("#timer");
let choicesEl =
	document.querySelector("#options");
let submitBtn = document.querySelector(
	"#submit-score"
);
let startBtn =
	document.querySelector("#start");
let nameEl =
	document.querySelector("#name");
let feedbackEl = document.querySelector(
	"#feedback"
);
let reStartBtn =
	document.querySelector("#restart");
let buttonOfchoices = document.querySelector("value");



// Quiz's initial state
let currentQuestionIndex = 0;
let time = 12;
let timerId;

// Start quiz and hide frontpage

async function quizStart() {
	let nameInput;
	updateFontSize();
	timerId = setInterval(
		clockTick,
		1000
	);
	timerEl.textContent = time;
	nameEl.textContent = nameInput;
	let landingScreenEl =
		document.getElementById(
			"start-screen"
		);
	landingScreenEl.setAttribute(
		"class",
		"hide"
	);
	questionsEl.removeAttribute(
		"class"
	);
	getQuestion();
}




async function fetchAndMergeJSON() {
    //const mergedData = [];
    for (let i = 0; i <= 3; i++) {
      const url = `http://localhost:8000/volcabs/${getRandomNumberInRange(10)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        mergedData[i] = data;
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    }
    console.log("merged data before getQuestion");
	console.log(mergedData);
    console.log("json first = " + mergedData[0].word); // Print the merged JSON data
    //console.log(questions);
  }
  
  

  function getRandomNumberInRange(max) {
    // Ensure max is a valid number
    if (typeof max !== 'number' || max <= 0) {
      throw new Error('Invalid input: max must be a positive number');
    }
  
    // Generate a random decimal between 0 (inclusive) and max (exclusive)
    const randomDecimal = Math.random() * max;
  
    // Round down to the nearest integer to get a random number within the range 1 to max
    return Math.floor(randomDecimal) + 1;
  }
  


function getRandomNumber1to4() {
  return Math.floor(Math.random() * 3) + 1;
}

const currentFontSize = window.getComputedStyle(document.body).getPropertyValue('font-size');

async function getQuestion() {
	await fetchAndMergeJSON();
    let answer = getRandomNumber1to4();
    currentQuestionIndex = answer;
    console.log("currenQuestionIndex === " + currentQuestionIndex);
	/*let currentQuestion =
		questions[currentQuestionIndex];*/
	let currentQuestion =
		mergedData[currentQuestionIndex];
	let promptEl =
		document.getElementById(
			"question-words"
		);
	promptEl.textContent =
    //currentQuestion.prompt;
	
	currentQuestion.definition;
		//currentQuestion.definition;
	choicesEl.innerHTML = "";
	for (var i in mergedData) {		
		if (i >= 4) {
			break;
		}
		
			let choiceBtn =
				document.createElement(
					"button" 
				);
			choiceBtn.setAttribute(
				"value",
				mergedData[i].word
			);
			choiceBtn.textContent =
				parseInt(i) + parseInt("1") + ". " + mergedData[i].word;
			choiceBtn.style.fontSize = currentFontSize;
			choiceBtn.onclick =
				questionClick;
			choiceBtn.classList.add("button"+ (parseInt(i) + 1));
			console.log(i)
			choicesEl.appendChild(
				choiceBtn
			);
			
	  }		
	  updateFontSize();
	  console.log("merged data afer get question === ");
	  console.log(mergedData);
}



const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
  };
  


// Check for right answers and deduct
// Time for wrong answer, go to next question
var score = 0;
var round = 0;
let streakCount = 0; // Variable to track the current streak count
let streakMultiplier = 1; // Initial streak multiplier
let streakBonusTimerId; // Timer ID for streak bonus timer
let streakBonusTime = 8; // Time limit for streak bonus (in seconds)

async function questionClick() {
    // Reset the streak bonus timer if it's already running
    clearTimeout(streakBonusTimerId);

    updateFontSize();

    if (this.value !== mergedData[currentQuestionIndex].word) {
        // Player answered incorrectly

        // Reset streak count and multiplier
        streakCount = 0;
        streakMultiplier = 1;

        if (time < 0) {
            time = 0;
        }

        timerEl.textContent = time;
        feedbackEl.textContent = `Wrong! The correct answer was ${mergedData[currentQuestionIndex].word}.`;
        feedbackEl.style.color = "red";
        feedbackEl.setAttribute("class", "feedback");

        let delayres = await delay(2000);
        quizEnd();
    } else {
        // Player answered correctly

        // Increment the streak count
        streakCount++;

        // Check if the streak count is a multiple of 3 to activate streak bonus
        if (streakCount % 3 === 0) {
            // Multiply the streak bonus by 2
            streakMultiplier *= 2;

            // Start the streak bonus timer
            streakBonusTimerId = setTimeout(() => {
                // Reset the streak bonus timer when time's up
                streakMultiplier = 1;
                streakCount = 0;
            }, streakBonusTime * 1000); // Convert seconds to milliseconds

            // Show streak bonus message or indication to the player
            console.log(`Streak Bonus Activated! ${streakMultiplier}x Multiplier`);
        }

        // Calculate the score including streak bonus
        score = score + time * streakMultiplier;
        time = 12; // Reset time for the next question

        feedbackEl.textContent = "Correct! +" + time * streakMultiplier; // Update feedback message with streak bonus
        feedbackEl.style.color = "green";
        feedbackEl.setAttribute("class", "feedback");

        // Hide the feedback message after a delay
        setTimeout(function () {
            feedbackEl.setAttribute("class", "feedback hide");
        }, 2000);
    }

    // Proceed to the next question
    let delayres = await delay(500);
    getQuestion();
}


// End quiz by hiding questions,
// Stop timer and show final score

function quizEnd() {
	clearInterval(timerId);
	let endScreenEl =
		document.getElementById(
			"quiz-end"
		);
	endScreenEl.removeAttribute(
		"class"
	);
	let finalScoreEl =
		document.getElementById(
			"score-final"
		);
	finalScoreEl.textContent = score;
	questionsEl.setAttribute(
		"class",
		"hide"
	);
}

// End quiz if timer reaches 0

function clockTick() {
	time--;
	timerEl.textContent = time;
	if (time <= 0) {
		quizEnd();
	}
}

// Save score in local storage
// Along with users' name
/*
function saveHighscore() {
	let name = nameEl.value.trim();
	if (name !== "") {
		let highscores =
			JSON.parse(
				window.localStorage.getItem(
					"highscores"
				)
			) || [];
		let newScore = {
			score: time,
			name: name,
		};
		highscores.push(newScore);
		window.localStorage.setItem(
			"highscores",
			JSON.stringify(highscores)
		);
		alert(
			"Your Score has been Submitted"
		);
	}
}*/
// Save score in local storage
// Along with users' name

async function saveHighscore() {
	updateFontSize();
    //let name = nameEl.value.trim();
	//name = document.getElementById("name").value;
	/*alert(typeof nameInput)
	alert(nameInput !== "")*/
	let nameInput = document.getElementById("name").value;
	
    if (nameInput !== "") {
        try {
            // Fetch the latest ID
            const response = await fetch('http://127.0.0.1:8000/score');
            if (!response.ok) {
                throw new Error('Failed to fetch latest ID');
            }
            const data = await response.json();
            
            // Find the latest ID
            let latestId = 0;
            if (data.length > 0) {
				// lastest id
                latestId = data[data.length - 1].id;
            }
            
            // Increment the latest ID by 1
            const newId = latestId + 1;
            
            // Create data object containing name and score along with the new ID
            const postData = {
                id: newId,
                player_name: nameInput,
                score: score
            };
			//alert("postdataName = " + postData.name);
            // Send POST request with the new ID
            const postResponse = await fetch(`http://127.0.0.1:8000/score/${newId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (postResponse.ok) {
                // Optionally, you can handle a successful submission here
                console.log("Score submitted successfully!");
                alert("Your score has been submitted.");
            } else {
                // Handle error response
                console.error("Error submitting score:", postResponse.statusText);
                alert("Failed to submit score.");
            }
        } catch (error) {
            // Handle network errors
            console.error("Error:", error);
            alert("Failed to submit score.");
        }
    } else {
		alert("Please enter your name");
	}
}



// Save users' score after pressing enter

function checkForEnter(event) {
	if (event.key === "Enter") {
		saveHighscore();
		alert(
			"Your Score has been Submitted"
		);
	}
}
nameEl.onkeyup = checkForEnter;

// Save users' score after clicking submit

submitBtn.onclick = saveHighscore;

// Start quiz after clicking start quiz

startBtn.onclick = quizStart;


function updateFontSize() {
    newSize = fontSlider.value + "px";
    const textElements = document.querySelectorAll("*");
    textElements.forEach(element => {
        if (element.nodeType === Node.TEXT_NODE) {
            element.parentNode.style.fontSize = newSize;
        } else {
            element.style.fontSize = newSize;
        }
    });
}

// Add event listener to slider input event
fontSlider.addEventListener("input", updateFontSize);


