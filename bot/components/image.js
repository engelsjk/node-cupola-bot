const request = require('sync-request');
const fs = require('fs');
const jimp = require('jimp');

const tweet = require('./tweet.js');

const config = require('../config.js');

module.exports = {
    getSatelliteImage: getSatelliteImage
}

function getSatelliteImage(iss_position, daylight, image_settings) {

    var lat = iss_position.latitude;
    var lng = iss_position.longitude;
    var day_or_night = daylight ? 'day' : 'night';
    
    const access_token = config['mapbox_token'];

    const zoom_day = image_settings.zoom_day;
    const zoom_night = image_settings.zoom_night;
    const imagesize = image_settings.imagesize;
    const mapstyle = image_settings.mapstyle;

    var urls = {
        'day': `https://api.mapbox.com/v4/mapbox.satellite/${lng},${lat},${zoom_day}/${imagesize}.png?access_token=${access_token}`,
        'night': `https://api.mapbox.com/styles/v1/${mapstyle}/static/${lng},${lat},${zoom_night}/${imagesize}?access_token=${access_token}`
    };

    var url = urls[day_or_night];

    var res = request('GET', url);
    var body = res.getBody();

    fs.writeFile(image_settings.filepath_image_satellite, body, 'binary', (err) => {
        if (err) { console.error(err) } else { 
            console.log('Satellite image saved!')
            getCupolaImage(image_settings);
        };
    })

}

function saveCupolaImage(image_mask, image_settings){

    jimp.read(image_settings.filepath_image_satellite).then(function (image) {
        var image_satellite = image;
        image_satellite.composite(image_mask, 0, 0);

        image_satellite.getBuffer(jimp.MIME_PNG, function(err, src){
            fs.writeFile(image_settings.filepath_image, src, 'binary', (err) => {
                if (err) { console.error(err) } else { 
                    console.log('Cupola image saved!')
                    tweet.sendTweet(image_settings);
                };
            })
        });
        
    }).catch(function (err) {
        console.error(err);
    });
}

function getCupolaImage(image_settings) {
    loadCupolaMask(image_settings);
}

function loadCupolaMask(image_settings) {
    jimp.read(image_settings.filepath_mask).then(function (image) {
        var image_mask = image;
        saveCupolaImage(image_mask, image_settings);
    }).catch(function (err) {
        console.error(err);
    });
}