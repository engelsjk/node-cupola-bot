'use strict';

const fs = require('fs');
const twit = require('twit')
const config = require('../config.js');

///

var settings = {};

const init_tweet = ( files ) => {
    const rootpath = process.env.LAMBDA_TASK_ROOT ? '/tmp/' : 'tmp/';
    settings.filepath_image = rootpath + files.filename_image;
}

const send_tweet = ( ) => {
    load_image( );
}

const load_image = ( ) => {
    fs.readFile( settings.filepath_image, { encoding: 'base64' }, (err, image) => {
        if (err) { console.error(err) } ;
        post_tweet( image );
    });
}

const post_tweet = ( image ) => {

    if ( !('twitter_consumer_key' in config) ) {
        console.log('No Twitter credentials found!');
        return
    }

    var status = '';
    var altText = 'cupola-bot';

    var T = new twit({
        consumer_key:         config['twitter_consumer_key'],
        consumer_secret:      config['twitter_consumer_secret'],
        access_token:         config['twitter_access_token'],
        access_token_secret:  config['twitter_access_token_secret'],
        timeout_ms:           60*1000
    })

    T.post( 'media/upload', { media_data: image }, function (err, data, response) {
        if (!err) {
            var mediaIdStr = data.media_id_string
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        } else { console.error(err) }
        T.post( 'media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: status, media_ids: [mediaIdStr] }
                T.post('statuses/update', params, function (err, data, response) {
                    console.log('Tweet Sent!')
                })
            } else { console.error(err) }
        })
    })

}

const tweet = {
    init_tweet: init_tweet,
    send_tweet: send_tweet
};
module.exports = tweet;