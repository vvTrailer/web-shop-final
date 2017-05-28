app.controller('authController', function($scope, $http, $rootScope, $location){
    $scope.login = {email: '', password: ''};
    $scope.error_message = '';
    $rootScope.user = { name: '', password: '', email: '', address: '', city: '', country: ''};

    $scope.authenticate = function(){
        $http.post('/api/authenticate', $scope.login).then(function(response){
            if(response.data.success == true){
                $rootScope.authenticated = true;
                $rootScope.user = response.data.user;
                $rootScope.token = response.data.token;
                $location.path('/');
            }
            else{
                $scope.error_message = response.data.message;
            }
        });
    };

    $scope.register = function(){
        $http.post('/api/users', $scope.user).then(function(response){
            if(response.data.success == true){
                $rootScope.authenticated = true;
                $rootScope.user = response.data.user;
                $rootScope.token = response.data.token;
                $location.path('/');
            }
            else{
                $scope.error_message = response.data.message;
            }
        });
    };
});