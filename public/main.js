var chunkId = 0;
$(document).ready(function () {

	// $("#startTimer").click(function (evt) {
	// 	startTime();  //calls startTime in timer.js
	// 	$(evt.target).css("display", "none"); //hide start timer button
	// 	$("#endTimer").css("display", "inline"); //show stop timer button
	// 	$("#endTimer").click(endTime); //add click listener
	// 	$.post("/api/chunk/new", {}, function(res){
	// 		chunkId = res.chunkId;
	// 	});
	// });

  $("#showTimer").click(function (evt) {
    getTime();
    startTime();  //calls startTime in timer.js
    $("#dashBody").css("display", "none"); //hide start timer button
    $("#showTimer").css("display", "none");
    $("#timeBody").css("display", "block"); //show stop timer button
    $("#logout").css("display", "none");
    $("#endTimer").click(endTime); //add click listener
    $("#endTimer").css("display", "inline");
    $.post("/api/chunk/new", {}, function(res){
      console.log(res);
      chunkId = res.chunkId;
    });
  });

	$("#logout").click(function() {
		$.post("/api/logout", function (res) {
			window.location = "/";
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
		
		$.post("/api/chunk/done", survey, function(res){
			if(res === "success") {
				console.log(res);
				window.location = "/dashboard";
			}
		});
		
	});




});
	function notifyMe(string) {
	  // Let's check if the browser supports notifications
	  if (!("Notification" in window)) {
		alert("This browser does not support system notifications");
	  }

	  // Let's check whether notification permissions have already been granted
	  else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification(string);
	  }

	  // Otherwise, we need to ask the user for permission
	  else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
		  if (permission === "granted") {
			var notification = new Notification("Hi there!");
		  }
		});
	  }
	}
