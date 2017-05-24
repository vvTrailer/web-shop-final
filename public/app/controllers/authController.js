app.controller('authController', function($scope, $http, $rootScope, $location){
    $scope.login = {email: '', password: ''};
    $scope.error_message = '';
    $rootScope.user = { name: '', password: '', email: '', address: '', city: '', country: ''};

    $scope.authenticate = function(){
        $http.post('/api/authenticate', $scope.login).then(function(data){
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
        $http.post('/api/users', $scope.user).then(function(data){
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