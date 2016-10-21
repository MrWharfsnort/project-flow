$(document).ready(function () {
	var chunkId;

	$("#addUser").click(function(){
		var name = $("#name").val(); //get username input
		var pw = $("#newPassword").val(); //get password input
		var email = $("#newEmail").val(); //get email input

		$.post("/api/register", { //post to the register api
			name: name,
			password: pw,
			email: email
		}, function(response){
			if(response.status === "success") { //if logged in 
				$("#newUser").css("display", "none"); //hide login div
				$("#timer").css("display", "block"); //display timer div
			}
		});
	});

	$("#startTimer").click(function (evt) {
		startTime();  //calls startTime in timer.js
		$(evt.target).css("display", "none"); //hide start timer button
		$("#endTimer").css("display", "inline"); //show stop timer button
		$("#endTimer").click(endTime); //add click listener
		$.post("/api/chunk/new", function(res){
			chunkId = res.chunkId;
		});
	});

	$("#logout").click(function() {
		$.post("/api/logout", function (res) {
			window.location = "/";
		});
	});

	$("#endBreak").click(function(){ //click listener to end break on break div
		$post("/api/chunk/interval", {
			challenge: $("#challenge").val(),
			skill: $("#skill").val(),
			activity: $("#activity").val(),
			caffeine: $("#caffeine").val(),
			food: $("#food").val()
		}, function(res) {
			console.log(res);
		});
		endBreak();
	});

	$("#yesBreak").click(startBreak); //click listener on autoBreak div

	$("#noBreak").click(function() { //click listener to choose no autoBreak on autoBreak div
		$("#autoBreak").css("display", "none");
		$("#timer").css("display", "block");
		skipBreak(); //reset autoBreak timeout  
	});

	$("#submitSurvey").click(function(){
		var survey = {
			breaksTaken: breakCount,
			timeSpent: totalTime,
			timeOfDay: startDate,
			sleep: $("#sleep").val(),
			meals: $("#meals").val(),
			intervals: intervalSurveys
		};
		console.log(survey);
		$.post("/api/chunk/done", survey, function(res){
			console.log(res);
		});
	});






});