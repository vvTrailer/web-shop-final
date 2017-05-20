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

app.factory("Product", function($resource) {
  return $resource("/api/products/:id");
});

app.controller("mainController", function($scope, $rootScope, Product) {
    Product.query(function(data) {
        $scope.products = data;
    });

    $scope.addToCart = function (index){
        product = $scope.products[index];
        productIndex = $rootScope.cart.map(function(e) { return e["_id"]; }).indexOf(product["_id"]);
        if (productIndex == -1){
        	product["amount"] = 1;
			$rootScope.cart.push(product);
            console.log("pushing new product to cart");        	
        } else {
        	$rootScope.cart[productIndex]["amount"] += 1;
            console.log("increasing count of the product by 1");
            console.log(product);
        };

	    var total = 0;
	    for ( var i = 0, _len = $rootScope.cart.length; i < _len; i++ ) {
	        total += $rootScope.cart[i]["amount"] * $rootScope.cart[i]["price"];
	    }
	    $rootScope.total = total;
    };
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