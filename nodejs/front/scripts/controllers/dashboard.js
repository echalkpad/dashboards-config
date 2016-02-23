/**
 * Created by Garance on 05/01/2016.
 */

//Ca, ça va pas du tout. Ca fait que ca dépend de comment t'as rempli tes boites, et c'tout !
var existingPositions = [];

var watchingArray = [{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []}];


////////////////////////////// Generic function to fire in case of server error ///////////////////////////////////////
var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};



////////////////////////////// Retrieving the needs stored from previous page //////////////////////////////////////////
var allWidgets = JSON.parse(localStorage.getItem("widgetsDescription"));
beginDate = localStorage.getItem("startDate");
endDate = localStorage.getItem("endDate");

localStorage.removeItem("widgetsDescription");
if (allWidgets === null) {
    errorOccurred()
}
if (localStorage.getItem("dashboardTitle") !== null) {
    $("#theGeneralTitle").html(localStorage.getItem("dashboardTitle"));
} //else we just don't write any title

if (beginDate == 'undefined' || endDate == 'undefined') {
    beginDate = '2015-08-21 8:00:11';
    endDate = '2015-10-21 18:00:11';
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
    var thisSensor = $("#loadingSensor"+sensor.name+index).find(".loadingImg").hide();
    $(document.createElement('span')).attr("class", "glyphicon glyphicon-ok").appendTo(thisSensor);

    if (allWidgets[index].graphType == 'line' || allWidgets[index].graphType == 'column' || allWidgets[index].graphType == 'mix') {
        if (sensor.unit == "decibel") {
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data, "yAxis": 1});
        } else if (sensor.name == "DOOR443STATE" || sensor.name == "WINDOW443STATE") { //oops c'est sale
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data[0].open});
        }
        else {
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        }
        waitForOtherSensorsToDraw(sensor, index);
    }
    else if (allWidgets[index].graphType == 'boolean') {
        goDrawBoolean(data, sensor, index);
    }
    else if (allWidgets[index].graphType == 'pieChart') {
        watchingArray[index].dataSC.push({"name": "Open", "y": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "Close", "y": data.data[1].close});
        goDrawPie(sensor, index);
    }
    else if (allWidgets[index].graphType == 'scatterplot') {
        //this is what happens to the data we get from a split, for a scatterplot
        //as far as we know, the only times we want a scatter is to see open or closed doors
        watchingArray[index].dataSC.push({"name": "open", color: 'rgba(119, 152, 191, .5)', "data": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "close", color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close});
        goDrawScatterPlot(index);
    }
};

