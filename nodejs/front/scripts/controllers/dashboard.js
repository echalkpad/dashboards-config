/**
 * Created by Garance on 05/01/2016.
 */

    //Ca, ça va pas du tout. Ca fait que ca dépend de comment t'as rempli tes boites, et c'tout !
var existingPositions = ['left2', 'right2', 'right1', 'left1', 'right3', 'left3'];
var watchingArray = [{"dataSC":[], "counter":[]}, {"dataSC":[], "counter":[]}, {"dataSC":[], "counter":[]}, {"dataSC":[], "counter":[]}];
var theNeeds = JSON.parse(localStorage.getItem("bar"));
localStorage.removeItem("bar");
console.log(theNeeds);
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
    //this works only if they are regular widgets.
    //if i want the boolean to work the same way...
    if (theNeeds[index].graphType == 'line' || theNeeds[index].graphType == 'column') {
        console.log('line or column widget');
        //TODO:probleme si les callbacks sont pas dans l'ordre que j'imagine là...
        watchingArray[index].dataSC.push({"name": sensor.title, "data": data.data});
        waitForFirstWidgetDrawing(firstWidgetData, sensor, index);
    }
    else if (theNeeds[index].graphType == 'boolean') {
        //then i'm in AC or window !
        console.log('boolean widget !');
        goDrawBoolean(data, sensor, index);
    }
    else if (theNeeds[index].graphType == 'pieChart') {
        watchingArray[index].dataSC.push({"name": "Open", "y": data.data[0].open});
        watchingArray[index].dataSC.push(doorPercentage[1] = {"name": "Close", "y": data.data[1].close});
        goDrawPie(sensor, index);
    }
    else if (theNeeds[index].graphType == 'mix') {

        //in case it's noise
        //It seems we can keep on putting stuff in the watching array. after all....
        watchingArray[index].dataSC.push({"name": sensor.title, "data": data.data, "yAxis": 1});
        //in case it's a mix, here is what we want to do with the other result
        //problem : we want ONLY the open result. the name we can use the one we have it's ok
        //not sure we really need the split list for a mix... the open though i guess i needed
        watchingArray[index].dataSC.push({"name" : sensor.title, "data": data.data[0].open});

    }
    else if (theNeeds[index].graphType == 'scatter') {
        //this is what happens to the data we get from a split, for a scatterplot
        //as far as we know, the only times we want a scatter is to see open or closed doors
        watchingArray[index].dataSC.push({"name": "open",  color: 'rgba(119, 152, 191, .5)' , "data": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "close" ,color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close});
    }
};

var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};

//TODO: demander à l'utilisateur les dates qu'il veut

var allLoaded = 0;
var finishedLoading = function () {
    if (allLoaded < theNeeds.length - 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

var firstWCode;
//An array of as many arrays as we have widgets.
var waitForFirstWidgetDrawing = function (dataSC, sensor, index) {
    //TODO: dans la generation, si je dis type = temperature, tu devines le titre.
    //Pour le moment, je mets autre chose du coup c'est pas fou.
    console.log('********************');
    console.log(watchingArray[index]);
    if (watchingArray[index].counter.length < theNeeds[index].sensors.length) {
        watchingArray[index].counter.push(sensor);
    }
    if (watchingArray[index].counter.length == theNeeds[index].sensors.length) {
        generate.widgetV2("Title not defined", theNeeds[index].graphType,
            watchingArray[index].counter
            , existingPositions[index], "watchingArray[index].dataSC", function (data) {
                firstWCode = data;
                eval(firstWCode); //TODO:is this the right place for eval ?
                finishedLoading();
            }, errorOccurred);
    }
};

var boolCode;
var goDrawBoolean = function (data, sensor, index) {
    generate.widgetBoolean(existingPositions[index], "data", sensor.booleanTitle, function (result) {
        boolCode = result;
        eval(boolCode);
        finishedLoading();
    }, errorOccurred);
};

var goDrawPie = function(sensor, index) {
    generate.widgetPie(existingPositions[index], sensor.booleanTitle, "watchingArray[index].dataSC", function(data) {
        eval (data);
        finishedLoading();
    }, errorOccurred);
};

var firstWidgetData = [];

var layoutChosen = function (layoutHTML) {
    //layout insertion
    var div = document.getElementById('dashboard');
    div.insertAdjacentHTML('afterbegin', layoutHTML);

//Quick and dirty definition !
    theNeeds.forEach(function (aNeed, index) {
        if (aNeed.sensors.length > 0) { //we only do that if you asked for some sensors !
            //Besoin de connaître le type de graphe pour savoir la route exacte que je vais demander à SC.
            aNeed.additionnal = '';

            if (aNeed.graphType == 'line' || aNeed.graphType == 'column' || aNeed.graphType == 'mix'
                || aNeed.graphType == 'pieChart' || aNeed.graphType == 'scatter' ) {
                aNeed.scRoute = '/data';
            }
            if (aNeed.graphType == 'column') {
                aNeed.withParam = true;
            }
            if (aNeed.graphType == 'mix' || aNeed.graphType == 'scatter' ) {
                aNeed.additionnal = '/splitlist';
                aNeed.withParam = true;
            }
            if (aNeed.graphType == 'pieChart') {
                aNeed.additionnal = '/percent';
            }
            //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.
            aNeed.sensors.forEach(function (sensor) {
                if (sensor.name == "TEMP_CAMPUS") {
                    sensor.type = "temperature";
                    sensor.title = "Outside Temperature";
                }
                else if (sensor.name == "TEMP_443V") {
                    sensor.type = "temperature";
                    sensor.title = "Inside Temperature";
                }
                else if (sensor.name == "AC_443STATE") {
                    sensor.type = "number";
                    sensor.title = "time AC is on";
                    sensor.booleanTitle = "AC"
                }
                else if (sensor.name == "WINDOW443STATE") {
                    sensor.type = "number";
                    sensor.title = "times the window got opened";
                    sensor.booleanTitle = "Window"
                }
                else if (sensor.name == "NOISE_SPARKS_CORRIDOR") {
                    sensor.title = "Noise";
                    sensor.type = "decibel";
                    //The other elements of a mix graph will require splitdata and all, but not him...
                    retrieveData.askForSeries(sensor.name + aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
                else if (sensor.name == "DOOR443STATE") {
                    sensor.title = "times the door got opened";
                    sensor.type = "number";
                    sensor.booleanTitle = "Door"
                }
                else {
                    console.log('jai pas compris le capteur que tu voulais');
                }
                if (sensor.percent) {
                    console.log('hé tas dit percent');
                    sensor.type='percent';
                    sensor.title = '% of ' + sensor.title;
                }
                //The service could provide me with the info I will lack ! eg. everything i just gathered...
                //then we have to ask for series with a param !!!!

                if (aNeed.withParam) {
                    retrieveData.askForSeriesWithParam(sensor.name + aNeed.scRoute + aNeed.additionnal, aNeed.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
                else if (aNeed.graphType == 'boolean') {
                    retrieveData.askForStateNow(sensor.name, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
                else {
                    retrieveData.askForSeries(sensor.name + aNeed.scRoute + aNeed.additionnal, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
            });
        }
    });
};