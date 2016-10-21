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
			}
		});
	});

	$("#signUp").click(function(){ //click listener to show registration div
		$("#login").css("display", "none");
		$("#newUser").css("display", "block");
	});

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
	});


	$("#endBreak").click(endBreak); //click listener to end break on break div

	$("#yesBreak").click(startBreak); //click listener on autoBreak div

	$("#noBreak").click(function() { //click listener to choose no autoBreak on autoBreak div
		$("#autoBreak").css("display", "none");
		$("#timer").css("display", "block");
		setAutoBreak(); //reset autoBreak timeout  
	});








});