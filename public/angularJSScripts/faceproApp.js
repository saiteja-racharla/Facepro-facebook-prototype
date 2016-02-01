var facepro = angular.module('Facepro', ['ui.router']);
facepro.config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider.state('home',{
		url:'/',
		templateUrl:'partials/home',
	}).state('groupchat',{
		url:'/groupchat',
		templateUrl:'partials/groupchat',
	})
}]);
