
$(function() {

	//Tokenfield
	var myList = "";
	
	$.get("https://www.zaitoon.online/services/fetchoutletinfosimple.php", function(data){
          var temp = JSON.parse(data);
          if(temp.status){
		myList = temp.response;
          }
          else{
          	myList = [{value: 'IITMADRAS'}, {value: 'JPNAGAR'}, {value: 'ANNANAGAR'} , {value: 'VELACHERY'}, {value: 'MADURAI'}, {value: 'HALROAD'}, {value: 'NUNGAMBAKKAM'}, {value: 'ROYAPETTAH'}, {value: 'ADYAR'}, {value: 'QATAR'}];
          }
      	});      	      
      	
      
	setTimeout(function(){
		var engine = new Bloodhound({
			local: myList,
			datumTokenizer: function(d) {
				return Bloodhound.tokenizers.whitespace(d.value); 
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace
		});
	
		engine.initialize();
	
	
		$('#tokenfield-typeahead').tokenfield({
			typeahead: [null, { source: engine.ttAdapter() }]
		});
	}, 4000);

});