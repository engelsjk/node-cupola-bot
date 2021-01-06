'use strict';

const request = require('sync-request');
const fs = require('fs').promises;
const jimp = require('jimp');
const config = require('../config.js');

///

const img_paths = {
    image: 'image.png',
    composite: 'composite.png',  
    mask: 'assets/mask.png'
}

async function create_composite ( iss, daylight ) {
    
    const rootpath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : 'tmp/';
    
    let fp_image = rootpath + img_paths.image;
    let fp_composite = rootpath + img_paths.composite;
    let fp_mask = img_paths.mask;

    let img = await get_satellite_image ( iss, daylight )
    let mask = await jimp.read(fp_mask);

    img.composite(mask, 0, 0)

    // img.write(fp_composite)

    let imgsrc;
    await img.getBase64(jimp.MIME_JPEG, (err, src) => {
        imgsrc = src
    })
    return imgsrc
}

async function get_satellite_image( iss, daylight ) {

    let zoom_day = 8;
    let zoom_night = 5.5;
    let imagesize = "736x1105";

    let lat = iss.iss_position.latitude;
    let lng = iss.iss_position.longitude;
    let day_or_night = daylight ? 'day' : 'night';

    let urls = {
        'day': `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},${zoom_day}/${imagesize}?access_token=${config['mapbox_token']}`,
        'night': `https://api.mapbox.com/styles/v1/${config['mapbox_style_night']}/static/${lng},${lat},${zoom_night}/${imagesize}?access_token=${config['mapbox_token']}`
    };

    let res = await request( 'GET', urls[day_or_night] );
    let body = res.getBody();

    let imageBuffer = Buffer.from(body, 'base64');
    let img = await jimp.read(imageBuffer)
    return img
}

async function load_composite( ) {

    const rootpath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : 'tmp/';    
    let fp_composite = rootpath + img_paths.composite;

    try {
        const data = await fs.readFile( fp_composite, { encoding: 'base64' } )
        return data
    } catch (err) {
        console.log(err)
    }
}

const image = {
    create_composite: create_composite,
    load_composite: load_composite
};
module.exports = image;