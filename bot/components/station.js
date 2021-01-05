'use strict';

const request = require('sync-request');
const suncalc = require('suncalc');

///

const get_iss = () => {
    const url = `http://api.open-notify.org/iss-now.json`;
    let res = request( 'GET', url );
    if(res.statusCode!=200){
    	return {};
    }
    let iss = JSON.parse( res.getBody('utf-8') );
    return iss;
}

const check_daylight = ( iss ) => {
    let lat = iss.iss_position.latitude;
    let lng = iss.iss_position.longitude;
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

const station = {
    get_iss: get_iss,
    check_daylight: check_daylight
};
module.exports = station;

