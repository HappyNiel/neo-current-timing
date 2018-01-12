$(document).ready(function() {
	loadJSON();
	
	$('form').submit(function(e){
		var message = $('#textbox').val();
		console.log(message);
		
		//Send the message to the database
		$.ajax({
			type: 	'POST',
			url: 	'connect_db.php',
			data:	{input: message},
			success: function(){
				console.log('succes');
			}
		});
		
		e.preventDefault();
		$('#textbox').val('');
	});
	
	$('#clear').submit(function(){
		var message = $('#textbox').val('');
		
		//Send the message to the database
		$.ajax({
			type: 	'POST',
			url: 	'connect_db.php',
			data:	{input: message},
			success: function(){
				console.log('succes');
			}
		});
	});
	
	var url='http://www.neo-endurance.com/live/messages/get_msg.php';
	
	setInterval(function(){
		loadJSON();
	}, 30000);
});

function loadJSON(){
	var url='http://www.neo-endurance.com/live/messages/get_msg.php';
	$.ajax({
		url: url,
		dataType: "json",
		ifModified: true,
		success: function(json){
			$('#msg').html(json[0].Message);	
		}
	});
	/*$.getJSON(url,function(json){
			//console.log(json[0].Message);
			$('#msg').html(json[0].Message);
	});*/
};