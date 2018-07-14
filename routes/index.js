const TPLSmartDevice = require('tplink-lightbulb')
const express = require('express');
const router = express.Router();
const Datastore = require('nedb')

// [x] Load available alarms
// [x] Load available lights
// [ ] Webpage shows available lights and alarms
// [ ] Create an alarm for a given
//       light id
//       start time
//       end time
//       start color
//       end color
// [ ] Be able to delete an alarm
// [ ] Every ___ seconds check available alarms and set brightness accordingly

const db = new Datastore({ filename: '../data', autoload: true });

const lights = {};
let alarms = [];
db.loadDatabase(() => {
  db.find({}, (err, dbAlarms) => {
    alarms = dbAlarms;
  });
});

TPLSmartDevice.scan()
.on('light', light => {
  lights[light._sysinfo.deviceId] = light;
});

function updateLight() {
  Object.values(lights).forEach(light => {
    light.send({
      "smartlife.iot.smartbulb.lightingservice": {
        transition_light_state : {
          ignore_default: 1,
          transition_period: 10000000, // Not sure how hight this goes. at least 1000000
          hue: 180, // Hue is 0 to 360
          saturation: 100, // Saturation is 0 to 100
          brightness: 100, // Brightness is 0 to 100
          color_temp: 0 // Color temp is 0 to 100?
        }
      }
    });
    console.log('sent');
  });
}

// setInterval(() => {
//   updateLight();
// }, 2000);
// updateLight();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Alarm Clock',
    lights: Object.values(lights),
    alarms: Object.values(alarms)
  });
});

router.post('/alarm', function(req, res, next) {
  res.send({ foo: 'bar' });
});

module.exports = router;
