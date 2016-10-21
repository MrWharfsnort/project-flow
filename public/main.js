$(document).ready(function () {
	var chunkId;

	$("#startTimer").click(function (evt) {
		startTime();  //calls startTime in timer.js
		$(evt.target).css("display", "none"); //hide start timer button
		$("#endTimer").css("display", "inline"); //show stop timer button
		$("#endTimer").click(endTime); //add click listener
		$.post("/api/chunk/new", {}, function(res){
			chunkId = res.chunkId;
		});
	});

	$("#logout").click(function() {
		$.post("/api/logout", function (res) {
			window.location = "/";
		});
	});

	$("#endBreak").click(function(){ //click listener to end break on break div
		endBreak();
		$.post("/api/chunk/interval", {
			chunkId: chunkId,
			timeFromStart: breakTime,
			challenge: $("#challenge").val(),
			skill: $("#skill").val(),
			activity: $("#activity").val(),
			caffeine: $("#caffeine").val(),
			food: $("#food").val()
		}, function(res) {
			console.log(res);
		});
	});

	$("#yesBreak").click(startBreak); //click listener on autoBreak div

	$("#noBreak").click(function() { //click listener to choose no autoBreak on autoBreak div
		$("#autoBreak").css("display", "none");
		$("#timer").css("display", "block");
		skipBreak(); //reset autoBreak timeout
	});

	$("#submitSurvey").click(function(){
		var survey = {
			chunkId: chunkId,
			breaksTaken: breakCount,
			timeSpent: totalTime,
			timeOfDay: startDate,
			sleep: $("#sleep").val(),
			meals: $("#meals").val()
		};
		console.log(survey);
		$.post("/api/chunk/done", survey, function(res){
			console.log(res);
		});
	});






});
