angular.module('ResourcesApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('deliveryagentController', function($scope, $http, $interval, $cookies) {

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
      var temp_branch = localStorage.getItem("branchCode");

      $scope.initAgents = function(){
	      $http.get("https://zaitoon.online/services/fetchroles.php?branch="+temp_branch+"&role=AGENT").then(function(response) {
	          $scope.delivery_agent = response.data.results;
	      });
      }
      
      $scope.initAgents();
	
      $scope.errorflag =  false;
      $scope.agentcode = '';
      $scope.agentname = '';
      $scope.addAgent = function(){
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.code = $scope.agentcode ;
        data.name = $scope.agentname ;
        if(data.code == "" || data.name == ""){
          $scope.errorflag =  true;
        }
        else{
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/addagent.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              $scope.initAgents();
            });
        }
      }
      
      $scope.askForDelete = function(con){
      	$scope.askContent = con;
      	$('#confirmationModal').modal('show');
      }

      $scope.removeAgent = function(code){
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.code = code;
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/removeagent.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          $('#confirmationModal').modal('hide');
          $scope.initAgents();
         });

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

  .controller('financeledgerController', function($scope, $http, $interval, $cookies) {

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
    
    
    //Date Picker Initializers
		    $('#reportFromDate').datetimepicker({  
			    	format: "dd-mm-yyyy",
			    	weekStart: 1,
		        	todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    })  
		    $('#reportToDate').datetimepicker({  
			    	format: "dd-mm-yyyy",
			    	weekStart: 1,
		        	todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    })  
		    $('#quickFromDate').datetimepicker({  
			    	format: "dd-mm-yyyy",
			    	weekStart: 1,
		        	todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    })  
		    $('#quickToDate').datetimepicker({  
			    	format: "dd-mm-yyyy",
			    	weekStart: 1,
		        	todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    })  
		  
	//Default Date Values	  
	var todaySetDate =  toDayFormatted();
	document.getElementById("reportFromDate").value = todaySetDate;
	document.getElementById("reportToDate").value = todaySetDate;
	document.getElementById("quickFromDate").value = todaySetDate;
	document.getElementById("quickToDate").value = todaySetDate;			
	
	    function toDayFormatted() {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                return [day, month, year].join('-');
            }
            	    		    		    		    
		        


        $scope.outletCode = localStorage.getItem("branch");
        
       	$scope.isSalesFound = false;
       	


	$scope.fetchFlag = false;
	$scope.isWaitingResponse = false;
	$scope.callSales = function(){
		
		if(document.getElementById("quickFromDate").value == ''){
			alert('Add From date');
		}
		else if(document.getElementById("quickToDate").value == ''){
			alert('Add To date');
		}
		else{		
			$scope.isWaitingResponse = true;
		        var data = {};
		        data.token = $cookies.get("zaitoonAdmin");
		        data.fromDate = formatDate(document.getElementById("quickFromDate").value);
		        data.toDate = formatDate(document.getElementById("quickToDate").value);		        
		        data.outlet = localStorage.getItem("branchCode");

		        $http({
		          method  : 'POST',
		          url     : 'https://zaitoon.online/services/dailysales.php',
		          data    : data,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		         })
		         .then(function(response) {
			  $scope.isWaitingResponse = false;
			  
		         	if(response.data.status){
		         		$scope.fetchFlag = true;
		         		
			          	$scope.cod_sum_delivery = response.data.response.cod_sum_delivery;
			          	$scope.cod_sum_takeaway = response.data.response.cod_sum_takeaway;	          
					$scope.cod_count_delivery = response.data.response.cod_count_delivery;
			          	$scope.cod_count_takeaway = response.data.response.cod_count_takeaway;	
			          	
			          	$scope.pre_sum_delivery = response.data.response.pre_sum_delivery;
			          	$scope.pre_sum_takeaway = response.data.response.pre_sum_takeaway;	          
					$scope.pre_count_delivery = response.data.response.pre_count_delivery;
			          	$scope.pre_count_takeaway = response.data.response.pre_count_takeaway;	
			          	
			        }
			        else{
			        	$scope.fetchFlag = false;
			        }          	      					        
		         });
	         }
	         
	         
	         //Formate date to server requiring format
	         function formatDate(date) {
	           	//Expecing date in DD-MM-YYYY and returns YYYY-MM-DD
	                var res = date.split("-");
	                return res[2]+'-'+res[1]+'-'+res[0];
            	 }	    
	}

	$scope.callSales();
	

          $scope.generateReport = function (mode){
	    
            var temp_from = formatDate(document.getElementById("reportFromDate").value);
            var temp_to = formatDate(document.getElementById("reportToDate").value);
            var temp_token = encodeURIComponent($cookies.get("zaitoonAdmin"));
            
            /* OLD Function
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                return [year, month, day].join('-');
            }
            */
            
           function formatDate(date) {
           	//Expecing date in DD-MM-YYYY and returns YYYY-MM-DD
                var res = date.split("-");
                return res[2]+'-'+res[1]+'-'+res[0];
            }
            
            
	    if(mode == 'SALES'){
            	window.open ("https://zaitoon.online/services/fetchledger.php?access="+temp_token+"&from="+temp_from+"&to="+temp_to);
            }
            else if(mode == 'DISCOUNTS'){
            	window.open ("https://zaitoon.online/services/fetchledgerdiscounts.php?access="+temp_token+"&from="+temp_from+"&to="+temp_to);
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
