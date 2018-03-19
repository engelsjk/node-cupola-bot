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
    var datetime = new Date();
    
    var suntimes = suncalc.getTimes(datetime, lat, lng);
    var daylight = datetime < suntimes.nightEnd ? 0 : 1;

    return daylight;
}

