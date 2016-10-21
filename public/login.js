$(document).ready(function(){

	$("#signIn").click(function() { //singin button listener
		var pw = $("#password").val(); //get password input
		var email = $("#email").val(); //get email input
		$.post("/api/login", { //post to the login api
			password: pw,
			email: email
		}, function(response){
			if(response.status === "success") { //if logged in
			}
		});
	});

	$("#signUp").click(function(){ //click listener to show registration div
		$("#login").css("display", "none");
		$("#newUser").css("display", "block");
	});

});
