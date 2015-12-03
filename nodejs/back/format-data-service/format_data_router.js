/**
 * Created by Quentin on 11/30/2015.
 */

var express = require("express"),
    request_handler = require("./request_handler"),
    router = express.Router();


/**
 *
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    request_handler.requestSensors(queries,res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "", state = false;
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    if(req.query.state !== undefined) {
        state = req.query.state;
    }

    request_handler.getSensorInformation(sensorId, date, state,res);
});


router.get("/sensor/:sensorId/data/percent", function(req, res) {
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    request_handler.getInformationInPercent(req.params.sensorId, date, res);
});


router.get("/sensor/:sensorId/data/splitList", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }

    request_handler.getStateInformationSplit(sensorId, date,res);
});


router.get("/sensor/:sensorId/data/last", function(req, res) {
    var sensorId = req.params.sensorId;
    request_handler.getLastInformation(sensorId, res);
});

module.exports = router;