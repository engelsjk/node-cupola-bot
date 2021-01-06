'use strict';

const twit = require('twit')
const config = require('../config.js');

///

function get_status( iss ) {
    let d = new Date(iss.timestamp*1000);
    let ts = d.toISOString("en-US", {timeZoneName: "short"}).slice(-13,-5) + "Z";
    let status = `${iss.iss_position.latitude},${iss.iss_position.longitude} @ ${ts}`
    return status;
}

async function send_tweet ( img, status ) {

    if ( !('twitter_consumer_key' in config) ) {
        console.log('no twitter credentials found!');
        return
    }

    img = img.slice(23)
    
    var altText = `cupola bot: ${status}`;

    var T = new twit({
        consumer_key:         config['twitter_consumer_key'],
        consumer_secret:      config['twitter_consumer_secret'],
        access_token:         config['twitter_access_token'],
        access_token_secret:  config['twitter_access_token_secret'],
        timeout_ms:           60*1000
    })

    T.post( 'media/upload', { media_data: img }, function (err, data, response) {
        if (!err) {
            var mediaIdStr = data.media_id_string
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        } else { console.error(err) }
        T.post( 'media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: status, media_ids: [mediaIdStr] }
                T.post('statuses/update', params, function (err, data, response) {
                    console.log('tweet_sent')
                })
            } else { console.error(err) }
        })
    })

}

const tweet = {
    get_status: get_status,
    send_tweet: send_tweet
};
module.exports = tweet;