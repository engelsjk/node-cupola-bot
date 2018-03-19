const fs = require('fs');
const twit = require('twit')
const config = require('../config.js');

// REFERENCES

module.exports = {
	sendTweet: sendTweet
};

function sendTweet(image_settings) {
    loadImage(image_settings);
}

function loadImage(image_settings) {
    fs.readFile(image_settings.filepath_image, { encoding: 'base64' }, (err, data) => {
        if (err) { console.error(err) } ;
        var image = data;
        postTweet(image);
    });
}

function postTweet(image){

    if (!('twitter_consumer_key' in config)) {
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

    T.post('media/upload', { media_data: image }, function (err, data, response) {
        if (!err) {
            var mediaIdStr = data.media_id_string
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        } else { console.error(err) }
        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: status, media_ids: [mediaIdStr] }
                T.post('statuses/update', params, function (err, data, response) {
                    console.log('Tweet Sent!')
                })
            } else { console.error(err) }
        })
    })

}