app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/main.html'
		})
		.when('/login', {
			templateUrl: 'app/views/login.html'
		})
		.when('/register', {
			templateUrl: 'app/views/register.html'
		});
});