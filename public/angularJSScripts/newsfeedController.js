var facepro = angular.module('Facepro');
		facepro.controller('newsfeedController', function($scope, $http) {
			$scope.submit = function() {
				$http({
					method : "POST",
					url : '/postNewsfeed',
					data : {
						"post" : $scope.newsfeed
					}
				}).success(function(data) {
				//checking the response data for statusCode
				if (data.status == 'fail') {
					alert("error");
				}
				else if(data.status=='success'){
					alert(data.msg);
					window.location.assign("/homepage");
					} 
				}).error(function(error) {
					$scope.unexpected_error = false;
					$scope.invalid_login = true;
				});
			};
			
			$http({
				method : "GET",
				url : '/getNewsFeed',
				}).then(function(response) {
				  	var data = response.data;
					$scope.newsfeedData=data;
				 }, function() {
			});
		});