var timeStamps = [];
var inputObjects = [];
var totalTime = 0;
var startDate;

function startTime() {
	timeStamps.push(Date.now());
	console.log(timeStamps);
}


function startBreak() {
	timeStamps.push(Date.now());
	$("#timer").css("display", "none");
	$("#break").css("display", "none");
}

function endBreak() {
	// todo take in input fields
	timeStamps.push(Date.now());
	$("#break").css("display", "none");
	$("#timer").css("display", "block");
}

function endTime() {
	//calculate total working time
	//calculate the starting date and time
	//hide timer div
	//display finished survey div
	timeStamps.push(Date.now());
	totalTime = timeStamps[timeStamps.length - 1] - timeStamps[0];

}