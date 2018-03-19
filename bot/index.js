const iss = require('./components/iss.js');
const image = require('./components/image.js');
const tweet = require('./components/tweet.js');
///

const rootpath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : 'tmp/';

const image_settings = {
    filepath_image: rootpath + 'image.png',
    filepath_image_satellite: rootpath + 'image_satellite.png',
    filepath_mask: 'assets/mask.png',
    zoom_day: 7.75,
    zoom_night: 5.5,
    imagesize: "736x1105",
    mapstyle: 'atthegate/cjexp3fnq3i702sqt3qjnqwta'
}

///

function runCupolaBot() {

    var iss_position = iss.getISSPosition();
    var daylight = iss.checkDaylight(iss_position);
    
    image.getSatelliteImage(iss_position, daylight, image_settings);
}

exports.handler = function(event, context, callback) {
    console.log('Run Cupola Bot!');
    runCupolaBot();
}

if (!process.env.LAMBDA_TASK_ROOT) { exports.handler(); }



