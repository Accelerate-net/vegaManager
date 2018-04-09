angular.module('helpdeskApp', ['ngCookies', 'ngSanitize'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('helpdeskController', function($scope, $http, $interval, $cookies) {

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
    
    
	       

    //Add unread class
    $scope.checkUnread = function(queryContent){
    	if(queryContent.status == 0){
    		return "unread";    		
    	}
    	else{
    		return "readMessage";
    	}
    }
    
      $scope.helprequests_length = 0;
      
        //Search or Filter part        
        $scope.searchKey = {};
        $scope.searchKey.value = "";
        $scope.isFilterRequested = false;
        $scope.isSearchResultFound = false;
        $scope.searchResultCount = 0;
        
        $scope.displayQueryFlag = false;
               
       

      $scope.isQueriesFound = false;
      $scope.totalQueries = 0;
      $scope.currentPage = 1;      

       $scope.loadPage = function(pageId) {
       
       	  $scope.displayQueryFlag = false;
       	  $scope.isReplyRequested = false;
       	
       	  //Update Current page
       	  $scope.currentPage = pageId;
       	  
          var data = {};
          data.token = $cookies.get("zaitoonAdmin");
          data.id = pageId-1;
	  if($scope.isFilterRequested){
	  	data.searchkey = $scope.searchKey.value;
	  }

          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/fetchqueries.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              if(response.data.status){
	            $scope.isQueriesFound = true;
	            $scope.queryList = response.data.response;
	            $scope.totalQueries = Math.ceil(response.data.count/10);
	            $scope.unreadTotal = response.data.unreadCount;
	            
	            if(response.data.error != ""){
	            	$scope.isSearchResultFound = true;
	            	$scope.searchResultCount = response.data.count;
	            }	  		          
              }
              else{
	              if(pageId == 1){
	              	$scope.isQueriesFound = false;
	              }
              }
            });
        }
        
        $scope.loadPage(1);
        
        //Search Queries
        $scope.searchHelp = function(){
        	if($scope.searchKey.value != ""){
	        	$scope.isFilterRequested = true;
	        }
	        else{
	        	$scope.isFilterRequested = false;
	        }
	        $scope.loadPage(1);       	
        }
        
       	$scope.clearSearch = function(){
       	
       		$scope.displayQueryFlag = false;
       		$scope.isReplyRequested = false;
       		
       		//Reset values and loadPage(1)
                $scope.searchKey.value = "";
	        $scope.isFilterRequested = false;
	        $scope.isSearchResultFound = false;
	        $scope.searchResultCount = 0;
	        
	        $scope.loadPage(1);
        }
        
       
        	
        
        //Open Quick Insights
        	
        	//Defaults
                $scope.quickContentFail = "";
        	$scope.quickContentRecent = "";
        	$scope.quickFound = false;
        	$scope.quickFoundFail = false;
        	$scope.quickFoundRecent = false;
        	$scope.isMoreLeft = true;
        	        
        $scope.getQuickInsights = function(userMobile){
        
        	$scope.quickContentFail = "";
        	$scope.quickContentRecent = "";
        	$scope.quickFound = false;
        	$scope.quickFoundFail = false;
        	$scope.quickFoundRecent = false;
        	$scope.isMoreLeft = true;
        	
	          var data = {};
	          data.token = $cookies.get("zaitoonAdmin");
	          data.key = userMobile;
	          data.id = 0;
	
	          $http({
	            method  : 'POST',
	            url     : 'https://zaitoon.online/services/mailboxinsights.php',
	            data    : data,
	            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	           })
	           .then(function(response) {
	              if(response.data.status){
	              	    $scope.quickFound = true;
		            $scope.quickContentFail = response.data.failed; 	
		            $scope.quickContentRecent = response.data.recent; 
		                        
		            $scope.quickFoundFail = response.data.failFound;
        		    $scope.quickFoundRecent = response.data.recentFound;     

		             if($scope.quickContentFail.length%3 == 0){
		                  $scope.isMoreLeft = true;
		             }else{
		                  $scope.isMoreLeft = false;
		             }
	              }
	              else{
			    $scope.quickFound = false;
			    $scope.isMoreLeft = false;
	              }
	            }); 
	}
	
      //Load More FAILED Orders
      $scope.limiter = 0;
      $scope.loadMore = function(userMobile){
        $scope.limiter = $scope.limiter + 3;
        var data = {};
        data.token = $cookies.get("zaitoonAdmin");
        data.key = userMobile;
        data.id = $scope.limiter;      

        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/mailboxinsights.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
           if(response.data.status){
           	if(response.data.failFound){
           		$scope.quickContentFail = $scope.quickContentFail.concat(response.data.failed);
           		
           		if($scope.quickContentFail.length%3 == 0){
		       		$scope.isMoreLeft = true;
		        }else{
		        	$scope.isMoreLeft = false;
		        }
           	}
           	else{
           		$scope.isMoreLeft = false;
           	}
           }
           else{
           	if($scope.limiter == 0){
             		$scope.quickFound = false;
             	}
             	else{
             		$scope.isMoreLeft = false;
             	}
           }
          });
      }
      
      
	            
	            
        //Display Query
        $scope.displayQuery = function(query){        
        	$scope.displayQueryFlag = true;
        	$scope.displayContent = query;
        	$scope.isReplyRequested = false;
        	
		$scope.getQuickInsights(query.userMobile);     	       	
        }
        
        $scope.clearDisplay = function(){
        	$scope.displayQueryFlag = false;
        	$scope.isReplyRequested = false;
        }
        
        $scope.openReplyWindow = function(cont, type){
        	$scope.replyContent = cont;
        	
        	
        	if($scope.replyContent.isRefund){
        		$scope.replyContent.replySubject = "Regarding Refund - with Ref. No. "+$scope.replyContent.remarks;
        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nWe are really sorry for the inconvenience caused to you, while you were placing an order with us. Payment failure happens because of network related issues. Anyways, your money is safe with us.\n\nThe debited amount has been reversed to the original payment method. Please contact Razorpay Customer Care (contact@razorpay.com) with the payment reference number, in case you do not get the refund in 5-7 working days.\n\nHope to serve you again soon.\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id;   	
        	}
        	else{
			switch(type) {
			    case "REPLY_ORDER_QUERY":
			    {
	        		$scope.replyContent.replySubject = "Hello from Zaitoon";
	        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nThank you for writing to us. Please contact the outlet manager directly for updates on your orders. You can find the contact numbers from here - https://www.zaitoon.online/home/index.html#reach\n\nFor any further assistance, you can drop us a mail at care@zaitoon.online\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id; 
	        		break; 
			    }
			    case "REPLY_DELAYED_ORDER":
			    {
	        		$scope.replyContent.replySubject = "Sorry for the delay in delivering your order";
	        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nPlease accept our sincere apologies for the delay caused in delivering the order. The delay was never intended. It would have been due to certain unavoidable circumstances. We assure you a better experience next time. \n\nHope to serve you again soon.\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id; 
	        		break; 
			    }			    
			    case "REPLY_FEEDBACK_NEGATIVE":
			    {
	        		$scope.replyContent.replySubject = "Apologies for the disappointing experience with us";
	        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nPlease accept our sincere apologies for the disappointing experience you have had. Trust us, it was never intended. We would definitely count your valuable feedback and assure you a better experience next time. \n\nHope to serve you again soon.\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id; 
	        		break; 
			    }
			    case "REPLY_FEEDBACK_POSITIVE":
			    {
			    	$scope.replyContent.replySubject = "Thanking you for the Feedback";
	        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nThank you for taking the time to provide us with your valuable feedback. We strive to provide our customers with quality food and excellent service and we take your comments to heart.\n\nAs always, we appreciate your trust in us. Love to serve you again soon.\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id; 
			        break; 
			    }
			    default:
			    {
	        		$scope.replyContent.replySubject = "Hello from Zaitoon";
	        		$scope.replyContent.replyMessage = "Dear "+$scope.replyContent.userName+",\n\nThanks for writing to us.\n...\nHope to serve you again soon.\n\nRegards,\nZaitoon Support Team\nMail Reference ID: "+$scope.replyContent.id;  
			    }
			}        	
        	
        	}
        	
        	$scope.isReplyRequested = true;
        }
        
        $scope.cancelReplyMode = function(){
        	$scope.replyContent = {};
        	$scope.isReplyRequested = false;
        }
        
        $scope.markSpamOpen = function(myId, myName){
        	$scope.confirmContentName = myName;
        	$scope.confirmContentId = myId;
        	$('#confirmationModal').modal('show');
        }
        
        $scope.markSpam = function(uid){		
		var data = {};
		data.token = $cookies.get("zaitoonAdmin");	
		data.id = uid;	

		 $http({
		          method  : 'POST',
		          url     : 'https://zaitoon.online/services/markqueryspam.php',
		          data    : data,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {

	         	$('#confirmationModal').modal('hide');
	              	if(response.data.status){	              		
	              		$scope.displayContent.status = 2;	
	              		
	              		$scope.helprequests_length--; 
	              		$scope.unreadTotal--;             		      					        		          		              		
	              	}
	              	else{
	              		alert('Error: '+response.data.error);
	              	}
	         });     	        
	}
	
	
	
	
	

	$scope.getFormattedContent = function(content){
		return content.replace(new RegExp('\n','g'), '<br/>');
	}

        $scope.submitReply = function(){
		$scope.isReplyRequested = false;		
		
		var mydata = {};
		mydata.token = $cookies.get("zaitoonAdmin");	
		mydata.id = $scope.displayContent.id;	
		mydata.replyText = $scope.replyContent.replyMessage;
		mydata.replySubject = $scope.replyContent.replySubject;
		mydata.replyEmail = $scope.replyContent.userEmail;		
			  
		$scope.submitToServer = function(){
		 $http({
		          method  : 'POST',
		          url     : 'https://zaitoon.online/services/inboxresponseadmin.php',
		          data    : mydata,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
	              	if(response.data.status){           	
	              		$scope.displayContent.replyDate = response.data.response.replyDate;
	              		$scope.displayContent.replyAgent = response.data.response.replyAgent;
	              		$scope.displayContent.replyContent = response.data.response.replyContent;	              		
	              		$scope.displayContent.status = 1;	
	              		
	              		$scope.helprequests_length--; 
	              		$scope.unreadTotal--;   
	              				  	              		         		          		              		
	              	}
	              	else{
	              		alert('Error: '+response.data.error);
	              	}
	         });	         	         
	        }
	        
	         		  //Send Mail
				  var message = mydata.replyText.replace(new RegExp('\n','g'), '<br/>');
				  var headers_obj =  {
				      'From': 'Zaitoon Care <care@zaitoon.online>',
				      'To': mydata.replyEmail,
				      'Subject': mydata.replySubject,
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
        
        //Filter Refunds / General queries
        $scope.shortlistQueries = function(type){
        	$scope.searchKey.value = type;
        	$scope.searchHelp();
        }
        
        
        //Copy to Clipboard
        $scope.copyToClipboardPaymentID = function(element) {
	  var $temp = $("<input>");
	  $("body").append($temp);
	  $temp.val($(element).text()).select();
	  document.execCommand("copy");
	  $temp.remove();
	  
	  //UI Changes
	  document.getElementById("copyNameButton").innerHTML = "Copied "+document.getElementById("copyName").innerHTML;
	  $('.copyNameButtonCls').fadeOut(2000);
	  setTimeout(function(){
	  	document.getElementById("copyNameButton").innerHTML = '<i class="ti ti-files"></i>';
	   	$('.copyNameButtonCls').fadeIn(1000); 
	  }, 2100);	  
	}
        
        
        $scope.openOrder = function(orderContent){
        	$scope.displayOrderContent = orderContent;
        	$scope.displayOrderType = orderContent.isTakeaway;
        	$('#viewModal').modal('show');
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