var debug = true;
var ssid = 0;

var table, eventsTable;
var standingsColumns = [];
var configUpdateId = -1;
var configUpdated = false;

function log(txt) {
    if (debug === true) {
        console.log('> LiveTiming: ' + txt);
    }
}

function createStandingsHeader() {
    var header = '';
    for (var i = 0; i < standingsColumns.length; i++) {
        if (standingsColumns[i]['Width'] > 0)
            header += '<th width="' + standingsColumns[i]['Width'] + 'px">';
        else
            header += '<th width="100">';
        header += standingsColumns[i]['Header'] + '</th>';
    }
    $('#' + standingsTableId + ' thead').replaceWith('<thead><tr>' + header + '</tr></thead>');
}

function updateSessionTimer() {
    if ($("#timeRemaining").attr("float") != undefined) {
        var time = parseFloat($("#timeRemaining").attr("float"));

        time -= 1;
        if (time < 0) {
            time = 0;
        }
        else if (time < 26 * 60 * 60) {
            $("#timeRemaining").attr("float", time);
            $("#timeRemaining").text(secondsToHms(time, false));
        }
        else {
            $("#timeRemaining").text("-.--");
        }
    }
}

// Load data 
function loadData() {

    log('Start loading');

    // Re-load current ssid async
    loadCurrentSsid(true);

    if (ssid > 0) {

        // Date time for avoiding grabbing a cached version
        var time = new Date().getTime();

        // Always get config FIRST and data later
        var configUrl = sessionsDir + '/' + ssid + '/config.json?time=' + time;
        $.getJSON(configUrl, function (config) {
            
            // Update config
            updateConfig(config);

            var folder = showDelayed ? '/delayed/' : '/live/';

            // Then get data...
            var dataUrl = sessionsDir + '/' + ssid + folder + 'data.json?time=' + time;
            $.getJSON(dataUrl, function (data) {
                updateData(data);
            });

            // and events
            var eventsUrl = sessionsDir + '/' + ssid + folder + 'events.json?time=' + time;
            $.getJSON(eventsUrl, function (events) {
                updateEvents(events);
            });
        });
    }
};

function updateConfig(config) {

    // Check if config has updated
    var id = config['UpdateId'];
    log('Update config? Old: ' + configUpdateId + ', new: ' + id);
    if (id != configUpdateId) {

        // New config sent
        configUpdated = true;
        
        var columns = config['Columns'];
        standingsColumns = columns;
        
        createStandingsHeader();

        configUpdateId = id;
        log('SeriesConfig updated.');
    }

    var name = config['Name'];
    $('#seriesname').text(name);
}

// Update data
function updateData(data) {

    var sessionData = data['Session'];
    var drivers = data['Drivers'];

    // TODO: USE SESSION TIME BECAUSE COMPUTER TIMES ARE DIFFERENT
    //var sTime = new Date(data['SentTimeMilliseconds']);
    //var recTime = new Date();

    //var diff = recTime.getTime() - sTime.getTime();
    //log('Upload time diff: ' + diff);

    updateSessionData(sessionData); //, diff);
    updateStandings(drivers);
};

function updateSessionData(sessionData) { //, diff) {
    $('#lap').text(sessionData['LeaderLap']);
    $('#totalLaps').text(sessionData['RaceLaps']);

    $('#bestlap').text(convertBestlap(sessionData['OverallBestLap']));

    var remaining = sessionData['TimeRemaining'];
    
    // remaining time data is 'diff' milliseconds old. So reduce it by 'diff' ms
    //remaining = remaining - diff / 1000;

    $('#timeRemaining').text(secondsToHms(remaining, false));
    $('#timeRemaining').attr('float', remaining);
}

