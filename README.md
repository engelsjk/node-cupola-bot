# node-cupola-bot
The Overview Effect courtesy of the ISS Cupola and Mapbox imagery!

![](images/cupola-header.png)

### WHAT IS THIS?

### INSPIRATION

[![](images/inspiration.jpg)](https://twitter.com/archillect/status/975441719520120837)

### HOW DOES IT WORK?

* Get the current location of the International Space Station from http://open-notify.org/Open-Notify-API/ISS-Location-Now/
* Calculate sunrise/sunset times for the ISS location using mourner's [SunCalc package](https://github.com/mourner/suncalc)
* Next, get an image from the Mapbox Static API...
  * If it's day time, use the basic Mapbox Satellite imagery.
  * If it's night time, use a custom Mapbox style made w/ NASA's Suomi NPP VIIRS night lights imagery.
* Overlay a transparent cupola window image on top of the satellite image.
* Then enjoy the Overview Effect!



### HOW TO RUN

The project is set up to run either locally or as a Lambda function. To run locally, you'll need to create a config.js file with your own Mapbox and Twitter credentials (if needed). If no Twitter credentials are included in config.js, it'll still save an image locally.

~~~~
module.exports = {
  mapbox_token: '[MAPBOX_ACCESS_TOKEN]',
}
~~~~

Once you have your config.js, you should just be able to run the main index.js file!

~~~~
node index.js
~~~~

A new cupola image should then save to the tmp directory!
