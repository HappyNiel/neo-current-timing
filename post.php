<?php

	$secret = "nes2-timing";
	$cachedir = "sessions";
	
	// End of configuration
	
	// *** DO NOT CHANGE ANYTHING UNDERNEATH HERE ***

	try {
	
		$ssid = (int)$_POST["ssid"];
		$type = $_POST["type"];
						
		if($_POST["key"] == $secret) {
		
			if ($type == "dataupdate") {
		
				if($_POST["compression"] == "true") {
					$data = gzinflate(base64_decode($_POST["data"]));
					$eventchanges = gzinflate(base64_decode($_POST["events"]));
					
					if($data == false) {
						echo "Unable to inflate!";
						die();
					}
					if ($events == false) {
						echo "Unable to inflate";
						die();
					}
				}
				else
				{
					$data = urldecode(stripslashes($_POST["data"]));
					$eventchanges = urldecode(stripslashes($_POST["events"]));
				}

				$rebuild = false;
				
				if($ssid > 0) {
				
					$delayed = $_POST["delayed"] === "1";
					$dir = $cachedir . "/" . $ssid;
					if ($delayed) {
						$dir = $dir . "/delayed/";
					}
					else {
						$dir = $dir . "/live/";
					}
				
					mkdir($dir, 0777, true);
					if (!file_exists($dir)) {
						echo "dir does NOT exist!\n";
					}
					
					// Save data directly to json file
					$filename = $dir . "data.json";
					if(!is_file($filename))
						$rebuild = true;
					
					file_put_contents($filename, $data);
									
					// read previous events from server
					$events = read_events($ssid, $delayed);
					
					// apply changes
					$changes = json_decode($eventchanges, true);
					apply_event_changes($events, $changes);
					
					// save to server
					save_events($ssid, $events, $delayed);
				}
				else {
					echo "Session ID error!";
				}
				
				if($rebuild)
					set_current($_POST["ssid"]);
			}
			else if ($type == "configupdate") {
			
		  $config = "";
				if($_POST["compression"] == "true") {
					$config = gzinflate(base64_decode($_POST["config"]));
					
					if($config == false) {
						echo "Unable to inflate!";
						die();
					}
				}
				else
				{
					$config = urldecode(stripslashes($_POST["config"]));
				}

				// Write config
				if($ssid > 0) {
					mkdir($cachedir ."/". $ssid, 0777, true);
					// Save data directly to json file
					$filename = $cachedir ."/". $ssid ."/config.json";				
					file_put_contents($filename, $config);	
				}
				else {
					echo "Session ID error!";
				}
			}

			else if ($type == "mobiledataupdate") {
				if($_POST["compression"] == "true") {
					$data = gzinflate(base64_decode($_POST["data"]));
					
					if($data == false) {
						echo "Unable to inflate!";
						die();
					}
					if ($events == false) {
						echo "Unable to inflate";
						die();
					}
				}
				else
				{
					$data = urldecode(stripslashes($_POST["data"]));
				}

				$rebuild = false;
				
				if($ssid > 0) {
				
					$delayed = $_POST["delayed"] === "1";
					$dir = $cachedir . "/" . $ssid;
					if ($delayed)
						$dir = $dir . "/delayed/";
					else
						$dir = $dir . "/live/";
				
					mkdir($dir, 0777, true);
					
					// Save data directly to json file
					$filename = $dir . "mobile_data.json";
					if(!is_file($filename))
						$rebuild = true;
						
					file_put_contents($filename, $data);								
				}
				else {
					echo "Session ID error!";
				}
			}
			
			else {
				echo "General error!";
			}
		}
		else {
			echo "Key error!";
		}

	} catch (Exception $e) {
		echo "Exception: " . $e->getMessage();
	}
		
	function read_events($ssid, $delayed) {
		global $cachedir;
		$dir = $cachedir . "/" . $ssid;
		if ($delayed)
			$dir = $dir . "/delayed/";
		else
			$dir = $dir . "/live/";
		$path = $dir . "events.json";
		
		if (file_exists($path)) {
			$json_string = file_get_contents($path);
			return json_decode($json_string, true);
		} 
		else {
			return array();
		}
	}
	
	function apply_event_changes(&$events, $changes) {
		//Loop through changes
		foreach ($changes as $change) {
		
			//Check type
			$type = $change['Type'];
			if ($type == 0) {
				//Insert event
				array_unshift($events, $change['Event']);
			}
			else if ($type == 1) {
				//Update event
				//Find event
				foreach ($events as &$event) {
					if ($event['Id'] == $change['EventId']) {
					}
				}
			}
			else if ($type == 2) {
				//Delete event
			}		
		}		
	}
	
	function save_events($ssid, $events, $delayed) {
		global $cachedir;
		$dir = $cachedir . "/" . $ssid;
		if ($delayed)
			$dir = $dir . "/delayed/";
		else
			$dir = $dir . "/live/";
		$path = $dir . "events.json";
		
		$json_string = json_encode($events);
		file_put_contents($path, $json_string);
	}

	function set_current($ssid) {
		global $cachedir;		
		$data = $ssid;
		$fp = fopen($cachedir ."/current.txt", "w+");
		fwrite($fp, $data, strlen($data));
		fclose($fp);
	}	 

?>
