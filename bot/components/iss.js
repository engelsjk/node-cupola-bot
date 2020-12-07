'use strict';

const request = require('sync-request');
const suncalc = require('suncalc');
const parseString = require('xml2js').parseString;

///

const get_iss_position = () => {
    const url = `http://api.open-notify.org/iss-now.json`;
    let res = request( 'GET', url );
    let iss = JSON.parse( res.getBody('utf-8') );
    return iss.iss_position;
}

const check_daylight = ( iss_position ) => {
    let lat = iss_position.latitude;
    let lng = iss_position.longitude;
    let now = new Date();
    
    let times = suncalc.getTimes(now, lat, lng);

    let daylight = 1;
    if (now < times.sunriseEnd) {
        daylight = 0;
    } else if (now < times.dusk) {
        daylight = 1;
    } else {
        daylight = 0;
    }

    return daylight;
}

const iss = {
    get_iss_position: get_iss_position,
    check_daylight: check_daylight
};
module.exports = iss;

