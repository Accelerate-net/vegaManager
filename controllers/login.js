angular.module('AdminLoginApp', ['ngCookies'])


.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])

  .controller('adminloginController', function($scope, $http, $cookies) {

    $scope.username = "";
    $scope.password = "";

    $scope.isLoginError = false;
    $scope.warnMsg = "";

    $scope.loginadmin = function(){
        var data = {};
        data.mobile = $scope.username;
        data.password = $scope.password;
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/adminlogin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          $scope.token = response.data.response;
          console.log($scope.token)
          if(response.data.status == true){

            //Set cookies
            var now = new Date();
            now.setDate(now.getDate() + 7);
            $cookies.put("zaitoonAdmin", $scope.token, {
                expires: now
            });

            localStorage.setItem("branch" , response.data.branch);
            localStorage.setItem("branchCode" , response.data.branchCode);
            window.location = "index.html";
          }else{
            $scope.isLoginError = true;
            $scope.warnMsg = response.data.error;
          }
          });
    }

	})

  ;
