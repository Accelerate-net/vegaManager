angular.module('feedsApp', ['ngCookies', 'infinite-scroll'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('feedbackController', function($scope, $http, $interval, $cookies) {

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

    //Rating Figures
    $scope.rating = {};

    $("#feedbackLoader").addClass("smallLoading");
    var data = {};
    data.token = $cookies.get("zaitoonAdmin");
    $http({
      method  : 'POST',
      url     : 'https://zaitoon.online/services/fetchfeedbackfigures.php',
      data    : data,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
     .then(function(response) {     
        $scope.rating = response.data;        
        
        //Render
        setTimeout(function(){
        
        $("#feedbackLoader").removeClass("smallLoading");

        $('.easypiechart#overall').easyPieChart({
            barColor: $scope.getBarColor('rate_overall'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

        $('.easypiechart#food').easyPieChart({
            barColor: $scope.getBarColor('rate_food'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

        $('.easypiechart#quality').easyPieChart({
            barColor: $scope.getBarColor('rate_quality'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

        $('.easypiechart#delivery').easyPieChart({
            barColor: $scope.getBarColor('rate_delivery'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

        $('.easypiechart#service').easyPieChart({
            barColor: $scope.getBarColor('rate_service'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

        $('.easypiechart#app').easyPieChart({
            barColor: $scope.getBarColor('rate_app'),
            trackColor: 'transparent',
            scaleColor: '#eee',
            scaleLength: 8,
            lineCap: 'square',
            lineWidth: 2,
            size: 96,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });

	}, 1);
  
      });
      
      //Round Bar Color
      $scope.getBarColor = function(myId){
      	var rating = document.getElementById(myId).innerHTML; 
      	
      	if(rating >= 4){
      		document.getElementById(myId).style.color = "#305D02";      		     	
      		return "#305D02";
      	}
      	else if(rating >= 3.5){
	      	document.getElementById(myId).style.color = "#cddc39";   
      		return "#cddc39";
      	}
      	else if(rating >= 3){
	      	document.getElementById(myId).style.color = "#FFBA00";   
      		return "#FFBA00";
      	}
      	else if(rating >= 2){
      		document.getElementById(myId).style.color = "#FF7800";   
      		return "#FF7800";
      	}
      	else if(rating < 2){
      		document.getElementById(myId).style.color = "#CD1C26";   
      		return "#CD1C26";      			
      	}
      	else{
      		document.getElementById(myId).style.color = "#34495e";   
      		return "#34495e";
      	}

      }
      
      //Get Bottom Text Color
      $scope.getMyStyle = function(rating){
      	var green = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#305D02"
      	}
      	
      	var palegreen = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#cddc39"
      	}
      	
      	var yellow = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#FFBA00"
      	}
      	
      	var orange = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#FF7800"
      	} 
      	
      	var red = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#CD1C26"
      	} 
      	
      	var grey = {
      		"font-size" : "18px", 
      		"text-transform" : "none",
      		"font-weight" : "400",
      		"color" : "#34495e"
      	} 
      	
      	if(rating >= 4){      	
      		return green;
      	}
      	else if(rating >= 3.5){
      		return palegreen;
      	}
      	else if(rating >= 3){
      		return yellow;
      	}
      	else if(rating >= 2){
      		return orange;
      	}
      	else if(rating < 2){
      		return red;
      	}
      	else{
      		return grey;
      	}
      	
      }
      
      
      //Filter out the feedbacks
      $scope.isFilterApplied = false;
      $scope.filterText = "";
      $scope.filterMode = '';
      
      
      $scope.isFeedbackFound = false;

      $scope.limiter = 0;
      $scope.isMoreLeft = true;
      


	$scope.init = function(){
	
	      var data = {};
	      data.token = $cookies.get("zaitoonAdmin");
	      data.id = 0;
	      data.filter = $scope.filterMode;
    	      data.isFilter = $scope.isFilterApplied? 1 : 0;
    	         	      
	      $http({
	        method  : 'POST',
	        url     : 'https://zaitoon.online/services/fetchfeedbacks.php',
	        data    : data,
	        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	       })
	       .then(function(response) {
	          if(response.data.status){
	            $scope.isFeedbackFound = true;
	            $scope.feedbacks = response.data.response;
	            if($scope.feedbacks.length%5 != 0){
	              $scope.isMoreLeft = false;
	            }
	          }
	          else{
	            $scope.isFeedbackFound = false;
	          }
	        });
	}
	
	$scope.init();
	
	
	
      //Filter Functions
      $scope.showFilters = function(){
      	$('#filterModal').modal('show');      
      }
      
      $scope.applyFilter = function(mode){      	
      	$scope.filterMode = mode;
      	
      	switch(mode){
      		case 'MOST':{
      			$scope.filterText = "Showing positively rated Feedbacks first";
      			break;
      		}
      		case 'LEAST':{
      			$scope.filterText = "Showing negatively rated Feedbacks first";
      			break;
      		}  
      		case 'COMMENTS':{
      			$scope.filterText = "Showing Feedbacks with comments first";
      			break;
      		}      	
      		default:{
      			$scope.filterText = "";
      			break;
      		}      		
      	}
      	
      $scope.isFilterApplied = true;
      	$('#filterModal').modal('hide');
      	$scope.limiter = 0;
      	$scope.init();
      }
      
      $scope.cancelFilters = function(){
      	$scope.filterMode = "";
      	$scope.filterText = "";
      	$scope.isFilterApplied = false;
      	$scope.limiter = 0;
      	$scope.init();
      }
      	

       
       
       
       $scope.loadMore = function() {
          $scope.limiter = $scope.limiter + 5;
          var data = {};
          data.token = $cookies.get("zaitoonAdmin");
          data.id = $scope.limiter;
          
          data.filter = $scope.filterMode;
    	  data.isFilter = $scope.isFilterApplied? 1 : 0;
    	      
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/fetchfeedbacks.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              if(response.data.status){
                $scope.feedbacks = $scope.feedbacks.concat(response.data.response);
                if($scope.feedbacks.length%5 != 0){
                  $scope.isMoreLeft = false;
                }
              }
              else{
                $scope.isMoreLeft = false;
              }
            });
        }
        
        
        //Feedback Response
        
        $scope.responseModal = function(obj){

        	$scope.feedContent = obj;   
        
	        $scope.replySubject = "Hello from Zaitoon";
	        $scope.replyMessage = "";  
	        $scope.replyEmail = obj.email;   
	        $scope.replyOrder = obj.orderID;   	
        	
        $scope.setReplyContent = function(feed, type){
			switch(type) {
			    case "REPLY_FOOD_QUALITY":
			    {	  
			    	$scope.replySubject = "Feedback on #"+feed.orderID+" | Thank you for letting us know";     		
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nThank you for taking your time to provide us with your valuable feedback. Please accept our sincere apologies for your disappointment with the quality of food delivered to you. We never compromise on the quality of food served to our customers. We have noted down your feedback and immediate measures will be taken in order to ensure that the same will not be repeated.\n\nPlease contact the outlet manager immediately in case you feel any quality related issues. You can find the contact numbers from here - https://www.zaitoon.online/home/index.html#reach\n\nKindly contact customer support (care@zaitoon.online) for any further concerns you might have.\n\nRegards,\nTeam Zaitoon"; 
	        		break; 
			    }
			    case "REPLY_DELAYED_ORDER":
			    {
	        		$scope.replySubject = "Feedback on #"+feed.orderID+" | Sorry for the delay in delivering your order";
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nPlease accept our sincere apologies for the delay caused in delivering the order. The delay was never intended. It would have been due to certain unavoidable circumstances. We assure you a better experience next time. \n\nHope to serve you again soon.\n\nRegards,\nTeam Zaitoon";
	        		break; 
			    }			    
			    case "REPLY_FEEDBACK_NEGATIVE":
			    {
			    	$scope.replySubject = "Feedback on #"+feed.orderID+" | Apologies for the disappointing experience with us";
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nPlease accept our sincere apologies for the disappointing experience you have had. Trust us, it was never intended. We would definitely count your valuable feedback and assure you a better experience next time. \n\nHope to serve you again soon.\n\nRegards,\nTeam Zaitoon";
	        		break; 
			    }
			    case "REPLY_FEEDBACK_NEGATIVE_WITH_DISCOUNT":
			    {
			    	$scope.replySubject = "Feedback on #"+feed.orderID+" | Use this Coupon as a token of our acceptance to this mistake";
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nPlease accept our sincere apologies for the disappointing experience you have had. Trust us, it was never intended. We would definitely count your valuable feedback and assure you a better experience next time.\n\nAs a token of our acceptance to this mistake which would have caused from our end, you can use this coupon code XXXXXXXXXXX on a minimum bill amount of Rs. XXXXX, and get Rs. XXXX OFF \n\nHope to serve you again soon.\n\nRegards,\nTeam Zaitoon";
	        		break; 
			    }			    
			    case "REPLY_FEEDBACK_POSITIVE":
			    {
			    	$scope.replySubject = "Feedback on #"+feed.orderID+" | Thanking you for the appreciation";
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nThank you for taking the time to provide us with your valuable feedback. We strive to provide our customers with quality food and excellent service and we take your comments to heart.\n\nAs always, we appreciate your trust in us. Love to serve you again soon.\n\nRegards,\nTeam Zaitoon";
			        break; 
			    }
			    default:
			    {
	        		$scope.replySubject =  "Feedback on #"+feed.orderID+" | Response from Zaitoon";
	        		$scope.replyMessage = "Dear "+feed.userName+",\n\nYou rated us "+feed.feedback.rating+" out of 5 at "+feed.time+" on your recent order #"+feed.orderID+" and commented that:\n"+feed.feedback.comment+"\n\nThanks for noting this down. \n\nRegards,\nTeam Zaitoon";
			    }
			}            
        }

        	    	
        	$('#responseModal').modal('show');
        	
        }
        
        
        $scope.sendResponse = function(){		
		
		var mydata = {};
		mydata.token = $cookies.get("zaitoonAdmin");	
		mydata.id = $scope.replyOrder;	
					  
		$scope.submitToServer = function(){
		 $http({
		          method  : 'POST',
		          url     : 'https://zaitoon.online/services/feedbackresponseadmin.php',
		          data    : mydata,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
	              	if(response.data.status){        	  
	              		$scope.init();            		   	
           		        $('#responseModal').modal('hide');	          		              		
	              	}
	              	else{
	              		alert('Error: '+response.data.error);
	              	}
	         });	         	         
	        }
	        
	         		  //Send Mail
				  var message = $scope.replyMessage.replace(new RegExp('\n','g'), '<br/>');
				  var headers_obj =  {
				      'From': 'Zaitoon Care <care@zaitoon.online>',
				      'To': $scope.replyEmail,
				      'Subject': $scope.replySubject,
				      'Content-Type': 'text/html; charset="UTF-8"',
				      'Content-Transfer-Encoding': 'base64'
				  };
				    
				  var email = '';
				  
				    for(var header in headers_obj)
			    		email += header += ": "+headers_obj[header]+"\r\n"; 
			    
				  email += "\r\n" + message;
				  var sendRequest = gapi.client.gmail.users.messages.send({
				    'userId': 'me',
				    'resource': {
				      'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
				    }
				  });
				
				  sendRequest.execute($scope.submitToServer());		        
	        
	         
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
