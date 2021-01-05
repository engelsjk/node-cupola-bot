const station = require('./components/station.js');
const image = require('./components/image.js');
const tweet = require('./components/tweet.js');

///

const fpaths = {
    filename_image: 'image.png',
    filename_image_satellite: 'image_satellite.png',  
    filepath_mask: 'assets/mask.png'
}

///

const noop = () => {};

const run_cupola_bot = () => {

    var f = tweet.send_tweet;

    if(process.env.DEBUG == "1"){
	    f = noop;
    }

    image.init_image( fpaths, f );
    tweet.init_tweet( fpaths );

    let iss = station.get_iss();
    let daylight = station.check_daylight( iss );

    if(process.env.DEBUG == "1"){
        let d = new Date(iss.timestamp*1000);
        let ts = d.toUTCString("en-US", {timeZoneName: "short"}).slice(-11);
    	console.log(`${iss.iss_position.latitude},${iss.iss_position.longitude} @ ${ts}`);
    }

    image.start_image_processing( iss, daylight );
}

exports.handler = function( event, context, callback ) {
    console.log('run_cupola_bot...');
    run_cupola_bot();
}

if (!process.env.LAMBDA_TASK_ROOT) { 
    run_cupola_bot();
}



