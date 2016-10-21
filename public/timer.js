var timeStamps = [];
var inputObjects = [];
var totalTime = 0;
var breakTime = 0;
var workTime = 0;
var breakCount = 0;
var startDate;
var t;


function startTime() {
	timeStamps.push(Date.now());
	startDate = new Date();
	$("#takeBreak").click(startBreak);
	setAutoBreak();
}


function startBreak() {
	timeStamps.push(Date.now());
	clearTimeout(t);
	$("#timer").css("display", "none");
	$("#autoBreak").css("display", "none");
	$("#break").css("display", "block");
}

function endBreak() {
	// todo take in input fields
	timeStamps.push(Date.now());
	$("#break").css("display", "none");
	$("#timer").css("display", "block");
	setAutoBreak();
}

function setAutoBreak() {
	t = setTimeout(autoBreak, 5000); //todo replace timeout length with actual working value
}

function endTime() {
	console.log(timeStamps);
	timeStamps.push(Date.now());
	console.log(timeStamps);
	clearTimeout(t);
	totalTime = timeStamps[timeStamps.length - 1] - timeStamps[0];
	totalTime = Math.floor(totalTime/1000);
	if(timeStamps.length > 2) {
		for (var i = 1; i < timeStamps.length -1; i +=2) {
			var tempTime = timeStamps[i + 1] - timeStamps[i];
			breakTime += tempTime;
			breakCount++;
		}
	}
	breakTime = Math.floor(breakTime/1000);
	workTime = totalTime - breakTime;
	$("#timer").css("display", "none");
	$("#finished").css("display", "block");
	console.log(startDate);
	console.log("Total chunk time: " + totalTime);
	console.log("Total break time: " + breakTime);
	console.log("Number of breaks taken: " + breakCount);
	console.log("Time spent actually working: " + workTime);
}

function autoBreak() {
	$("#timer").css("display", "none");
	$("#autoBreak").css("display", "block");
}





