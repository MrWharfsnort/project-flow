$(document).ready(function () {

	$("#signIn").click(function() { //singin button listener
		var pw = $("#password").val(); //get password input
		var email = $("#email").val(); //get email input
		$.post("/api/login", { //post to the login api
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

	$("#signUp").click(function(){
		$("#login").css("display", "none");
		$("#newUser").css("display", "block");
	});

	$("#addUser").click(function(){
		var name = $("#name").val(); //get username input
		var pw = $("#newPassword").val(); //get password input
		var email = $("#newEmail").val(); //get email input
		console.log(name, pw, email);
		$.post("/api/register", { //post to the register api
			name: name,
			password: pw,
			email: email
		}, function(response){
			if(response.status === "success") { //if logged in 
				$("#newUser").css("display", "none"); //hide login div
				$("#timer").css("display", "block"); //display timer div
				//enable timer button
			}
		});
	});

	$("#startTimer").click(function (evt) {
		startTime();  //todo: write startTime in timer.js
		$button = $(evt.target);
		$button.css("display", "none");
		$("#endTimer").css("display", "inline");
		$("#endTimer").click(endTime);
	});


	$("#endBreak").click(endBreak);

	$("#yesBreak").click(startBreak);

	$("#noBreak").click(function() {
		$("#autoBreak").css("display", "none");
		$("#timer").css("display", "block");
		setAutoBreak();
	});








});