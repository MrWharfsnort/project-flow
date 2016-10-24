$(document).ready(function () {
	var chunkId;
	

	$("#showTimer").click(function (evt) {
		console.log("a");
		startTime();  //calls startTime in timer.js
		$("#dashBody").css("display", "none"); //hide start timer button
		$("#showTimer").css("display", "none"); 
		$("#timeBody").css("display", "block"); //show stop timer button
		$("#endTimer").click(endTime); //add click listener
		$.post("/api/chunk/new", {}, function(res){
			chunkId = res.chunkId;
		});
	});
});
// 	$("#logout").click(function() {
// 		$.post("/api/logout", function (res) {
// 			window.location = "/";
// 		});
// 	});

// 	$("#endBreak").click(function(){ //click listener to end break on break div
// 		endBreak();
// 		$.post("/api/chunk/interval", {
// 			chunkId: chunkId,
// 			date: startDate,
// 			timeFromStart: breakTime,
// 			challenge: $("#challenge").val(),
// 			skill: $("#skill").val(),
// 			activity: $("#activity").val(),
// 			caffeine: $("#caffeine").val(),
// 			food: $("#food").val()
// 		}, function(res) {
// 			console.log(res);
// 		});
// 	});

// 	$("#yesBreak").click(startBreak); //click listener on autoBreak div

// 	$("#noBreak").click(function() { //click listener to choose no autoBreak on autoBreak div
// 		$("#autoBreak").css("display", "none");
// 		$("#timer").css("display", "block");
// 		skipBreak(); //reset autoBreak timeout
// 	});

// 	$("#submitSurvey").click(function(){
// 		var survey = {
// 			chunkId: chunkId,
// 			breaksTaken: breakCount,
// 			timeSpent: totalTime,
// 			timeOfDay: startDate,
// 			sleep: $("#sleep").val(),
// 			meals: $("#meals").val()
// 		};
// 		console.log(survey);
// 		$.post("/api/chunk/done", survey, function(res){
// 			console.log(res);
// 		});
// 		$("#finished").css("display", "none");
// 		$("#data").css("display", "block");
// 	});




// });
// 	function notifyMe(string) {
// 	  // Let's check if the browser supports notifications
// 	  if (!("Notification" in window)) {
// 		alert("This browser does not support system notifications");
// 	  }

// 	  // Let's check whether notification permissions have already been granted
// 	  else if (Notification.permission === "granted") {
// 		// If it's okay let's create a notification
// 		var notification = new Notification(string);
// 	  }

// 	  // Otherwise, we need to ask the user for permission
// 	  else if (Notification.permission !== 'denied') {
// 		Notification.requestPermission(function (permission) {
// 		  if (permission === "granted") {
// 			var notification = new Notification("Hi there!");
// 		  }
// 		});
// 	  }
// 	}
