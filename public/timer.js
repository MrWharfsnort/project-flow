var timeStamps = [];
var inputObjects = [];
var totalTime = 0;
var startDate;

function startTime() {
	timeStamps.push(Date.now());
	startDate = new Date();
	$("#takeBreak").click(startBreak);
}


function startBreak() {
	timeStamps.push(Date.now());
	$("#timer").css("display", "none");
	$("#break").css("display", "block");
}

function endBreak() {
	// todo take in input fields
	timeStamps.push(Date.now());
	$("#break").css("display", "none");
	$("#timer").css("display", "block");
}

function endTime() {
	timeStamps.push(Date.now());
	totalTime = timeStamps[timeStamps.length - 1] - timeStamps[0];
	totalTime = Math.floor(totalTime/1000);
	$("#timer").css("display", "none");
	$("#finished").css("display", "block");
	console.log(totalTime);
}