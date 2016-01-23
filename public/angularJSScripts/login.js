var facepro = angular.module('Facepro', []);
	//defining the login controller
	facepro.controller('login', function($scope, $http) {
		$scope.unexpected_error = true;
		$scope.submit = function() {
			var email=$scope.email;
			var password=$scope.password;
			var error="";
			var email_regexp=/^[a-z A-Z 0-9]*$/;
			var dot,at;
			at=document.getElementById("emailLogin").value.indexOf("@");
			dot=document.getElementById("emailLogin").value.lastIndexOf(".");
			if(email=="" || email==undefined)
			{
				document.getElementById("emailLogin").style.background="#ED2939";
				error+="Email ID is empty\n";
			}
			else if(at<1 || dot-at<2)
			{
				document.getElementById("emailLogin").style.background="#ED2939";
				error+="Email is in incorrect format\n";
			}
			else{
				document.getElementById("emailLogin").style.background="white";
			}
			if(password=="" || password==undefined){
				document.getElementById("passwordLogin").style.background="#ED2939";
				error+="Password is empty\n";
			}
			else{
				document.getElementById("passwordLogin").style.background="white";
			}
			if(error!=""){
				alert(error);
				return false;
			}
			$http({
				method : "POST",
				url : '/checklogin',
				data : {
					"email" : $scope.email,
					"password" : $scope.password
				}
			}).success(function(result) {
				if(result.status == "success")
					window.location = '/homepage';
				else if(result.status=="fail")
				{
					if(result.msg=='No Such User'){
						alert("No Such User found. Please Register");
						window.location = '/signup';
					}
					else if(result.msg=='Incorrect Login'){
						alert(result.msg);
					}
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
			});
		};
	});
	
	
	facepro.controller('signup', function($scope, $http) {
		$scope.submit = function() {
			var error="";
			var firstname_verification=$scope.firstName;
			var lastname_verification= $scope.lastName;
			var email_verification=$scope.email;
			var confirmemail_verification=$scope.confirmEmail;
			var password_verification=$scope.signupPassword;
			var gender_verification=$scope.gender;
			
			var val=/^[a-z A-Z]*$/;
			if(firstname_verification=="" || firstname_verification==undefined)
			{
				document.getElementById("firstname").style.background="#ED2939";
				error+="First Name is empty.\n";
			}
			else if(!val.test(firstname_verification))
			{
				document.getElementById("firstname").style.background="#ED2939";
				error+="First Name contains illegal characters\n";
			}
			else
				document.getElementById("firstname").style.background="white";
				
			
			if(lastname_verification=="" || lastname_verification==undefined)
			{
				document.getElementById("lastName").style.background="#ED2939";
				error+="Last Name is empty.\n";
			}
			else if(!val.test(lastname_verification))
			{
				document.getElementById("lastName").style.background="#ED2939";
				error+="Last Name contains illegal characters\n";
			}
			else
				document.getElementById("lastName").style.background="white";
			
			if(!(email_verification==confirmemail_verification)){
				error+="'Email' and 'Confirm email' are not matched"
				document.getElementById("email").style.background="#ED2939";
				document.getElementById("confirmemail").style.background="#ED2939";
			}
			else{
				document.getElementById("email").style.background="white";
				document.getElementById("confirmemail").style.background="white";
			}
			
			if(confirmemail_verification=="" || confirmemail_verification==undefined)
			{
				document.getElementById("confirmemail").style.background="#ED2939";
			 	error+="Confirmation Email is empty.\n";
			}
				
			
			var email_regexp=/^[a-z A-Z 0-9]*$/
			var dot,at;
			at=document.getElementById("email").value.indexOf("@");
			dot=document.getElementById("email").value.lastIndexOf(".");
			if(email_verification=="" || email_verification==undefined)
			{
				document.getElementById("email").style.background="#ED2939";
			 	error+="Email is empty.\n";
			}
			else if(at<1 || dot-at<2)
			{
				document.getElementById("email").style.background="#ED2939";
				error+="Email id is wrongly entered\n";
			}
			else
				document.getElementById("email").style.background="white";
				
			if(password_verification=="" || password_verification==undefined)
			{
				document.getElementById("signupPassword").style.background="#ED2939";
				error+="Password is empty.\n";
			}
			else if(password_verification.length<6 || password_verification.length>15)
			{
				document.getElementById("signupPassword").style.background="#ED2939";
				error+="Password must be in between 6 and 15 characters in length\n";
			}
			else
				document.getElementById("signupPassword").style.background="white";
			var gender=$scope.gender;
			if($scope.gender=="" || $scope.gender==undefined)
			{
				error+="Please select gender\n";
			}
			
			if(error!=""){
				alert(error);
				return false;
			}
			
			$http({
				method : "POST",
				url : '/usersignup',
				data : {"firstName" : $scope.firstName , "lastName": $scope.lastName,"email":$scope.email,"confirmEmail":$scope.confirmEmail,"signupPassword":$scope.signupPassword,"gender":$scope.gender}
			}).success(function(data) {
				if(data.status=="success"){
					alert(data.msg);
					window.location.assign("/gettingStarted"); 
				}
				else if(data.status=="fail"){
					alert(data.msg);
				}
			}).error(function(error) {
				alert("error");
			});
		};
	});