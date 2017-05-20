app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'app/views/main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'app/views/login.html',
			controller: 'authController'

		})
		//the signup display
		.when('/register', {
			templateUrl: 'app/views/register.html',
			controller: 'authController'
		});
});