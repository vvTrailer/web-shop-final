app.controller("mainController", function($scope, $rootScope, $http, Product) {
    Product.query(function(data) {
        $scope.products = data;
    });
    $scope.authMessage = false;
    $scope.thanksMessage = false;

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
            $http.post('/api/users/' + $rootScope.user["_id"] + '/orders', {products: $rootScope.cart, token: $rootScope.token}).then(
                function successCallback(reponse){
                    $rootScope.cart = [];
                    refreshCart();
                }).catch(
                function errorCallback(response) {
                    console.log(response);
                }
            );
            $scope.thanksMessage = true;
            $scope.authMessage = false;
        } else {
            $scope.authMessage = true; 
        }
    };

    $scope.addToCart = function (index){
        $scope.thanksMessage = false;
        product = $scope.products[index];
        // make list of ids from list of products and get index of the required product
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