var updateFrequency = 10;
var sessionsDir = 'sessions';
var standingsTableId = 'standingsTable';
var showDelayed = true;
//var eventsTableId = "eventsTable";


var standingsRowMods = [
    ['PitInfo.InPitLane', true, 'pitlane'], /* if PitInfo.InPitLane == true then add 'pitlane' class to row class */
    ['PitInfo.InPitStall', true, 'pitstall'],
    ['CurrentResults.IsOut', true, 'out']
];
