const request = require('sync-request');
const suncalc = require('suncalc');
const parseString = require('xml2js').parseString;

module.exports = {
    getISSPosition: getISSPosition,
    checkDaylight: checkDaylight
}

function getISSPosition() {
    const url = `http://api.open-notify.org/iss-now.json`;
    var res = request('GET', url);
    var iss = JSON.parse(res.getBody('utf-8'));
    return iss.iss_position;
}

function checkDaylight(iss_position) {
    var lat = iss_position.latitude;
    var lng = iss_position.longitude;
    var now = new Date();
    
    var times = suncalc.getTimes(now, lat, lng);

    var daylight = 1;
    if (now < times.sunriseEnd) {
        daylight = 0;
    } else if (now < times.dusk) {
        daylight = 1;
    } else {
        daylight = 0;
    }

    return daylight;
}

