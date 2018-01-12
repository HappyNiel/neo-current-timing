var eventsTableId = 'eventsTable';

// Event types:
// 0 - Message
// 1 - Green flag
// 2 - Yellow flag
// 3 - Winner
// 4 - Position change (not implemented)
// 5 - New leader
// 6 - New best lap
// 7 - Driver swap
// 8 - Pit entry
// 9 - Pit exit

eventConfigs = [];
eventConfigs[0] = { title: 'Message', image: 'img/message.png' };
eventConfigs[1] = { title: 'Green flag', image: 'img/green.png' };
eventConfigs[2] = { title: 'Yellow flag', image: 'img/yellow.png' };
eventConfigs[3] = { title: 'Finish', image: 'img/finish.png' };
eventConfigs[4] = { title: 'Overtake', image: 'img/overtake.png' }; // not used
eventConfigs[5] = { title: 'New leader', image: 'img/newleader.png' };
eventConfigs[6] = { title: 'New fastest lap', image: 'img/bestlap.png' };
eventConfigs[7] = { title: 'Driver swap', image: 'img/swap.png' };
eventConfigs[8] = { title: 'Pit entry', image: 'img/pitentry.png' };
eventConfigs[9] = { title: 'Pit exit', image: 'img/pitexit.png' };

function getEventImage(eventConfig) {
    return '<img height="24" src="' + eventConfig.image + '" />';
}

function getEventHtml(event) {
    var type = event.Type;
    var config = eventConfigs[type];
    if (config === null) {
        console.log('Invalid event type: ' + type);
        return '';
    }

    var time = convertRaceTime(event.RaceEvent.SessionTime);

    var html = '<td>' + getEventImage(config) + '</td>';
    html += '<td><div class="event-item-container">';
    html += '<div class="event-item-top">';
    html += '<div class="event-item-title">';
    html += '<span class="event-item-time">';
    html += time;
    html += '</span>'
    html += config.title;
    html += '</div>';

    html += '<div class="clearfix"></div>';
    html += '<div class="event-item-message">';
    html += event.Message;
    html += '</div></div></td>';

    return html;
}