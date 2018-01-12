<?php
	//Database login
	$host = "localhost";
	$username = "w4764349_NEOuser";
	$password = "NEOdatabase!";
	
	$db_name = "w4764349_NEO";
	$db_table = "LT_messages";
	$db_error = "Error. Not connected";
	
	//Connect with database
	$con = mysqli_connect($host,$username,$password,$db_name);
	
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}
	
	$message = $_POST['input'];
	//query
	$query = "INSERT INTO LT_messages (ID, Message) VALUES (NULL, '". $_POST["input"] ."');";
	mysqli_query($con, $query);
?>