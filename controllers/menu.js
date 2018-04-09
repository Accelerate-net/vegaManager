angular.module('MenuApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('menuController', function($scope, $http, $interval, $cookies) {

    //Check if logged in
    if($cookies.get("zaitoonAdmin")){
      $scope.isLoggedIn = true;
    }
    else{
      $scope.isLoggedIn = false;
      window.location = "adminlogin.html";
    }


    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("zaitoonAdmin")){
        $cookies.remove("zaitoonAdmin");
        window.location = "adminlogin.html";
      }
    }

      $scope.outletCode = localStorage.getItem("branch");

      $http.get("https://zaitoon.online/services/fetchmenuwebadmin.php?token="+encodeURIComponent($cookies.get("zaitoonAdmin"))).then(function(response) {
          $scope.menu = response.data;
      });

      $scope.cuisine = "";
      $scope.showCuisineItems = function(cuisineCode){
        var i = 0;
        while(i < $scope.menu.length){
          if($scope.menu[i].mainType == cuisineCode)
          {
            $scope.cuisine = $scope.menu[i];
            break;
          }
          i++;
        }

        //$scope.initializeMenu();
      }

      $scope.initializeMenu = function(){
        $http.get("https://zaitoon.online/services/fetchmenuwebadmin.php?token="+encodeURIComponent($cookies.get("zaitoonAdmin"))).then(function(response) {
            $scope.menu = response.data;
        });
      }


      $scope.markAllAvail = function(cuisine){
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.cuisine = cuisine;
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/cuisinestatus.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         });
        $scope.cuisine = "";
        $scope.initializeMenu();
        $scope.showCuisineItems(cuisine);
        window.location.reload();
      }

      $scope.resetAvail = function(id, status){
        if(!status){
          var data = {};
          data.token = $cookies.get("zaitoonAdmin");
          data.code = id;
          //console.log (id);
          data.status = 1;
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/itemstatus.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
           });
          document.getElementById(id).innerHTML="<span class=\"label label-success\">Available</span>";
        }
        else
        {
          var data = {};
          data.token = $cookies.get("zaitoonAdmin");
          data.code = id;
          data.status = 0;
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/itemstatus.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
           });
          document.getElementById(id).innerHTML="<span class=\"label label-danger\">Out of Stock</span>";
        }
      }


       //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("zaitoonAdmin");
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
          data    : admin_data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         	if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
         });

        $scope.Timer = $interval(function () {
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
            data    : admin_data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
                if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
           });
        }, 20000);

	
	
	})

  ;
