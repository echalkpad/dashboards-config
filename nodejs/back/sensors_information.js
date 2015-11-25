/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus");


function getDeskTemperature(date, officeNumber ,callback) {           // 2015-09-01 00:00:00/2015-10-01 00:00:00
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", date, true, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);

            var responseInGoodFormat = {"data": []};
            var temperaturePerTime = [];

            for(var i in tempPerTime.values) {
                temperaturePerTime.push(tempPerTime.values[i].date);
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
            }
            responseInGoodFormat.data.push(temperaturePerTime);

            callback.send(responseInGoodFormat);
        })
    });
}


function getCampusTemperature(date, callback) {
    requestSmartcampus.getSensorData("TEMP_CAMPUS", date, true, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
            stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);

            var responseInGoodFormat = {"data": []};
            var temperaturePerTime = [];

            for(var i in tempPerTime.values) {
                temperaturePerTime.push(tempPerTime.values[i].date);
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
            }

            responseInGoodFormat.data.push(temperaturePerTime);
            console.log(responseInGoodFormat);
            callback.send(responseInGoodFormat);
        })
    });
}


function getDoorsState(callback) {
    requestSmartcampus.getSensorData("DOOR443STATE", "", true, function (res) {
        var stringData = "";



        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}


function getWindowsState(callback, officeNumber) {
    requestSmartcampus.getLastSensorData("WINDOW" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}

// TODO : si on veut normaliser faudrait que le capteur soit sur /AC443 et pas /AC_443 (meme synthase que la fenetre)
function getAirConditionerState(callback, officeNumber) {
    requestSmartcampus.getLastSensorData("AC_" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}



exports.getAirConditionerState = getAirConditionerState;
exports.getDeskTemperature = getDeskTemperature;
exports.getWindowsState = getWindowsState;
exports.getCampusTemperature = getCampusTemperature;