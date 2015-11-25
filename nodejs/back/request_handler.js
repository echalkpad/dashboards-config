/**
 * Created by Quentin on 11/24/2015.
 */

var express = require("express"),
    sensor = require("./sensors_information")
    router = express.Router();


router.get('/office/:officeNumber/temperature', function(req, res) {
    var date = req.query.date;
    res.setHeader('Content-Type', 'application/json');
    sensor.getDeskTemperature(date,req.params.officeNumber,res);
});


router.get('/office/:officeNumber/window_status', function(req, res) {
    sensor.getWindowsState(res, req.params.officeNumber)
});

router.get('/office/:officeNumber/ac_status', function(req, res) {
    sensor.getAirConditionnerState(res, req.params.officeNumber)
});





module.exports = router;
