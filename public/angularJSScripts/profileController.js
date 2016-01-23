var facepro = angular.module('Facepro',[]);
facepro.controller('profileController', function($scope, $http) {
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/editProfileAftersignin',
			data : {
				"summary" : $scope.summary,
				"work" :$scope.work,
				"education" : $scope.education,
				"contact" : $scope.contact,
				"lifeevent" : $scope.lifeevent,
				"interests" : $scope.interests,
				"music":$scope.music,
				"shows":$scope.shows,
				"sports":$scope.sports
			}
		}).success(function(data) {
			if (data.status == 'fail') {
				alert(data.msg);
			}
			else if(data.status=='success'){
				alert(data.msg);
				window.location.assign("/viewProfile");
			} 
		}).error(function(error) {
			alert("error");
		});
	};
	
	$http({
		method : "GET",
		url : '/getProfileDetails',
		}).then(function(response) {
		  	var data = response.data;
			$scope.summary=response.data[0];
			$scope.work=response.data[1];
			$scope.education=response.data[2];
			$scope.contact=parseFloat(response.data[3]);
			$scope.lifeevent=response.data[4];
			$scope.music=response.data[5];
			$scope.shows=response.data[6];
			$scope.sports=response.data[7];
		 }, function() {
	});
});