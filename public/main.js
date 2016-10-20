$(document).ready(function () {

	$("#signIn").click(function() { //singin button listener
		var uName = $("#username").val(); //get username input
		var pw = $("#password").val(); //get password input
		var email = $("#email").val(); //get email input
		$.post("/api/login", { //post to the login api
			username: uName,
			password: pw,
			email: email
		}, function(response){
			if(response.status === "success") { //if logged in 
				$("#login").css("display", "none"); //hide login div
				$("#timer").css("display", "block"); //display timer div
				//enable timer button
			}
		});
	});

	$("#startTimer").click(function (evt) {
		startTime();  //todo: write startTime in timer.js
		$button = $(evt.target);
		$button.text("Finish");
		$button.attr("id", "endTimer");
		$("#endTimer").click(endTime);
	});

});