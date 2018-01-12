// JavaScript Document
$(document).ready(function(){
	raceControlMessages();
	
	setInterval(function(){
		raceControlMessages();
	}, 120000);
});

var id_case = 0; 
console.log('init id:' + id_case);

function raceControlMessages(){
	var url='https://www.neo-endurance.com/php/get_msg_google.php';
	
	$.ajax({
		url: url,
		dataType: "json",
		ifModified: true,
		success: function(json){
			//get last entry
			var last = json.length - 1;
			console.log('new id:' + id_case);			
			
			var id_case_new = parseInt(json[last].caseID); //convert caseID to an integer
			var penalty = json[last].penalty;
			var length = json[last].length;
			var car = json[last].car;
			var reason = json[last].reason;
			
			//setup the messages
			var message_time = length + ' sec ' + penalty + ' for car ' + car + ' - ' + reason;
			var message_notime = penalty + ' for car ' + car + ' - ' + reason;
			var message;
			
			//select the correct message based on the type of penalty
			if (penalty === "S&H"){
				message = message_time;
				//$('#msg').html(message_time);
			}
			else if (penalty === "S&G" || penalty === "Warning #1" || penalty === "Warning"){
				message = message_notime;
				//$('#msg').html(message);
			}
			
			if(id_case != id_case_new){
				$('#msg').css('background','#FFA200');
				$('#msg').html(message);
				id_case = id_case_new; 
			}
			else if (id_case === id_case_new){
				$('#msg').css('background','none');
				$('#msg').html('');
				id_case = id_case_new;
			}

		}
	});
}