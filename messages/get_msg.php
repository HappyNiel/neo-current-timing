<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

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
	
	//query
	$query = "SELECT * FROM `LT_messages` ORDER BY `ID` DESC LIMIT 2";
	$result = mysqli_query($con, $query);
	
	while($row = mysqli_fetch_array($result, MYSQL_ASSOC))
	{
		$comments[] = $row;	
	}
	// coderen als JSON:
	header('Content-type: text/javascript');
	echo json_encode($comments);
?>