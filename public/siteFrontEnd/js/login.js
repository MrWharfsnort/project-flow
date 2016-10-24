$(document).ready(function(){

	$("#signIn").click(function() { //singin button listener
		var pw = $("#password").val(); //get password input
		var email = $("#email").val(); //get email input
		$.post("/api/login", { //post to the login api
			password: pw,
			email: email
		}, function(response){
			if(response.status === "success") { //if logged in
				console.log(response);
				window.location = "/";
			}
		});
	});

});
