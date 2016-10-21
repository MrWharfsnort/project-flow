var timeStamps = [];
var inputObjects = [];
var totalTime = 0;
var breakTime = 0;
var workTime = 0;
var breakCount = 0;
var startDate;
var t;


function startTime() { //start the timer
	timeStamps.push(Date.now()); //push a timestamp
	startDate = new Date(); //set the date and time of chunk
	$("#takeBreak").click(startBreak); //attatch click listener for taking breaks
	setAutoBreak(2700000); //sets the initial autoBreak timeout at 45-minutes
}


function startBreak() {
	timeStamps.push(Date.now());//pushes a break timestamp
	clearTimeout(t); //stops the autoBreak from firing while already on a break
	$("#timer").css("display", "none"); //hide timer div
	$("#autoBreak").css("display", "none"); //hide autoBreak div
	$("#break").css("display", "block"); //show break div
}

function endBreak() {
	// todo take in input fields
	timeStamps.push(Date.now()); //push end of break timestamp
	$("#break").css("display", "none"); //hide the break div
	$("#timer").css("display", "block"); //show the timer div
	setAutoBreak(2700000); //reset that autoBreak timeout
}

function setAutoBreak(initial) {
	t = setTimeout(autoBreak, initial);
}

function skipBreak() {
	var interval = 900000; //if choosing "no break" set interval to 15 minutes
	var timeSinceBreak = Date.now() - timeStamps[timeStamps.length - 1];
	var decrement =(timeSinceBreak - 2700000)/5;
	decrement = Math.min(decrement, 780000); //maxes out decrement at 13 minutes
	interval = interval - decrement;//each time 'no break' is chosen reduce interval;
	setAutoBreak(interval);
}

function endTime() {
	timeStamps.push(Date.now());//push finishing chunk timestamp
	clearTimeout(t); //prevent autoBreak from firing after finished with chunk
	totalTime = timeStamps[timeStamps.length - 1] - timeStamps[0]; //calculate total time of chunk
	totalTime = Math.floor(totalTime/1000);//convert to seconds
	if(timeStamps.length > 2) {//if breaks were taken
		for (var i = 1; i < timeStamps.length -1; i +=2) {
			var tempTime = timeStamps[i + 1] - timeStamps[i]; //calculate length of a break
			breakTime += tempTime;//add to total time spent on breaks
			breakCount++;//count how many breaks were taken
		}
	}
	breakTime = Math.floor(breakTime/1000);//convert to seconds
	workTime = totalTime - breakTime;//calculate total time spent acutally working
	$("#timer").css("display", "none");//hide timer
	$("#finished").css("display", "block");//show finished chunk survey
	console.log(startDate);
	console.log("Total chunk time: " + totalTime);
	console.log("Total break time: " + breakTime);
	console.log("Number of breaks taken: " + breakCount);
	console.log("Time spent actually working: " + workTime);
}

function autoBreak() {//displays autoBreak prompt
	$("#timer").css("display", "none");
	$("#autoBreak").css("display", "block");
}





