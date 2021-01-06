const station = require('./components/station.js');
const image = require('./components/image.js');
const tweet = require('./components/tweet.js');

///

async function run_cupola_bot() {

    let iss = await station.get_iss();
    let daylight = station.check_daylight( iss );
    let status = tweet.get_status(iss);

    let img = await image.create_composite(iss, daylight)

    if(process.env.DEBUG == "1"){
        console.log("daylight:"+daylight)
        console.log("status:"+status)
        return
    }
    
    await tweet.send_tweet(img, status)
}

exports.handler = function( event, context, callback ) {
    run_cupola_bot()
}

if (!process.env.LAMBDA_TASK_ROOT) { 
    run_cupola_bot()
}