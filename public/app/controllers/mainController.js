app.controller("mainController", function($scope, $rootScope, $http, Product) {
    Product.query(function(data) {
        $scope.products = data;
    });
    $scope.authMessage = false;

    function refreshCart(){
        var total = 0;
        for ( var i = 0, _len = $rootScope.cart.length; i < _len; i++ ) {
            total += $rootScope.cart[i]["amount"] * $rootScope.cart[i]["price"];
        }
        $rootScope.total = total;
    }

    $scope.checkout = function (){
        //if (true){ // use this condition for testing order submission before the authentication is fully implemented
        if ($rootScope.authenticated){
            $http.post('/api/orders', {products: $rootScope.cart}).then(
                function successCallback(reponse){
                    $rootScope.cart = [];
                    refreshCart();
                }).catch(
                function errorCallback(response) {
                    console.log(response);
                }
            );
            $scope.authMessage = false;
        } else {
            $scope.authMessage = true; 
        }
    };

    $scope.addToCart = function (index){
        product = $scope.products[index];
        productIndex = $rootScope.cart.map(function(e) { return e["_id"]; }).indexOf(product["_id"]);
        if (productIndex == -1){
        	product["amount"] = 1;
			$rootScope.cart.push(product);
        } else {
        	$rootScope.cart[productIndex]["amount"] += 1;
        };
        refreshCart();
    };
});