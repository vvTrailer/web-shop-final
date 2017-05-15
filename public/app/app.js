var app = angular.module('webshopApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});

app.factory("Product", function($resource) {
  return $resource("/api/products/:id");
});

app.controller("productsController", function($scope, $rootScope, Product) {
    Product.query(function(data) {
        $scope.products = data;
    });
    $scope.addToCart = function (index){
	    $rootScope.$broadcast('addToCart', $scope.products[index]);
    };
});

app.controller("cartController", function($scope, $rootScope) {
    $scope.cart = [];
    $scope.total = 0;
    $rootScope.$on('addToCart', function (context, product) {
        productIndex = $scope.cart.indexOf(product);
        if (productIndex == -1){
        	product["amount"] = 1;
			$scope.cart.push(product);        	
        } else {
        	$scope.cart[productIndex]["amount"] += 1;
        };

	    var total = 0;
	    for ( var i = 0, _len = $scope.cart.length; i < _len; i++ ) {
	        total += $scope.cart[i]["amount"] * $scope.cart[i]["price"];
	    }
	    $scope.total = total;
    });
});

app.controller('authController', function($scope, $http, $rootScope, $location){
    $scope.login = {email: '', password: ''};
    $scope.error_message = '';
    $rootScope.user = { name: '', password: '', email: '', address: '', city: '', country: ''};

    $scope.login = function(){
    $http.post('/api/authenticate', $scope.user).then(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.user = data.user;
        $rootScope.token = data.token;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
    };

    $scope.register = function(){
    $http.post('/api/register', $scope.login).then(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.user = data.user;
        $rootScope.token = data.token;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
    };
});