function updateStandings(drivers) {
    // Add rows / cells if nr of rows or columns changed, or if config updated
    if (configUpdated
    || drivers.length != table.tBodies[0].rows.length
    || table.tBodies[0].rows.length == 0
    || standingsColumns.length != table.tBodies[0].rows[0].cells.length) {
        
        // Clear table
        $('#' + standingsTableId + ' tbody').html('');
        
        // Add row for every driver, and cell for every column
        for (var i = 0; i < drivers.length; i++) {
            var newRow = table.tBodies[0].insertRow(-1);
            for (var j = 0; j < standingsColumns.length; j++) {
                newRow.insertCell(-1);
            }
        }
    }

    // Fill table
    log('Filling table');
    for (var i = 0; i < drivers.length; i++) {
        var row = table.tBodies[0].rows[i];
        var driver = drivers[i];

        // Set column values
        for (var j = 0; j < standingsColumns.length; j++) {
            var col = standingsColumns[j];

            var property = col['Property']['Path'];
            var value = getPropertyValue(driver, property);

            // has converter?
            if (col['ValueConverter'] != null
                && col['ValueConverter']['WebFunctionName'] != null
                && col['ValueConverter']['WebFunctionName'].trim() != '') {
                
                // add function
                var fn = window[col['ValueConverter']['WebFunctionName']];
                if (typeof fn === 'function') {
                    // convert
                    value = fn(value);
                }
            }

            row.cells[j].innerHTML = value;
        }

        // Set row mods
        row.className = '';
        for (var n = 0; n < standingsRowMods.length; n++) {
            var mod = standingsRowMods[n];
            var prop = mod[0];
            var valToCheck = mod[1];
            var classname = mod[2];

            var currentVal = getPropertyValue(driver, prop);
            if (currentVal == valToCheck) {
                row.className += ' ' + classname;
            }
        }
    }
}

function updateEvents(events) {
    // Add rows / cells
    log('Adding rows / cells');
    if (events.length != eventsTable.tBodies[0].rows.length) {
        $('#' + eventsTableId + ' tbody').html('');
        for (var i = 0; i < events.length; i++) {
            var newRow = eventsTable.tBodies[0].insertRow(-1);
            //for (var j = 0; j < eventColumns.length; j++) {
            var cell = newRow.insertCell(-1);
           // }
        }
    }

    // Fill table
    log('Filling table');
    for (var i = 0; i < events.length; i++) {
        var row = eventsTable.tBodies[0].rows[i];
        var event = events[i];
        var html = getEventHtml(event);
        row.innerHTML = html;
    }
}

function getPropertyValue(driver, property) {
    if (property == '') return driver;
    return driver[property];
}

// Load current ssid
function loadCurrentSsid(async) {
    if (!async)
        log('Starting getting SSID synchronously.');
    else
        log('Starting getting SSID async');
    
    $.ajax({
        async: async,
        url: sessionsDir + '/current.txt',
        success: function(result) {
            ssid = result;
        }
    });
    log('Get SSID finished: ' + ssid);
};

function startLiveTiming() {
    // Get tables
    table = document.getElementById(standingsTableId);
    eventsTable = document.getElementById(eventsTableId);

    // Create static header(s)
    //createHeader(eventColumns, eventsTableId);

    // Load ssid (not async)
    loadCurrentSsid(false); 

    // Start
    setInterval(updateSessionTimer, 1000);
    setInterval(loadData, updateFrequency * 1000);
    loadData();
};

function toggleLive() {
    showDelayed = !showDelayed;
}

// Modified from http://snipplr.com/view.php?codeview&id=20348
function secondsToHms(d, showMs) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var ms = Math.round((d % 3600 % 60) * 1000) / 1000;

    if (d <= 0 || h > 23)
        return "-.--";
    else {
        var output = new String();

        if (h > 0)
            output += h + ":";

        if (h > 0 && (m < 10 && m > 0))
            output += "0" + m + ":";
        else if (m > 0)
            output += m + ":";

        if (showMs) {
            if (ms < 10)
                output += "0";
            output += number_format(ms, 3);
        }
        else {
            if (ms < 10)
                output += "0";
            output += s;
        }

        return output;
    }
}