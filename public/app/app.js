var app = angular.module('webshopApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});

app.controller("productsController", function($scope, $rootScope) {
    $scope.products = [
	    {"id": "a", "name": "Apple", "description": "Really tasty apple. You should buy it.", "price": 150, "image": "https://upload.wikimedia.org/wikipedia/commons/0/07/Honeycrisp-Apple.jpg"},
    	{"id": "b", "name": "Pear", "description": "You can make a pie with it.", "price": 100, "image": "https://upload.wikimedia.org/wikipedia/commons/6/61/Alexander_Lucas_10.10.10.jpg"},
    	{"id": "c", "name": "Banana", "description": "The ultimate fruit!", "price": 999, "image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg"}
    ];
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