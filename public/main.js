$(document).ready(function () {

	$("#signIn").click(function() { //singin button listener
		var uName = $("#username").val(); //get username input
		var pw = $("#password").val(); //get password input
		$.post("/api/login", { //post to the login api
			username: uName,
			password: pw
		}, function(response){
			if(response.status === "success") { //if logged in 
				$("#login").css("display", "none"); //hide login div
				$("#timer").css("display", "block"); //display timer div
				//enable timer button
			}
		});
	});

});