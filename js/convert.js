// DRIVER DATA CONVERTERS

function fixColor(color) {
    // Colors are passed with alpha value (eg #FFFF0000 for red instead of #FF0000)
    return '#' + color.substr(3);
}

function convertChampPos(champ) {
    var prev = champ['PreviousPosition'];
    var cur = champ['LivePosition'];
    if (prev === cur) return prev;
    var diff = prev - cur;
    var sign = diff > 0 ? '+' : '';
    return cur + ' <span class="champ-smallfont">(' + sign + diff + ')</span>';
}

function convertChampPoints(champ) {
    var cur = champ['CurrentRacePoints'];
    var live = champ['LivePoints'];
    if (cur === 0 || cur === '0') return live;
    return live + ' <span class="champ-smallfont">(+' + cur + ')</span>';
}

function convertCarNumber(car) {
    var img = convertCarImg(car['CarName']);
    return img + car['CarNumber'];
}

function convertCarImg(carname) {
    return '<img height="20px" src="img/' + carname + '.png" />';
}

function convertCarToClassNumber(carObject) {

	// Extract the car number and the car class ID values
	var number = carObject['CarNumber'];  // carObject.CarNumber should also work
	var classId = carObject['CarClassId'];

	// Get a color depending on the class ID
	var color = '#fff';
	if (classId == 59) {
		// HPD
		color = 'rgb(255, 218, 89)'; // yellow
	}
	else if (classId == 40) {
		// GT3 cars
		color = 'rgb(51, 206, 255)'; // blue
	}

	// Build a html span object to show
	var span = '<span style="background-color:' + color + '">#' + number + '</span>';

	// Return the html string
	return span;
}

function convertCarToClassNumber(car) {

    var number = '#' + car['CarNumber'];

    var color = '#fff';
    var classId = car['CarClassId'];
    if (classId == 59) {
        // hpd
        color = 'rgb(255, 218, 89)';
    } else if (classId == 40) {
        // gt3
        color = 'rgb(51, 206, 255)';
    }

    var width = '50px';
    var padding = '0px, 5px';

    return '<span style="text-align:center;display:block;width:' + width + ';padding:' + padding + ';background-color:' + color + ';">' + number + '</span>';
}

function convertState(isOut) {
    if (isOut) {
        return '<span style="color:red;">OUT</span>';
    }
	else{
    	return '<span style="color:#0C0;">RUN</span>';
	}
}

function roundTime(str) {
    if (str == '' || str == '0') return '';
    var time = parseFloat(str);
    var rounded = Math.round(time * 10) / 10;
    return rounded.toFixed(1);
}

function convertRaceTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds - (h * 3600)) / 60);
    var s = seconds - (h * 3600) - (m * 60);
    s = Math.round(s);
    var hours = h < 10 ? '0' + h : h;
    var min = m < 10 ? '0' + m : m;
    var sec = s < 10 ? '0' + s : s;
    return hours + ':' + min + ':' + sec;
}

function CarIDtoName(car){
	var name;

	//NES4
    switch (car){

        case 39:

            name = '<img src="images/honda.png" alt="HPD ARX-01C" />';
			break;
			
		case 98:
            name = '<img src="images/audi.png" alt="Audi R18 e-tron quattro" />';
            break;

        case 92:
            name = '<img src="images/ford.png" alt="Ford GT" />';
            break;

        case 93:
            name = '<img src="images/ferrari.png" alt="Ferrari 488" />';
			break;
			
        case 100:
            name = '<img src="images/porsche.png" alt="Porsche 919 Hybrid" />';
			break;
			
        case 102:
            name = '<img src="images/porsche.png" alt="Porsche 911 RSR" />';
            break;

        default:
            name = car;
    }

	return name;
}

var teamData = '';

function TeamIDToTeamName(teamid) {

    // Load teamdata only once
    if (teamData === '') {
        $.ajax({
            async: false,
            dataType: 'json',
            url: '/teams.json',
            success: function(data) {
                teamData = data;
            }
        });
    }

    // Find matching team id
    var teamName = '';
    for (var i = 0; i < teamData.length; i++) {
        if (teamData[i]['teamID'] == teamid) {

            // Found team
            teamName = teamData[i]['teamName'];
            break;
        }
    }

    return teamName;
}

// SESSION DATA CONVERTERS

function convertBestlap(bestlap) {

    if (bestlap == null || bestlap['Laptime'] == null || bestlap['Laptime']['Value'] <= 0) return '-';

    var time = bestlap['Laptime']['Display'];
    var lap = bestlap['Laptime']['LapNumber'];
    var driver = '#' + bestlap['DriverNumber'] + ' ' + bestlap['DriverName'];

    return time + ' (lap ' + lap + ') by ' + driver;
}
