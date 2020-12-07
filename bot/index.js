const iss = require('./components/iss.js');
const image = require('./components/image.js');
const tweet = require('./components/tweet.js');

///

const files = {
    filename_image: 'image.png',
    filename_image_satellite: 'image_satellite.png',  
    filepath_mask: 'assets/mask.png'
}

///

const run_cupola_bot = () => {

    image.init_image( files, tweet.send_tweet );
    tweet.init_tweet( files );

    let iss_position = iss.get_iss_position();
    let daylight = iss.check_daylight( iss_position );

    image.start_image_processing( iss_position, daylight );
}

exports.handler = function( event, context, callback ) {
    console.log('Run Cupola Bot...');
    run_cupola_bot();
}

if (!process.env.LAMBDA_TASK_ROOT) { 
    run_cupola_bot();
}