var allLoaded = 0;
var finishedLoading = function () {
    if (allLoaded < allWidgets.length - 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

//An array of as many arrays as we have widgets.
var waitForOtherSensorsToDraw = function (sensor, index) {

    if (watchingArray[index].dataSC.length <= allWidgets[index].sensors.length) {
        if (watchingArray[index].counter.length > 0 && watchingArray[index].counter[0].unit == sensor.unit) {
            watchingArray[index].counter[0].amount += 1;
        }
        else if (watchingArray[index].counter.length > 1 && watchingArray[index].counter[1].unit == sensor.unit) {
            watchingArray[index].counter[1].amount += 1;
        }
        else {
            watchingArray[index].counter.push({
                "unit": sensor.unit,
                "title": sensor.unit,
                "amount": 1
            });
        }
    }
    if (watchingArray[index].dataSC.length == allWidgets[index].sensors.length) {
        var $thisWidget = $("#loadingNeed"+index).find(".loadingImg").hide();
        $thisWidget.find(".glyphicon").show();
        if (allWidgets[index].graphType == "mix") {
            allWidgets[index].graphType = "";
        }
        console.log(watchingArray[index].dataSC);
        generate.widget(allWidgets[index].title, allWidgets[index].graphType,
            watchingArray[index].counter
            , existingPositions[index], "watchingArray[index].dataSC", function (data) {
                $thisWidget.hide();
                eval(data);
                finishedLoading();
            }, errorOccurred);
    }
};

var goDrawScatterPlot = function (index) {
    var $thisWidget = $("#loadingNeed"+index).find(".loadingImg").hide();
    $thisWidget.find(".glyphicon").show();
    generate.widget(allWidgets[index].title, "scatter", "", existingPositions[index],
        "watchingArray[index].dataSC", function (data) {
            $thisWidget.hide();
            eval(data);
            finishedLoading();
        }, errorOccurred);
};

var goDrawBoolean = function (data, sensor, index) {
    var $thisWidget = $("#loadingNeed"+index).find(".loadingImg").hide();
    $thisWidget.find(".glyphicon").show();
    generate.widgetBoolean(existingPositions[index], "data", allWidgets[index].title, function (result) {
        $thisWidget.hide();
        eval(result);
        finishedLoading();
    }, errorOccurred);
};

var goDrawPie = function (sensor, index) {
    var $thisWidget = $("#loadingNeed"+index).find(".loadingImg").hide();
    $thisWidget.find(".glyphicon").show();
    generate.widgetPie(existingPositions[index], allWidgets[index].title, "watchingArray[index].dataSC", function (data) {
        $thisWidget.hide();
        eval(data);
        finishedLoading();
    }, errorOccurred);
};

var layoutChosen = function (layoutName, layoutAnswer) {
    //layout insertion

    var loadingLayoutDiv = $(document.createElement('div'));
    loadingLayoutDiv.attr("id", "loadingLayout");
    loadingLayoutDiv.html("Layout generation ");
    $(document.createElement('img')).attr("src", "/assets/images/loading.gif").attr("class", "loadingImg").appendTo(loadingLayoutDiv);

    loadingLayoutDiv.appendTo($("#loadingImg"));

    var div = document.getElementById('dashboard');

    //After getting the layout generated, the same server has to give us the list of the div ids it created.
    layouts.widgetsIds(layoutName, function (widgetsArray) {

        loadingLayoutDiv.find(".loadingImg").hide();
        $(document.createElement('span')).attr("class", "glyphicon glyphicon-ok").appendTo(loadingLayoutDiv);

        existingPositions = widgetsArray;
        div.insertAdjacentHTML('afterbegin', layoutAnswer);

        allWidgets.forEach(function (widget, index) {
            if (widget.sensors.length > 0) { //we only do that if you asked for some sensors !
            
                var loadingANeed = $(document.createElement('div'));
                loadingANeed.attr("id", "loadingNeed"+index);
                loadingANeed.appendTo($("#"+existingPositions[index]));
                loadingANeed.html("The widget \""+widget.title+"\"");
                $(document.createElement('img')).attr("src", "/assets/images/loading.gif").attr("class", "loadingImg").appendTo(loadingANeed);
                $(document.createElement('span')).attr("class", "glyphicon glyphicon-ok").appendTo(loadingANeed).hide();

                widget.additionnal = '';
                if (widget.graphType == 'column' || widget.graphType == 'scatterplot') {
                    widget.withParam = true;
                }
                if (widget.graphType == 'scatterplot') {
                    widget.additionnal = '/splitlist';
                }
                if (widget.graphType == 'pieChart') {
                    widget.additionnal = '/percent';
                }
                //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.

                widget.sensors.forEach(function (sensor) {
                    var loadingASensor = $(document.createElement('div'));
                    loadingASensor.attr("id", "loadingSensor"+sensor.name+index);
                    loadingASensor.appendTo($("#loadingNeed"+index));
                    loadingASensor.html("The sensor \""+sensor.displayName +"\"");
                    $(document.createElement('img')).attr("src", "/assets/images/loading.gif").attr("class", "loadingImg").appendTo(loadingASensor);


                    widget.withParam = false;
                    if (sensor.percent) {
                        sensor.unit = 'percent';
                        sensor.description = '% of ' + sensor.description;
                        widget.withParam = true;
                    }
                    //Je veux splitlist dans le cas d'une porte ou d'une fenêtre : ce sera sans doute dans le cas de
                    // n'importe quelle porte ou fenêtre, en fait -> il me faudrait bien un kind là...
                    //Je ne peux pas dire quand j'ai STATE, parce que heating par exemple, c'est un state aussi
                    //et je veux param mais pas state
                    //pourquoi pas true quand j'ai un state ?
                    if (sensor.name == "DOOR443STATE" || sensor.name == "WINDOW443STATE") {
                        widget.additionnal = '/splitlist';
                        widget.withParam = true;
                    }
                    else if (sensor.name == "HEATING_443") {
                        widget.withParam = true;
                    }
                    if (widget.graphType == 'boolean') {
                        retrieveData.askForStateNow(sensor.name, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else if (widget.withParam) {
                        retrieveData.askForSeriesWithParam(sensor.name + '/data' + widget.additionnal, widget.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else {
                        retrieveData.askForSeries(sensor.name + '/data' + widget.additionnal, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                });
            }
        });

    }, errorOccurred);

};