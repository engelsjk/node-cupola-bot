'use strict';

const request = require('sync-request');
const fs = require('fs');
const jimp = require('jimp');
const config = require('../config.js');

///

var settings = {
    zoom_day: 8,
    zoom_night: 5.5,
    imagesize: "736x1105"
};

const init_image = ( files, handle_image_processing_end ) => {
    const rootpath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : 'tmp/';
    
    settings.filepath_image = rootpath + files.filename_image;
    settings.filepath_image_satellite = rootpath + files.filename_image_satellite;
    settings.filepath_mask = files.filepath_mask;

    settings.access_token = config['mapbox_token'];
    settings.mapbox_style_night = config['mapbox_style_night'];

    settings.handle_image_processing_end = handle_image_processing_end;
}

const start_image_processing = ( iss, daylight ) => {
    get_satellite_image ( iss, daylight );
}

const get_satellite_image = ( iss, daylight ) => {

    let lat = iss.iss_position.latitude;
    let lng = iss.iss_position.longitude;
    let day_or_night = daylight ? 'day' : 'night';

    let urls = {
        // 'day': `https://api.mapbox.com/v4/mapbox.satellite/${lng},${lat},${settings.zoom_day}/${settings.imagesize}.png?access_token=${settings.access_token}`, // DEPRECATED BY MAPBOX
        'day': `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},${settings.zoom_day}/${settings.imagesize}?access_token=${settings.access_token}`,
        'night': `https://api.mapbox.com/styles/v1/${settings.mapbox_style_night}/static/${lng},${lat},${settings.zoom_night}/${settings.imagesize}?access_token=${settings.access_token}`
    };

    let res = request( 'GET', urls[day_or_night] );
    let body = res.getBody();

    fs.writeFile( settings.filepath_image_satellite, body, 'binary', handle_satellite_image_file );
}

const handle_satellite_image_file = ( err ) => {
    if (err) { console.error(err) } else { 
        console.log('satellite_image_saved')
        load_cupola_mask();
    }; 
}

const load_cupola_mask = ( ) => {
    jimp.read( settings.filepath_mask )
        .then( function ( image ) {
            save_cupola_image( image );
        }).catch(function (err) {
            console.error(err);
        });
}

const save_cupola_image = ( image_mask ) => {

    jimp.read( settings.filepath_image_satellite )
        .then( function (image) {
            image.composite(image_mask, 0, 0);
            image.getBuffer( jimp.MIME_PNG, function( err, src ) {
                fs.writeFile( settings.filepath_image, src, 'binary', handle_cupola_image_file )
            });
        }).catch(function (err) {
            console.error(err);
        });
}

const handle_cupola_image_file = ( err ) => {
    if (err) { console.error(err) } else { 
        console.log('cupola_image_saved')
        settings.handle_image_processing_end();
    }; 
}

const image = {
    init_image: init_image,
    start_image_processing: start_image_processing
};
module.exports = image;