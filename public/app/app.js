var app = angular.module('webshopApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	$rootScope.cart = [];
    $rootScope.total = 0;

	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});